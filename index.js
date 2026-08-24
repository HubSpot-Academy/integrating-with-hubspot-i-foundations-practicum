require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const HUBSPOT_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
// Using the standard "deals" object instead of a custom object since i could not use Custom Object with this account.
const OBJECT_TYPE = 'deals';

const hubspotClient = axios.create({
  baseURL: 'https://api.hubapi.com',
  headers: {
    Authorization: `Bearer ${HUBSPOT_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// GET / -> homepage, lists all records

app.get('/', async (req, res) => {
  try {
    const response = await hubspotClient.get(`/crm/v3/objects/${OBJECT_TYPE}`, {
      params: { properties: 'name,character_class,level' },
    });

    const characters = response.data.results;

    res.render('homepage', {
      title: 'Video Game Characters | Integrating With HubSpot I Practicum',
      characters,
    });
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).send('Error retrieving records from HubSpot.');
  }
});

// GET /update-cobj -> renders the creation form
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
  });
});

// POST /update-cobj -> creates a new record, then redirects home
app.post('/update-cobj', async (req, res) => {
  const { name, character_class, level } = req.body;

  try {
    await hubspotClient.post(`/crm/v3/objects/${OBJECT_TYPE}`, {
      properties: {
        dealname: name,
        name,
        character_class,
        level,
      },
    });

    res.redirect('/');
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    res.status(500).send('Error creating record in HubSpot.');
  }
});

app.listen(PORT, () => console.log(`App listening on http://localhost:${PORT}`));