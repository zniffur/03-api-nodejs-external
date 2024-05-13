
if ("geolocation" in navigator) {
    console.log("geolocation available");
    navigator.geolocation.getCurrentPosition(async (position) => {
        let lat, lon, weather, aq;
        try {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            document.getElementById("latitude").textContent = lat;
            document.getElementById("longitude").textContent = lon;

            const api_url = `weather/${lat},${lon}`;  // redirigiamo la call al server nodejs locale, che farà lui la GET 
            const response = await fetch(api_url);
            const json = await response.json();
            console.log(json);

            weather = json.weather;
            aq = json.air_quality;

            document.getElementById("summary").textContent = weather.weather[0].description;
            document.getElementById("temp").textContent = weather.main.temp;
            document.getElementById("wind").textContent = weather.wind.speed;
            document.getElementById("pressure").textContent = weather.main.pressure;

            document.getElementById("pm10").textContent = aq.results[0].measurements[1].value;

            
        } catch (error) {
            console.error(error);
            aq = {value: -1};
            document.getElementById("pm10").textContent = "NA"
        }

        const data = { lat, lon, weather, aq };
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };
        const db_response = await fetch("/api", options);
        const db_json = await db_response.json();
        console.log(db_json);
    });
} else {
    console.log("geolocation not available");
}


