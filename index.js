const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
// * Code for Route 1 goes here
app.get('/', async (req, res) => {
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  };
  const tHURL = 'https://api.hubspot.com/crm/v3/schemas/pets';
  const petDataURL = 'https://api.hubspot.com/crm/v3/objects/pets/';
  try {
    const responseTH = await axios.get(tHURL, { headers });
    const responseTHData = responseTH.data.searchableProperties;
    const responsePets = await axios.get(petDataURL, { headers });
    const responsePetsData = responsePets.data.results;
    const petsIds = responsePetsData.map((pet) => pet.id);
    const petDataPromises = petsIds.map((id) => {
      const petDataURL = `https://api.hubspot.com/crm/v3/objects/pets/${id}?properties=pet_name&properties=pet_age&properties=pet_type`;
      return axios.get(petDataURL, { headers }).then((response) => {
        return {
          petId: response.data.id,
          petName: response.data.properties.pet_name,
          petAge: response.data.properties.pet_age,
          petType: response.data.properties.pet_type,
        };
      });
    });
    const allPetsData = await Promise.all(petDataPromises);
    res.render('homepage', {
      title: 'Custom Objects | Integrating With HubSpot I Practicum',
      petsData: allPetsData,
      tableHeaders: responseTHData,
    });
  } catch (e) {
    console.error(e);
    res.json({ error: e });
  }
});

// * Code for Route 2 goes here
app.get('/updates', async (req, res) => {
  const petId = req.query.petId;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  };
  const getPet = `https://api.hubspot.com/crm/v3/objects/pets/${petId}?properties=pet_name&properties=pet_Age&properties=pet_type`;
  const title =
    'Update Custom Object Form | Integrating With HubSpot I Practicum';
  try {
    const response = await axios.get(getPet, { headers });
    const petData = {
      petId: response.data.id,
      petName: response.data.properties.pet_name,
      petAge: response.data.properties.pet_age,
      petType: response.data.properties.pet_type,
    };
    res.render('updates', { title, petData });
  } catch (e) {
    console.error(e);
    res.json({ message: 'error', error: e });
  }
});

// * Code for Route 3 goes here

app.post('/updates', async (req, res) => {
  const petName = req.body.petName;
  const petAge = req.body.petAge;
  const petType = req.body.petType;
  const petId = req.query.petId;
  const update = {
    properties: {
      pet_name: petName,
      pet_age: petAge,
      pet_type: petType,
    },
  };
  console.log('after update', update);
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  };
  const updatePet = `https://api.hubspot.com/crm/v3/objects/pets/${petId}`;
  try {
    await axios.patch(updatePet, update, { headers });
    res.redirect('/');
  } catch (e) {
    console.error(e);
  }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
