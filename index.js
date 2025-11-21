require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const HUBSPOT_BASE_URL = 'https://api.hubapi.com';
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE; // p_hubspot_exam
const CUSTOM_OBJECT_PROPERTIES = process.env.CUSTOM_OBJECT_PROPERTIES.split(',');

// Express setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const hubspot = axios.create({
  baseURL: HUBSPOT_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

/**
 * GET "/" - homepage
 */
app.get('/', async (req, res) => {
  try {
    const propsQuery = CUSTOM_OBJECT_PROPERTIES.join(',');
    const response = await hubspot.get(`/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`, {
      params: { properties: propsQuery },
    });

    const records = response.data.results || [];

    res.render('homepage', {
      title: 'Custom Object List | Integrating With HubSpot I Practicum',
      records,
      properties: CUSTOM_OBJECT_PROPERTIES,
    });
  } catch (err) {
    console.error('Error fetching custom objects:', err.response?.data || err.message);
    res.status(500).send('Error fetching custom objects');
  }
});

/**
 * GET "/update-cobj" - show form to create new record
 */
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
    properties: CUSTOM_OBJECT_PROPERTIES,
  });
});

/**
 * POST "/update-cobj" - create new record
 */
app.post('/update-cobj', async (req, res) => {
  try {
    const propertiesPayload = {};
    CUSTOM_OBJECT_PROPERTIES.forEach((prop) => {
      propertiesPayload[prop] = req.body[prop];
    });

    await hubspot.post(`/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`, {
      properties: propertiesPayload,
    });

    res.redirect('/');
  } catch (err) {
    console.error('Error creating custom object:', err.response?.data || err.message);
    res.status(500).send('Error creating custom object');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
