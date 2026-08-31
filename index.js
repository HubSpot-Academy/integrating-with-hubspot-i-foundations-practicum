require('dotenv').config();

const express = require('express');
const axios = require('axios');

const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;


// ==========================================
// GET /
// Homepage
// ==========================================

app.get('/', async (req, res) => {

    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;

    const params = {
        properties: ['name', 'author', 'genre'].join(',')
    };

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`
    };

    try {

        const response = await axios.get(url, {
            params,
            headers
        });

        const data = response.data.results;

        res.render('homepage', {
            title: 'Custom Objects Table | Integrating With HubSpot I Practicum',
            data
        });

    } catch (error) {

        console.error(
            'Error retrieving custom objects:',
            error.response?.data || error.message
        );

        res.status(500).send('Unable to retrieve custom objects.');
    }
});


// ==========================================
// GET /update-cobj
// Form
// ==========================================

app.get('/update-cobj', (req, res) => {

    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });

});


// ==========================================
// POST /update-cobj
// Create new custom object record
// ==========================================

app.post('/update-cobj', async (req, res) => {

    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;

    const data = {
        properties: {
            name: req.body.name,
            author: req.body.author,
            genre: req.body.genre
        }
    };

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {

        await axios.post(url, data, {
            headers
        });

        res.redirect('/');

    } catch (error) {

        console.error(
            'Error creating custom object:',
            error.response?.data || error.message
        );

        res.status(500).send('Unable to create custom object.');
    }

});


// ==========================================
// Localhost
// ==========================================

app.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});
