const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
const path = require('path');

// Set the path to the public directory
const publicPath = path.join(__dirname, 'public');

app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = 'pat-na1-498e306e-abfb-4d79-b809-6a84344316a2';

// Route 1 - Homepage
app.get('/', async (req, res) => {
  try {
    const homesUrl = 'https://api.hubspot.com/crm/v3/objects/homes?limit=10&properties=price&properties=name&properties=address&archived=false';
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
    };

    console.log('Making API call to retrieve custom objects data...');
    const response = await axios.get(homesUrl, { headers });
    const homesData = response.data.results;
    console.log('Custom objects data retrieved successfully:', homesData);

    res.render('homepage', {
      title: 'Homepage | Integrating With HubSpot I Practicum',
      homesData
    });
  } catch (error) {
    console.error('Error retrieving custom objects data:', error);
  }
});

// Route 2 - Form for Updating Custom Object
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

// Route 3 - Update Custom Object
app.post('/update-cobj', async (req, res) => {
  const { name, address, price } = req.body;

  const newCustomObject = {
    properties: {
      name,
      address,
      price
    }
  };

  const homesUrl = 'https://api.hubspot.com/crm/v3/objects/homes';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    await axios.post(homesUrl, newCustomObject, { headers });
    console.log('Custom object updated successfully:', newCustomObject);
    res.redirect('/');
  } catch (error) {
    console.error('Error updating custom object:', error);
    res.status(500).send('Error updating custom object.');
  }
});

// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
