require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Reads the token from .env file
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const endpoint = 'https://api.hubapi.com/crm/v3/objects/pets';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        const resp = await axios.get(endpoint, {
            headers,
            params: { properties: 'pet_name,pet_type,pet_bio' }
        });
        const records = resp.data.results;
        res.render('homepage', { title: 'Pet List', records });
    } catch (error) {
        console.error(error);
        res.send('Error loading records');
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Add a Pet | Integrating With HubSpot I Practicum' });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const { pet_name, pet_type, pet_bio } = req.body;
    const endpoint = 'https://api.hubapi.com/crm/v3/objects/pets';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const data = {
        properties: { pet_name, pet_type, pet_bio }
    };
    try {
        await axios.post(endpoint, data, { headers });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send('Error creating record');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));