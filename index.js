const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.ACCESS_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
    // console.log('Headsets route access token:', process.env.ACCESS_TOKEN);
    const headsets = 'https://api.hubspot.com/crm/v3/objects/headsets?properties=name,brand,price';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(headsets, { headers });
        const data = resp.data.results;
        res.render('homepage', { headsets: data });      
    } catch (error) {
        console.error(error);
    }
});
// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', (req, res) => {
    try {
      res.render('updates', { pageTitle: 'Update Custom Object Form | Integrating With HubSpot I Practicum.' });
    } catch (error) {
      console.error(error);
    }
  });
// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
    // console.log("req.body", req.body);
    const headsets = 'https://api.hubspot.com/crm/v3/objects/headsets';
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
    }
    const data = {
      properties: {
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price
      }
    }
    try {
      const response = await axios.post(headsets, data, { headers });
      res.redirect('/'); // Redirects to home page
    } catch (error) {
      console.error(error);
    }
  });

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));