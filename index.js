require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;
const CUSTOM_OBJECT = process.env.CUSTOM_OBJECT;
const PROPS = (process.env.COBJ_PROPERTIES || 'name,bio,skills').split(',').map(s => s.trim());

const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  'Content-Type': 'application/json',
};

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get('/', async (req, res) => {
  try {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT}`;
    const { data } = await axios.get(url, {
      headers,
      params: { properties: PROPS.join(','), limit: 100 },
    });

    const rows = (data.results || []).map(r => ({
      id: r.id,
      properties: r.properties || {},
    }));

    res.render('homepage', {
      title: 'Custom Objects | Integrating With HubSpot I Practicum',
      props: PROPS,
      rows,
    });
  } catch (err) {
    console.error(err);
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get('/update-cobj', async (req, res) => {
  try {
    res.render('updates', {
      title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
      props: PROPS,
    });
  } catch (err) {
    console.error(err);
  }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
app.post('/update-cobj', async (req, res) => {
  try {
    const properties = {};
    PROPS.forEach(p => {
      if (typeof req.body[p] !== 'undefined') properties[p] = req.body[p];
    });

    const createUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT}`;
    await axios.post(createUrl, { properties }, { headers });

    res.redirect('/');
  } catch (err) {
    console.error(err);
  }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));