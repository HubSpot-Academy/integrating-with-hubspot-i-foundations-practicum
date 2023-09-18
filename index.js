const express = require('express');
const axios = require('axios');
const app = express();
const dotenv = require('dotenv');
const NodeCache = require('node-cache');
const myCache = new NodeCache();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Load environment variables
dotenv.config();

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
// PRIVATE_APP_ACCESS = pat-na1-4ac5ab5c-b000-411f-b67f-3332d3126333
const { PRIVATE_APP_ACCESS } = process.env;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
// * Code for Route 1 goes here
app.get('/', async (req, res) => {
  const pets = 'https://api.hubspot.com/crm/v3/objects/pets';
  const params = {
    limit: 100,
    archived: false,
    properties: 'name,pet_type,pet_age',
  };
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  };
  try {
    const resp = await axios.get(pets, { params, headers });
    const data = resp.data.results;
    myCache.set('petsData', data, 0);
    res.render('homepage', { title: 'Integrating With HubSpot I Practicum', data });
  } catch (error) {
    console.error(error);
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
// * Code for Route 2 goes here
app.get('/update-cobj', async (req, res) => {
  // Recieve params
  const petId = req.query.id;
  const mode = req.query.mode;
  // Get data from cache
  let petsData = myCache.get('petsData');
  let pet = petsData.find((pet) => pet.id === petId);
  res.render('updates', { title: 'Update Custom Object | HubSpot APIs', mode, pet });
});
// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
  // Recieve params
  const petId = req.body.petId;
  const name = req.body.name;
  const petType = req.body.type;
  const petAge = req.body.age;

  if (petId) {
    // Update pet
    const updatePet = `https://api.hubspot.com/crm/v3/objects/pets/${petId}`;
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json',
    };
    const body = {
      properties: {
        name,
        pet_type: petType,
        pet_age: petAge,
      },
    };
    try {
      const resp = await axios.patch(updatePet, body, { headers });
      res.redirect('/');
    } catch (error) {
      console.error(error);
    }
  } else {
    // Create pet
    const createPet = 'https://api.hubspot.com/crm/v3/objects/pets';
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json',
    };
    const body = {
      properties: {
        name,
        pet_type: petType,
        pet_age: petAge,
      },
    };
    try {
      const resp = await axios.post(createPet, body, { headers });
      res.redirect('/');
    } catch (error) {
      console.error(error);
    }
  }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
