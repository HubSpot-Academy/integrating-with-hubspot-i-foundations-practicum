const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;
const PRIVATE_APP_ACCESS_TOKEN = process.env.PRIVATE_APP_ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE_ID = process.env.CUSTOM_OBJECT_TYPE_ID;

if (!PRIVATE_APP_ACCESS_TOKEN) {
  console.error('Missing PRIVATE_APP_ACCESS_TOKEN in .env file');
  process.exit(1);
}

if (!CUSTOM_OBJECT_TYPE_ID) {
  console.error('Missing CUSTOM_OBJECT_TYPE_ID in .env file');
  process.exit(1);
}

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const hubspotClient = axios.create({
  baseURL: 'https://api.hubapi.com',
  headers: {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Homepage: display custom object records
app.get('/', async (req, res) => {
  try {
    const properties = ['name', 'publisher', 'price'];

    const response = await hubspotClient.get(
      `/crm/v3/objects/${CUSTOM_OBJECT_TYPE_ID}`,
      {
        params: {
          properties: properties.join(','),
          limit: 100
        }
      }
    );

    res.render('homepage', {
      title: 'Custom Object Table',
      records: response.data.results
    });
  } catch (error) {
    console.error('Error getting custom object records:');
    console.error(error.response?.data || error.message);

    res.status(500).send('Error loading custom object records.');
  }
});

// Form page
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

// Create new custom object record
app.post('/update-cobj', async (req, res) => {
  try {
    const { name, publisher, price } = req.body;

    await hubspotClient.post(`/crm/v3/objects/${CUSTOM_OBJECT_TYPE_ID}`, {
      properties: {
        name,
        publisher,
        price
      }
    });

    res.redirect('/');
  } catch (error) {
    console.error('Error creating custom object record:');
    console.error(error.response?.data || error.message);

    res.status(500).send('Error creating custom object record.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});