require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const objectType = "2-192799015";

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const properties = "?properties=name,brand,color";
    const url = `https://api.hubapi.com/crm/v3/objects/${objectType}${properties}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Objects | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('form', { 
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' 
    });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${objectType}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const newObj = {
        properties: {
            name: req.body.name,
            brand: req.body.brand,
            color: req.body.color
        }
    };

    try {
        await axios.post(url, newObj, { headers });
        res.redirect('/'); // go back to homepage after creation
    } catch (error) {
        console.error(error);
        res.send('Error creating custom object');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));