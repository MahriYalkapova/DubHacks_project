// Define API keys and URLs for Google Places, Geocoding, and Air Quality APIs.
const googleApiKey = "AIzaSyDeSFPRdveLKclLmu6UD7sswtRfM76R6TA"; // Placeholder for the Google API key.
const placesAPI = "https://places.googleapis.com/v1/places:autocomplete"; // URL for Google Places Autocomplete API.
const geocodeAPI = "https://maps.googleapis.com/maps/api/geocode/json"; // URL for Google Geocoding API.
const airQualityAPI = "https://airquality.googleapis.com/v1/currentConditions:lookup"; // URL for Air Quality API.

// Function to fetch and display location suggestions based on the input query.
async function showSuggestions(query) {
    if (query.length < 2) { // Checks if the query length is less than 2 characters.
        document.getElementById('suggestions').innerHTML = ""; // Clears suggestions if the query is too short.
        return; // Exits the function if the query is too short.
    }

    const body = JSON.stringify({ // Creates the request body for the Places API.
        input: query, // Includes the input query.
        locationBias: { // Adds a location bias to the request.
            circle: {
                center: {
                    latitude: 37.7749, // Center latitude for the location bias.
                    longitude: -122.4194 // Center longitude for the location bias.
                },
                radius: 5000.0 // Radius for the location bias in meters.
            }
        }
    });

    try {
        // Fetches location suggestions from the Places API.
        const response = await fetch(placesAPI, {
            method: 'POST', // Specifies the request method as POST.
            headers: {
                'Content-Type': 'application/json', // Sets the request content type to JSON.
                'X-Goog-Api-Key': googleApiKey // Adds the Google API key to the request headers.
            },
            body: body // Sends the request body.
        });

        const data = await response.json(); // Parses the response as JSON.
        const suggestions = data.suggestions.map(suggestion => { // Maps over the suggestions array.
            const text = suggestion.placePrediction ? suggestion.placePrediction.text.text : suggestion.queryPrediction.text.text;
            // Gets the suggestion text based on the prediction type.
            return `<div class="suggestion-item" onclick="selectSuggestion('${text}')">${text}</div>`; // Creates a div for each suggestion with an onclick event to select the suggestion.
        }).join(''); // Joins the suggestion divs into a single string.

        document.getElementById('suggestions').innerHTML = suggestions; // Displays the suggestions.
    } catch (error) { // Catches any errors during the fetch request.
        console.error("Error fetching suggestions:", error); // Logs the error to the console.
    }
}

// Function to select a suggestion and fill the input field with the selected location.
function selectSuggestion(location) {
    document.getElementById('location').value = location; // Sets the input field value to the selected location.
    document.getElementById('suggestions').innerHTML = ""; // Clears the suggestions.
}

// Function to fetch and display air quality data based on the input location.
async function openAirQualityPage() {
    const location = document.getElementById('location').value; // Retrieves the value from the location input field.
    if (!location) { // Checks if the location input is empty.
        alert("Please enter a location"); // Alerts the user to enter a location if the input is empty.
        return; // Exits the function if the input is empty.
    }

    try {
        // Fetches geocoding data to get latitude and longitude for the input location.
        const geoResponse = await fetch(`${geocodeAPI}?address=${encodeURIComponent(location)}&key=${googleApiKey}`);
        const geoData = await geoResponse.json(); // Parses the response as JSON.
        if (geoData.status !== "OK") { // Checks if the geocoding API response status is not OK.
            alert("Location not found"); // Alerts the user that the location was not found.
            return; // Exits the function if the location was not found.
        }

        const { lat, lng } = geoData.results[0].geometry.location; // Extracts latitude and longitude from the geocoding response.
        
        // Fetches air quality data using the obtained latitude and longitude.
        const airQualityResponse = await fetch(`${airQualityAPI}?key=${googleApiKey}`, {
            method: 'POST', // Specifies the request method as POST.
            headers: {
                'Content-Type': 'application/json' // Sets the request content type to JSON.
            },
            body: JSON.stringify({ // Sends the latitude and longitude in the request body.
                location: {
                    latitude: lat,
                    longitude: lng
                },
                extraComputations: [
                    "HEALTH_RECOMMENDATIONS",
                    "DOMINANT_POLLUTANT_CONCENTRATION",
                    "POLLUTANT_CONCENTRATION",
                    "LOCAL_AQI",
                    "POLLUTANT_ADDITIONAL_INFO"
                ],
                languageCode: "en"
            })
        });

        const airQualityData = await airQualityResponse.json(); // Parses the air quality response as JSON.
        console.log(location); 
        // Save the location and air quality data in localStorage
         const dataToStore = {
            location: location, // Store the location name
            airQualityData: airQualityData // Store the air quality data
        };

        localStorage.setItem('airQualityData', JSON.stringify(dataToStore)); // Store the combined data in localStorage
        window.location.href = 'airQuality.html'; // Redirect to the new page to display the data
    } catch (error) { // Catches any errors during the fetch requests.
        console.error("Error fetching data:", error); // Logs the error to the console.
        alert("Failed to fetch air quality data"); // Alerts the user that fetching air quality data failed.
    }
}
