const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const HUB_BASE_URI ='https://api.hubspot.com/crm/v3';

// * Code for Route 1 goes here

app.get('/', async (req, res) => {
    const captains = `${HUB_BASE_URI}/objects/capitains?properties=name,pirate_crew_name,pirate_ship_name`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(captains, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Captains | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

// * Code for Route 2 goes here

app.get('/update-cobj', async (req, res) => {
    try {
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', url: `http://localhost:3000/update-cobj` });      
    } catch (error) {
        console.error(error);
    }
});

// * Code for Route 3 goes here

app.post("/update-cobj", async (req, res) => {
    const update = {
      properties: {
        name: req?.body?.name,
        pirate_crew_name: req?.body?.pirate_crew_name,
        pirate_ship_name: req?.body?.pirate_ship_name,
      },
    };
    const updateCustomObject = `${HUB_BASE_URI}/objects/capitains`;
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      "Content-Type": "application/json",
    };
    try {
      await axios.post(updateCustomObject, update, { headers });
      res.redirect("/");
    } catch (e) {
      console.error(e.message);
      res.redirect("/");
    }
  });

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));