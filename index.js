import express, { request, response } from 'express';
import Datastore from 'nedb';
// require('dotenv').config();
import 'dotenv/config';

// console.log(process.env);

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('listening at 3000');
});
app.use(express.static('public'));  // metto tutti i file serviti in una dir public, per separaarli meglio
app.use(express.json({ limit: '1mb' }));

// let database = [];
const database = new Datastore('database.db');
database.loadDatabase();

// ROUTING
// POST method route
app.post('/api', (request, response) => {
    const data = request.body;
    const ms = Date.now();
    data.timestamp = ms;
    // saving coordinates in a DB
    database.insert(data);
    // sending back coords
    response.json(data);
});

//GET
app.get('/api', (request, response) => {
    database.find({}, (error, data) => {  // find everything
        if (error) {
            console.log(error);
            return;
        }
        response.json(data);
    });
});

// GET weather
app.get('/weather/:latlon', async (request, response) => {
    // const lat = 45.0678;
    // const lon = 7.6038;
    console.log(request.params);
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat, lon);

    const api_key = process.env.API_KEY;
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}&radius=4000`
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();

    const data = {
        weather: weather_data,
        air_quality: aq_data
    };

    response.json(data);

});