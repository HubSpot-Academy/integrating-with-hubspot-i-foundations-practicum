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
console.log('PRIVATE_APP_ACCESS:', PRIVATE_APP_ACCESS ? 'Loaded successfully' : 'Not loaded');

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.hubapi.com/crm/v3/objects/pets', {
            headers: { 'Authorization': `Bearer ${PRIVATE_APP_ACCESS}` },
            params: {
                properties: ['name', 'species', 'legs'].join(',') 
            }
        });

        console.log('API Response:', response.data); 
        const pets = response.data.results || [];
        console.log('Pets with Properties:', pets); 
        res.render('homepage', { title: 'Pet List', pets });
    } catch (error) {
        console.error('Error fetching pet data:', error);
        res.render('homepage', { title: 'Pet List', pets: [] });
    }
});


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

app.post('/update-cobj', async (req, res) => {
    const { name, species, legs } = req.body;
    try {
        await axios.post('https://api.hubapi.com/crm/v3/objects/pets', {
            properties: { 
                name, 
                species, 
                legs: parseInt(legs, 10) 
            }
        }, {
            headers: { 'Authorization': `Bearer ${PRIVATE_APP_ACCESS}`, 'Content-Type': 'application/json' }
        });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating/updating pet:', error);
        res.status(500).send('Error submitting data');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));