document.addEventListener('DOMContentLoaded', () => {
    const airQualityData = JSON.parse(localStorage.getItem('airQualityData')); // Retrieve the air quality data from localStorage

    if (airQualityData) {
        displayAirQualityData(airQualityData); // Call the function to display the data
    } else {
        document.getElementById('airQualityContainer').innerText = 'No air quality data available.';
    }
});

// Function to display the air quality data on the webpage.
function displayAirQualityData(data) {
    const container = document.getElementById('airQualityContainer'); // Get the container to display the data

    // Display Date and Region Code
    const dateTime = document.createElement('p');
    dateTime.textContent = `Date/Time: ${data.dateTime}`;
    container.appendChild(dateTime);

    const regionCode = document.createElement('p');
    regionCode.textContent = `Region: ${data.regionCode}`;
    container.appendChild(regionCode);

    // Display Indexes
    const indexes = data.indexes;
    indexes.forEach(index => {
        const indexElement = document.createElement('div');
        indexElement.innerHTML = `
            <h3>${index.displayName} (${index.code})</h3>
            <p>AQI: ${index.aqi} (${index.category})</p>
            <p>Dominant Pollutant: ${index.dominantPollutant}</p>
        `;
        container.appendChild(indexElement);
    });

    // Display Pollutants
    const pollutants = data.pollutants;
    pollutants.forEach(pollutant => {
        const pollutantElement = document.createElement('div');
        pollutantElement.innerHTML = `
            <h3>${pollutant.displayName} (${pollutant.code})</h3>
            <p>Concentration: ${pollutant.concentration.value} ${pollutant.concentration.units}</p>
            <p>Sources: ${pollutant.additionalInfo.sources}</p>
            <p>Effects: ${pollutant.additionalInfo.effects}</p>
        `;
        container.appendChild(pollutantElement);
    });

    // Display Health Recommendations
    const healthRecommendations = data.healthRecommendations;
    const recommendationsElement = document.createElement('div');
    recommendationsElement.innerHTML = `
        <h3>Health Recommendations</h3>
        <p>General Population: ${healthRecommendations.generalPopulation}</p>
        <p>Elderly: ${healthRecommendations.elderly}</p>
        <p>Lung Disease Population: ${healthRecommendations.lungDiseasePopulation}</p>
        <p>Heart Disease Population: ${healthRecommendations.heartDiseasePopulation}</p>
        <p>Athletes: ${healthRecommendations.athletes}</p>
        <p>Pregnant Women: ${healthRecommendations.pregnantWomen}</p>
        <p>Children: ${healthRecommendations.children}</p>
    `;
    container.appendChild(recommendationsElement);
}
