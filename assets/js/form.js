// Weatherbit API Key 
const weatherbitApiFirst = "db5c41aaa3f341d";
const weatherbitApiSecond = "7919eb2e3235fea1d";
const weatherbitApi = `${weatherbitApiFirst}${weatherbitApiSecond}`;

// Grab modal buttons by class and id
const submitButton = document.getElementById('submit-form');
const modal = document.getElementById('modal-element');
const closeModal = document.querySelector('.modal .delete');
const cancelModal = document.querySelector('#cancel-button');
const openModal = document.getElementById('modal-button');

// Functions to open and close modal
openModal.addEventListener('click', function(){
    modal.classList.add('is-active');
    document.getElementById('modal-form').reset();
    console.log('open modal click');
})

closeModal.addEventListener('click', function(){
    modal.classList.remove('is-active');
    console.log('close modal click');
})

// API fetch request to put random quote at top of screen
const getRandomQuote = function() {
    fetch("https://type.fit/api/quotes")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomQuote = data[randomIndex].text;
        
        const quoteDiv = document.querySelector('#quote-area');
        const quoteParagraph = document.createElement('p');

        quoteParagraph.textContent = `"${randomQuote}"`;

        quoteDiv.appendChild(quoteParagraph);
    })
    .catch(function(error) {
        console.error('Error fetching quotes: ', error);
    });
}

getRandomQuote();

submitButton.addEventListener('click', function(event) {
    event.preventDefault ();
    console.log('submit Button Clicked');

    // grab form values
    const destination = document.getElementById('destination-answer').value.trim();
    const activities = document.getElementById('activities-answer').value;
    const thoughts = document.getElementById('thoughts-answer').value;
    const reason = document.getElementById('reason-answer').value;
    const visit = document.getElementById('visit-answer').value;

    // creating new div to hold form info
    const newDiv = document.createElement('div');

    newDiv.classList.add('card');
    newDiv.classList.add('is-rounded');
    newDiv.classList.add('has-background-primary-40');
    newDiv.classList.add('mr-5');
    newDiv.setAttribute("id", "journal-entry");

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    const media = document.createElement('div');
    media.classList.add('media');

    const mediaContent = document.createElement('div');
    mediaContent.classList.add('media-content');

    const destinationP = document.createElement('p');
    destinationP.textContent = destination;

    const otherContent = document.createElement('div');
    otherContent.classList.add('content');
    otherContent.innerHTML = `

        <p> Activities: ${activities} </p>
        <p> Thoughts: ${thoughts} </p>
        <p> Reason: ${reason} </p>
        <p> Visit: ${visit} </p>
        `;

    mediaContent.appendChild(destinationP);
    media.appendChild(mediaContent);
    cardContent.appendChild(media);
    cardContent.appendChild(otherContent);
    newDiv.appendChild(cardContent);
    document.getElementById('modal-output').appendChild(newDiv);

    appendForecastToNewDiv(newDiv, destination).then(forecastArray => {
        const journalHistory = JSON.parse(localStorage.getItem("journalHistory")) || [];
        journalHistory.push({
            destination,
            activities,
            thoughts,
            reason,
            visit,
            temperature: forecastArray[0].temperature,
            icon: forecastArray[0].icon,
        }) 
        localStorage.setItem('journalHistory', JSON.stringify(journalHistory));
        console.log('journal history saved');
    });

    modal.classList.remove('is-active');
    console.log('modal closed after submit');
})

const appendForecastToNewDiv = function(newDiv, destination) {
    const weatherbitUrl = `https://api.weatherbit.io/v2.0/current?city=${destination}&key=${weatherbitApi}`

    return fetch(weatherbitUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json().then(function (data) {
                    console.log(data);
                    let forecastArray = data.data.map(forecast => {
                        return {
                            city: forecast.city_name,
                            temperature: forecast.app_temp,
                            icon: forecast.weather.icon,
                        };
                    });

                    const currentWeatherDiv = document.createElement('div');
                    currentWeatherDiv.classList.add('is-flex');
                    currentWeatherDiv.classList.add('is-flex-direction-column');
                    currentWeatherDiv.classList.add('is-align-items-center');
                    const currentWeatherIcon = document.createElement('img');
                    const currentWeatherBody = document.createElement('p');
                    currentWeatherBody.classList.add('pb-5');
                
                    // URL For weather icons
                    const weatherbitIconUrl = `https://cdn.weatherbit.io/static/img/icons/${forecastArray[0].icon}.png`;
                    currentWeatherIcon.src = weatherbitIconUrl;
                    currentWeatherBody.innerHTML = `<p> Temperature: ${forecastArray[0].temperature} </p>`;

                    currentWeatherDiv.appendChild(currentWeatherIcon);
                    currentWeatherDiv.appendChild(currentWeatherBody);
                    newDiv.appendChild(currentWeatherDiv);

                    return forecastArray;
                });
            }
        }) 
};

document.getElementById('modal-form').reset()

document.addEventListener('DOMContentLoaded', function(){
    const modalOutputDiv = document.querySelector('#modal-output');
    modalOutputDiv.innerHTML = '';

    const journalHistory = JSON.parse(localStorage.getItem("journalHistory")) || [];

    journalHistory.forEach(entry => {
        const newDiv = document.createElement('div');
        newDiv.classList.add('card');
        newDiv.classList.add('is-rounded');
        newDiv.classList.add('has-background-primary-40');
        newDiv.classList.add('mr-5');
        newDiv.setAttribute("id", "journal-entry");

        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        const media = document.createElement('div');
        media.classList.add('media');

        const mediaContent = document.createElement('div');
        mediaContent.classList.add('media-content');

        const destinationP = document.createElement('p');
        destinationP.textContent = entry.destination;

        const otherContent = document.createElement('div');
        otherContent.classList.add('content');
        otherContent.innerHTML = `
            <p> Activities: ${entry.activities} </p>
            <p> Thoughts: ${entry.thoughts} </p>
            <p> Reason: ${entry.reason} </p>
            <p> Visit: ${entry.visit} </p>
        `;
        
        mediaContent.appendChild(destinationP);
        media.appendChild(mediaContent);
        cardContent.appendChild(media);
        cardContent.appendChild(otherContent);

        const currentWeatherDiv = document.createElement('div');
        currentWeatherDiv.classList.add('is-flex');
        currentWeatherDiv.classList.add('is-flex-direction-column');
        currentWeatherDiv.classList.add('is-align-items-center');
        const currentWeatherIcon = document.createElement('img');
        const currentWeatherBody = document.createElement('p');
        currentWeatherBody.classList.add('pb-5');
    
        // URL For weather icons
        const weatherbitIconUrl = `https://cdn.weatherbit.io/static/img/icons/${entry.icon}.png`;
        currentWeatherIcon.src = weatherbitIconUrl;
        currentWeatherBody.innerHTML = `<p> Temperature: ${entry.temperature} </p>`;

        currentWeatherDiv.appendChild(currentWeatherIcon);
        currentWeatherDiv.appendChild(currentWeatherBody);

        newDiv.appendChild(cardContent);
        newDiv.appendChild(currentWeatherDiv);


        document.getElementById('modal-output').appendChild(newDiv);
    });
    console.log('journal history loaded')

})



    
