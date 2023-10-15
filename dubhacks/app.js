document.addEventListener('DOMContentLoaded', function() {
    // IMPORTANT: Fill in your client key
    var clientKey = "js-JZ4jYushsuF51voweatEVpggiCi4Lpk6N8tHSWdidVJf7vgosXDR5xOb1cCrLIQr";
    var cache = {};

    function handleResp(data) {
        var errorElem = document.querySelector(".label-error");
        var cityInput = document.getElementById("city");
        var stateInput = document.getElementById("state");

        if (data.error_msg) {
            errorElem.textContent = data.error_msg;
        } else if ("city" in data) {
            // Set city and state
            cityInput.value = data.city;
            stateInput.value = data.state;
        }
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
