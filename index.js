const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;
const PORT = process.env.PORT || 3000;

const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  'Content-Type': 'application/json'
};

// ROUTE 1 - Homepage: get custom object records and render them in a table
app.get('/', async (req, res) => {
  const customObjectsUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;

  try {
    const response = await axios.get(customObjectsUrl, {
      headers,
      params: {
        properties: 'name,genre,platform'
      }
    });

    const games = response.data.results;

    res.render('homepage', {
      pageTitle: 'Custom Object Table | Integrating With HubSpot I Practicum',
      games
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send('Error loading custom object records.');
  }
});

// ROUTE 2 - Form page: render the form for creating a new custom object record
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    pageTitle: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

// ROUTE 3 - Form submit: create a new custom object record in HubSpot
app.post('/update-cobj', async (req, res) => {
  const createCustomObjectUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;

  const newGame = {
    properties: {
      name: req.body.name,
      genre: req.body.genre,
      platform: req.body.platform
    }
  };

  try {
    await axios.post(createCustomObjectUrl, newGame, { headers });
    res.redirect('/');
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send('Error creating custom object record.');
  }
});

// Localhost
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
