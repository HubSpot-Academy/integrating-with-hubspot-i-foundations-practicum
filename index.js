// Load environment variables from .env
require('dotenv').config();

// Imports
const express = require('express');
const axios = require('axios');
const path = require('path');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Tell Express where to find Pug templates and static files
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Pre-configured Axios client for HubSpot API
const hubspot = axios.create({
  baseURL: 'https://api.hubapi.com',
  headers: {
    Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// ROUTE 1: Homepage – list all records
app.get('/', async (req, res, next) => {
  try {
    const resp = await hubspot.get(
      `/crm/v3/objects/${process.env.HUBSPOT_OBJECT_NAME}`,
      { params: { properties: 'name,bio,species', limit: 100 } }
    );
    res.render('homepage', {
      title: 'My Custom Objects',
      items: resp.data.results
    });
  } catch (err) {
    next(err);
  }
});

// ROUTE 2: Show form to add a record
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | IWH-I Practicum'
  });
});

// ROUTE 3: Handle form submission & create record
app.post('/update-cobj', async (req, res, next) => {
  const { name, bio, species } = req.body;
  try {
    await hubspot.post(
      `/crm/v3/objects/${process.env.HUBSPOT_OBJECT_NAME}`,
      { properties: { name, bio, species } }
    );
    res.redirect('/');
  } catch (err) {
    next(err);
  }
});

// Simple error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Oops—something went wrong!');
});

// Start the server
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
