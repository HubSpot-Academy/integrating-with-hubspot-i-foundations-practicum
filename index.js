require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const hubspot = axios.create({
  baseURL: 'https://api.hubapi.com',
  headers: {
    Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

app.get('/', async (req, res) => {
  try {
    const response = await hubspot.get(`/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`, {
      params: {
        properties: ['name', 'times_died', 'likes_cartman'].join(',')
      }
    });

    const records = response.data.results || [];

    res.render('homepage', {
      title: 'Custom Object Table',
      records
    });
  } catch (error) {
    console.error('Error fetching custom objects:', error.response?.data || error.message);
    res.status(500).send('Error loading custom object records');
  }
});

app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

app.post('/update-cobj', async (req, res) => {
  const { name, times_died, likes_cartman } = req.body;

  try {
    await hubspot.post(`/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`, {
      properties: {
        name,
        times_died,
        likes_cartman
      }
    });

    res.redirect('/');
  } catch (error) {
    console.error('Error creating custom object record:', error.response?.data || error.message);
    res.status(500).send('Error creating record');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});