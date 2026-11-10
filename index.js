require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/2-256327585?properties=name,code,total';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Projects | HubSpot APIs', data });      
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error fetching data');
    }
});

// ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/2-256327585';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const newRecord = {
        properties: {
            name: req.body.name,
            code: req.body.code,
            total: req.body.total
        }
    };

    try {
        await axios.post(url, newRecord, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error creating record');
    }
});


// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));