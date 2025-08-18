// index.js
require('dotenv').config();

const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();

// --- ENV / Config ---
const PORT = process.env.PORT;
const HUBSPOT_TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN;   
const CUSTOM_OBJECT_TYPE = process.env.HUBSPOT_CUSTOM_OBJECT_TYPE;
const PROPERTIES = (process.env.HUBSPOT_PROPERTIES)
  .split(',')
  .map(function (p) { return p.trim(); })
  .filter(Boolean);

// --- Express setup ---
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- Axios for HubSpot ---
const hubspot = axios.create({
  baseURL: 'https://api.hubapi.com',
  headers: {
    Authorization: `Bearer ${HUBSPOT_TOKEN}`,
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// -------------------- ROUTES --------------------

// GET "/" — homepage list (renders views/homepage.pug)
// homepage.pug expects { records, error? }
app.get('/', async function (req, res) {
  try {
    var params = new URLSearchParams();
    PROPERTIES.forEach(function (p) { params.append('properties', p); });
    params.append('limit', '100');

    var url = '/crm/v3/objects/' + encodeURIComponent(CUSTOM_OBJECT_TYPE) + '?' + params.toString();
    var resp = await hubspot.get(url);

    res.render('homepage', { records: resp.data.results || [], error: null });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.render('homepage', { records: [], error: 'Failed to load records.' });
  }
});

// GET "/update-cobj" — render the HTML form (views/updates.pug)
app.get('/update-cobj', function (req, res) {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// POST "/update-cobj" — create a PC Game then redirect back to "/"
app.post('/update-cobj', async function (req, res) {
  try {
    // only include known props from the form
    var props = {};
    PROPERTIES.forEach(function (p) {
      if (req.body[p] != null && req.body[p] !== '') props[p] = req.body[p];
    });

    // require Name (internal name: "name")
    if (!props.name || !props.name.trim()) {
      return res.status(400).send('Name is required.');
    }

    await hubspot.post('/crm/v3/objects/' + encodeURIComponent(CUSTOM_OBJECT_TYPE), {
      properties: props
    });

    res.redirect('/');
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).send('Failed to create record.');
  }
});

// --- Start server ---
app.listen(PORT, function () {
  console.log('Server running on http://localhost:' + PORT);
});
