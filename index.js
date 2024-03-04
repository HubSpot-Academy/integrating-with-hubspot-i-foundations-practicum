const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.ACCESS_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

app.get('/', async (req, res) => {
    const getCustom = 'https://api.hubapi.com/crm/v3/objects/2-25004876?limit=10&properties=athlete_tenure%2C%20athlete_name%2C%20height%2C%20athlete_email&archived=false';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(getCustom, { headers });
        const data = response.data.results;
        res.render('homepage', { title: 'Custom Object Table', data });
        
    } catch(err) {
        console.error(err);
    }

});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
    res.render('update', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });  
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const update = {
        properties: {
            "athlete_name": req.body.newName,
            "athlete_email": req.body.newEmail,
            "athlete_tenure": req.body.newTenure,
        }
    }

    const createObject = `https://api.hubapi.com/crm/v3/objects/2-25004876`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(createObject, update, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));