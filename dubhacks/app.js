document.addEventListener('DOMContentLoaded', function() {
    const location = document.getElementById('location').value;
    if (location) {
        getCoordinates(location)
            .then(coords => getPollutionData(coords.lat, coords.lng))
            .then(data => displayPollutionData(data))
            .catch(error => console.error('Error:', error));
    }

    document.getElementById("zipcode").addEventListener("keyup", function() {
        // Get zip code
        var zipcode = this.value.substring(0, 5);
        var errorElem = document.querySelector(".label-error");

        if (zipcode.length === 5 && /^[0-9]+$/.test(zipcode)) {
            // Clear error
            errorElem.textContent = "";

            // Check cache
            if (zipcode in cache) {
                handleResp(cache[zipcode]);
            } else {
                // Build URL
                var url = "https://www.zipcodeapi.com/rest/" + clientKey + "/info.json/" + zipcode + "/radians";

                // Create a new XMLHttpRequest
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);

                xhr.onload = function() {
                    if (xhr.status === 200) {
                        var data = JSON.parse(xhr.responseText);
                        handleResp(data);

                        // Store in cache
                        cache[zipcode] = data;
                    } else {
                        errorElem.textContent = 'Request failed.';
                    }
                };

                xhr.send();
            }
        }
    });

    // Trigger the change event initially
    var changeEvent = new Event("change");
    document.getElementById("zipcode").dispatchEvent(changeEvent);
});