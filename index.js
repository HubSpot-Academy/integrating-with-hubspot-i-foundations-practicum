const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
require('dotenv').config();
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
// ROUTE 1 - Homepage to display custom object data
app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://api.hubapi.com/crm/v3/objects/2-144750582', {
      headers: { Authorization: `Bearer ${PRIVATE_APP_ACCESS}` },
      params: { properties: 'name,breed,age' }
    });

    const pets = response.data.results || [];
    res.render('homepage', { 
      title: 'Custom Object Records | Integrating With HubSpot I Practicum',
      pets
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error loading homepage.');
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
    // Build the CRM record payload from form data
    const newRecord = {
        properties: {
            "name": req.body.name,
            "breed": req.body.breed,
            "age": req.body.age
        }
    };

    // HubSpot API endpoint (replace YOUR_OBJECT_TYPE with your object type, e.g. contacts or custom object)
    const url = 'https://api.hubapi.com/crm/v3/objects/2-144750582';

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        // Send POST request to create the record in HubSpot
        await axios.post(url, newRecord, { headers });

        // After creating the record, redirect to homepage
        res.redirect('/');
    } catch (err) {
        console.error('Error creating CRM record:', err);
        res.status(500).send('Failed to create CRM record');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));