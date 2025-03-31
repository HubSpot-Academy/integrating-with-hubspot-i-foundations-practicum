const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Keep your token in a .env file
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// ROUTE 1 - Homepage: Display custom object data
app.get('/', async (req, res) => {
  const url = 'https://api.hubapi.com/crm/v3/objects/pets?properties=name,type,age__years_';

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.get(url, { headers });
    const pets = response.data.results;
    res.render('homepage', {
      title: 'Custom Object Table',
      pets
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving pets');
  }
});

// ROUTE 2 - Show form to create/update object
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

// ROUTE 3 - Handle form submission to create object
app.post('/update-cobj', async (req, res) => {
  const petData = {
    properties: {
      name: req.body.name,
      type: req.body.type,
      age__years_: req.body.age__years_
    }
  };

  const url = 'https://api.hubapi.com/crm/v3/objects/pets';

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    await axios.post(url, petData, { headers });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating pet');
  }
});

// Start server
app.listen(3000, () => console.log('Listening on http://localhost:3000'));



