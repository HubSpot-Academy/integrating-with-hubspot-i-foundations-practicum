require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// Express setup

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Environment variables

const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;
const PROPERTIES = (process.env.CUSTOM_OBJECT_PROPERTIES || 'name,publisher,price').split(',');

// HubSpot Axios client

const hubspot = axios.create({
  baseURL: 'https://api.hubapi.com',
  headers: {
    Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});


// Debug helper

const logDebug = (title, data) => {
  console.log(`\n===== ${title} =====`);
  console.log(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
  console.log('========================\n');
};


// Home page - list records

app.get('/', async (req, res) => {

  try {

    const params = new URLSearchParams();

    PROPERTIES.forEach((prop) => params.append('properties', prop));

    params.append('limit', '100');


    const { data } = await hubspot.get(`/crm/v3/objects/${OBJECT_TYPE}?${params.toString()}`);

    const records = data.results || [];


    res.render('homepage', {

      title: 'Custom Object Table',

      properties: PROPERTIES,

      records,

    });

  } catch (err) {

    console.error('❌ Fetch Error:', err.response?.data || err.message);

    res.status(500).send(`Error fetching records: ${JSON.stringify(err.response?.data || err.message)}`);

  }

});


// Render add/update form

app.get('/update-cobj', (req, res) => {

  res.render('updates', {

    title: 'Add/Update Record',

    properties: PROPERTIES,

    action: '/update-cobj',

  });

});


// Handle add/update record

app.post('/update-cobj', async (req, res) => {

  try {

    const props = {};

    PROPERTIES.forEach((p) => (props[p] = req.body[p] || ''));


    const objectName = req.body.name;

    if (!objectName) return res.status(400).send('Missing "name" field.');


    // Search existing record

    const searchPayload = {

      filterGroups: [

        {

          filters: [{ propertyName: 'name', operator: 'EQ', value: objectName }],

        },

      ],

      properties: PROPERTIES,

      limit: 1,

    };


    const { data: searchData } = await hubspot.post(`/crm/v3/objects/${OBJECT_TYPE}/search`, searchPayload);


    if (!searchData.results || searchData.results.length === 0) {

      // Create new record

      await hubspot.post(`/crm/v3/objects/${OBJECT_TYPE}`, { properties: props });

      console.log(`✅ Record "${objectName}" created`);

    } else {

      // Update existing record

      const recordId = searchData.results[0].id;

      await hubspot.patch(`/crm/v3/objects/${OBJECT_TYPE}/${recordId}`, { properties: props });

      console.log(`✅ Record "${objectName}" updated`);

    }


    res.redirect('/');

  } catch (err) {

    console.error('❌ Error:', err.response?.data || err.message);

    res.status(500).send(`Error adding/updating record: ${JSON.stringify(err.response?.data || err.message)}`);

  }

});


// Start server

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`🚀 App running on http://localhost:${port}`));
