// make map
const map = L.map('checkinMap').setView([0, 0], 1); // centra la mappa e il livello di zoom max
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
// make marker
// const marker = L.marker([0, 0]).addTo(map);

getData();

async function getData() {
    const response = await fetch('/api');
    const data = await response.json();

    for (const item of data) {
        const marker = L.marker([item.lat, item.lon]).addTo(map);
        let txt = '';
        if (item.aq.value <0){
            txt = `City: ${item.weather.name}<br>
            Meteo: ${item.weather.weather[0].description}<br>
            Temp: ${item.weather.main.temp}&deg;C<br>
            Wind: ${item.weather.wind.speed} Kmh<br>
            Pressure: ${item.weather.main.pressure} millibar<br>
            Air Quality (PM10): NA`
        } else {
            txt = `City: ${item.weather.name}<br>
            Meteo: ${item.weather.weather[0].description}<br>
            Temp: ${item.weather.main.temp}&deg;C<br>
            Wind: ${item.weather.wind.speed} Kmh<br>
            Pressure: ${item.weather.main.pressure} millibar<br>
            Air Quality (PM10): ${item.aq.results[0].measurements[1].value} µg/m³<br></br>`
        }

        marker.bindPopup(txt);

    }
    console.log(data);
}

