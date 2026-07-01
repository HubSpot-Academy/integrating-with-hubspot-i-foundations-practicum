const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;

// ROUTE 1 - Homepage: fetch all Board Game custom object records and render them in a table
app.get('/', async (req, res) => {
    const objectsEndpoint = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=name,genre,designer`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(objectsEndpoint, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Board Games | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error(error);
    }
});

// ROUTE 2 - Render the form used to create a new Board Game record
app.get('/update-cobj', async (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ROUTE 3 - Create the new Board Game record from the form data, then redirect home
app.post('/update-cobj', async (req, res) => {
    const create = {
        properties: {
            "name": req.body.name,
            "genre": req.body.genre,
            "designer": req.body.designer
        }
    };

    const createObject = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(createObject, create, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
