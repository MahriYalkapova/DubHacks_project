document.addEventListener('DOMContentLoaded', () => {
    const storedData = JSON.parse(localStorage.getItem('airQualityData')); // Retrieve the stored data from localStorage

    if (storedData && storedData.airQualityData) {
        displayAirQualityData(storedData); // Call the function to display the data
    } else {
        document.getElementById('airQualityContainer').innerText = 'No air quality data available.';
    }
});

async function goBack() {
    window.location.href = 'index.html';
}

// Function to display the air quality data on the webpage.
function displayAirQualityData(storedData) {
    const data = storedData.airQualityData; // Extract the air quality data

    // Display Location Name
    const locationName = document.getElementById('locationName');
    locationName.textContent = `${storedData.location}`; // Display the actual location name

    // Display Current Date
    const currentDate = document.getElementById('currentDate');
    currentDate.textContent = `${new Date(data.dateTime).toLocaleDateString()}`;

    // Display Pollution Level (Local AQI)
    const container = document.getElementById('airQualityContainer');
    const pollutionLevel = data.indexes.find((index, i) => i === 1); // Find the Local AQI (when index is 1)
    
    if (pollutionLevel) {
        const pollutionDiv = document.createElement('div');
        console.log(pollutionLevel);

        // Get the AQI category and corresponding color
        const aqiCategory = pollutionLevel.category;
        const aqiColor = pollutionLevel.color || '#228B22'; // Default to green if category not found

        // Update the pollution level display
        pollutionDiv.className = 'pollution-level';
        pollutionDiv.style.backgroundColor = aqiColor;

        container.appendChild(pollutionDiv);

        // Set tree color by updating the background color of all leaves
        const treeLeaves = document.querySelectorAll('.leaves');
        treeLeaves.forEach(leaf => {
            leaf.style.backgroundColor = aqiColor;
        });

        // Display AQI category text next to the tree
        const aqiCategoryDiv = document.getElementById('aqiCategory');
        aqiCategoryDiv.textContent = aqiCategory;
        aqiCategoryDiv.style.color = aqiColor;
    } else {
        container.innerText = 'No air quality data available.';
    }
}
