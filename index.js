const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();  // Load .env file

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));

const privateAppToken = process.env.PRIVATE_APP_TOKEN;  // Get the access token from the environment variables

// Fetch and display car data
app.get('/home-cars', async (req, res) => {
  const carsEndpoint = 'https://api.hubapi.com/crm/v3/objects/cars?properties=name,year,model,vin,make';
  const headers = {
    Authorization: `Bearer ${privateAppToken}`,
    'Content-Type': 'application/json'
  };
  const params = {
    properties: ['name','year', 'model', 'vin','make'] // Add the property names you want here
  };
  try {
    const response = await axios.get(carsEndpoint, { headers, params });
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    const cars = response.data.results;
    console.log('Car data:', JSON.stringify(cars, null, 2));
    res.render('home', { cars: cars });
  } catch (error) {
    console.error(error);
  }
});

// Render the update form
app.get('/update-cars', (req, res) => {
  try {
    res.render('updates', { pageTitle: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
  } catch (error) {
    console.error(error);
  }
});

// Handle form submission to add new car data
app.post('/update-cars', async (req, res) => {
  const carsEndpoint = 'https://api.hubapi.com/crm/v3/objects/cars';
  const headers = {
    Authorization: `Bearer ${privateAppToken}`,
    'Content-Type': 'application/json'
  };
  const data = {
    properties: {
      name:req.body.name,
      year: req.body.year,
      model: req.body.model,
      vin: req.body.vin,
      make: req.body.make
    }
  };
  try {
    const response = await axios.post(carsEndpoint, data, { headers });
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    res.redirect('/home-cars'); // Redirects to home page
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating car object');
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
