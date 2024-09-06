document.addEventListener('DOMContentLoaded', () => {
    const storedData = JSON.parse(localStorage.getItem('airQualityData')); // Retrieve the stored data from localStorage

    if (storedData && storedData.airQualityData) {
        displayAirQualityData(storedData); // Call the function to display the data
    } else {
        document.getElementById('airQualityContainer').innerText = 'No air quality data available.';
    }

    // Health recommendations data from the API
    const healthRecommendations = {
        generalPopulation: "If you start to feel respiratory discomfort such as coughing or breathing difficulties, consider reducing the intensity of your outdoor activities. Try to limit the time you spend near busy roads, construction sites, open fires, and other sources of smoke.",
        athletes: "Reduce the intensity of your outdoor activities. It is recommended to limit the time you are near busy roads, construction sites, open fires, and other sources of smoke. In addition, consider reducing the time you spend near industrial emission stacks. Staying indoors with an activated air filtration system would be best for your long term health.",
        children: "Reduce the intensity of your outdoor activities. It is recommended to limit the time you are near busy roads, construction sites, open fires, and other sources of smoke. Staying indoors with an activated air filtration system would be best for your long term health.",
        elderly: "Reduce the intensity of your outdoor activities. It is recommended to limit the time you are near busy roads, construction sites, open fires, and other sources of smoke. Staying indoors with an activated air filtration system would be best for your long term health.",
        heartDiseasePopulation: "Reduce the intensity of your outdoor activities. Keep relevant medication(s) available and consult a doctor with any questions. It is recommended to limit the time you are near busy roads, construction sites, open fires, and other sources of smoke. In addition, consider reducing the time you spend near industrial emission stacks. Staying indoors with an activated air filtration system would be best for your long term health.",
        lungDiseasePopulation: "Reduce the intensity of your outdoor activities. Keep relevant medication(s) available and consult a doctor with any questions. It is recommended to limit the time you are near busy roads, open fires, and other sources of smoke. In addition, consider reducing the time you spend near industrial emission stacks. Staying indoors with an activated air filtration system would be best for your long term health.",
        pregnantWomen: "To keep you and your baby healthy, reduce the intensity of your outdoor activities. It is recommended to limit the time you are near busy roads, construction sites, open fires, and other sources of smoke. Staying indoors with an activated air filtration system would be best for your long term health."
    };

    // Default recommendation to display (general population)
    const recommendationBox = document.getElementById('healthRecommendation');
    recommendationBox.textContent = healthRecommendations.generalPopulation;

    // Event listener for dropdown change
    const categorySelect = document.getElementById('categorySelect');
    categorySelect.addEventListener('change', (event) => {
        const selectedCategory = event.target.value;
        recommendationBox.textContent = healthRecommendations[selectedCategory];
    });
});

function goBack() {
    window.location.href = 'index.html';
}

// Function to display the air quality data on the webpage.
function displayAirQualityData(storedData) {
    const data = storedData.airQualityData;

    // Display Location Name
    document.getElementById('locationName').textContent = `${storedData.location}`;

    // Display Current Date
    document.getElementById('currentDate').textContent = `${new Date(data.dateTime).toLocaleDateString()}`;

    // Display AQI Category
    const pollutionLevel = data.indexes.find((index) => index.code === 'usa_epa');
    const aqiCategoryDiv = document.getElementById('aqiCategory');
    aqiCategoryDiv.textContent = `AQI Category: ${pollutionLevel.category}`;

    // Set tree color based on AQI
    const aqiColor = pollutionLevel.color ? convertToRGB(pollutionLevel.color) : '#228B22';
    const treeLeaves = document.querySelectorAll('.leaves');
    treeLeaves.forEach(leaf => {
        leaf.style.backgroundColor = aqiColor;
    });
    aqiCategoryDiv.style.color = aqiColor;

    // Display Dominant Pollutant and Source
    const dominantPollutant = pollutionLevel.dominantPollutant;
    const pollutantDetails = data.pollutants.find(pollutant => pollutant.code === dominantPollutant);

    document.getElementById('dominantPollutant').textContent = `Dominant Pollutant: ${pollutantDetails.displayName}`;
    document.getElementById('pollutantSource').textContent = `Source: ${pollutantDetails.additionalInfo.sources}`;
}

// Function to convert color object to RGB string
function convertToRGB(color) {
    const red = Math.round((color.red || 0) * 255);
    const green = Math.round((color.green || 0) * 255);
    const blue = Math.round((color.blue || 0) * 255);
    return `rgb(${red}, ${green}, ${blue})`;
}
