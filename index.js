require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Custom object type
const CUSTOM_OBJECT_TYPE = 'p_pet';

// Set up middleware (only once)
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Homepage route - display all custom object records
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=name,species,age`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.render('homepage', {
      title: 'Custom Objects | Integrating With HubSpot I Practicum',
      objects: response.data.results
    });
  } catch (error) {
    console.error('Error fetching custom objects:', error.message);
    res.render('homepage', {
      title: 'Custom Objects | Integrating With HubSpot I Practicum',
      objects: [],
      error: 'Failed to load custom objects'
    });
  }
});

// Form display route - show form to create a new custom object record
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

// Form processing route - create a new custom object record
app.post('/update-cobj', async (req, res) => {
  try {
    // Create properties object from form data
    const properties = {
      name: req.body.name,
      species: req.body.species,
      age: req.body.age
    };

    // Make POST request to HubSpot API to create a new record
    await axios.post(
      `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`,
      { properties },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Redirect to the homepage after successful creation
    res.redirect('/');
  } catch (error) {
    console.error('Error creating custom object:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    res.render('updates', {
      title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
      error: 'Failed to create custom object',
      formData: req.body 
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});