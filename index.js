require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN || process.env.PRIVATE_APP_TOKEN;
const CUSTOM_OBJECT_NAME = process.env.CUSTOM_OBJECT_NAME || 'house';
const CUSTOM_PROPERTIES = (process.env.CUSTOM_OBJECT_PROPERTIES || 'name,location,size').split(',');

if (!HUBSPOT_TOKEN) {
  console.error('HUBSPOT_TOKEN not set in .env. Please add your private app token.');
  process.exit(1);
}

const hs = axios.create({
  baseURL: 'https://api.hubapi.com',
  headers: {
    Authorization: `Bearer ${HUBSPOT_TOKEN}`,
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

function logErr(e, label='Error') {
  if (e && e.response) console.error(label, e.response.status, JSON.stringify(e.response.data, null, 2));
  else console.error(label, e && e.message ? e.message : e);
}

// HOME - list custom object records
app.get('/', async (req, res) => {
  try {
    const props = CUSTOM_PROPERTIES.join(',');
    const r = await hs.get(`/crm/v3/objects/${CUSTOM_OBJECT_NAME}`, { params: { properties: props, limit: 100 }});
    const items = (r.data.results || []).map(it => {
      const p = it.properties || {};
      const row = { id: it.id };
      CUSTOM_PROPERTIES.forEach(k => row[k] = p[k] || '');
      return row;
    });
    res.render('homepage', { title: 'Houses | IWH Practicum', items, properties: CUSTOM_PROPERTIES });
  } catch (err) {
    logErr(err, 'Fetch objects failed');
    res.status(500).send('Error fetching records - check server logs.');
  }
});

// GET form
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', properties: CUSTOM_PROPERTIES });
});

// POST create record
app.post('/update-cobj', async (req, res) => {
  try {
    const properties = {};
    CUSTOM_PROPERTIES.forEach(k => { if (req.body[k] !== undefined) properties[k] = req.body[k]; });
    const create = await hs.post(`/crm/v3/objects/${CUSTOM_OBJECT_NAME}`, { properties });
    // optional: associate created object with a contact if ASSOCIATE_TO_CONTACT_ID set
    const CONTACT_ID = process.env.ASSOCIATE_TO_CONTACT_ID;
    if (CONTACT_ID && create && create.data && create.data.id) {
      // using v4 associations batch create endpoint
      await hs.post(`/crm/v4/associations/${CUSTOM_OBJECT_NAME}/contacts/batch/create`, {
        inputs: [{ from: { id: create.data.id }, to: { id: CONTACT_ID } }]
      });
    }
    res.redirect('/');
  } catch (err) {
    logErr(err, 'Create object failed');
    res.status(500).send('Error creating record - check server logs.');
  }
});

app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));
