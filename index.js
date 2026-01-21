const express = require('express');
const axios = require('axios');
const app = express();

require('dotenv').config();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const object_id = '2-224273755';

const getHeaders = () => {
    return {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
}

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.ACCESS_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
    const url = `https://api.hubspot.com/crm/v3/objects/${object_id}?limit=100&properties=name&properties=age&properties=type`;
    try {
        const resp = await axios.get(url, { headers: getHeaders() });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Object Table', data });
    } catch (error) {
        console.error('Error fetching custom object:', error.response?.data || error.message);
        res.status(500).send('Error fetching custom object');
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', async (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
    const url = `https://api.hubspot.com/crm/v3/objects/${object_id}`;
    try {
        const { name, age, type } = req.body;
        const payload = { properties: { name, age, type } }
        const resp = await axios.post(url, payload, { headers: getHeaders() });
        if (resp?.status === 201) {
            res.redirect('/');
        } else {
            alert("Something went wrong");
        }
    } catch (error) {
        console.error('Error creating custom object:', error.response?.data || error.message);
        res.status(500).send('Error creating custom object');
    }
});

// * Localhost
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));