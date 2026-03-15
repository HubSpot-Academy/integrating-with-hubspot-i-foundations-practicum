require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.HUBSPOT_API_KEY;

/* ==============================
   ROUTE 1 - Homepage
================================ */

app.get('/', async (req, res) => {

 const url = 'https://api.hubapi.com/crm/v3/objects/2-226799187?properties=name,author,description';

 const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  'Content-Type': 'application/json'
 };

 try {

  const response = await axios.get(url, { headers });

  const records = response.data.results;

  console.log(records);   // debug

  res.render('homepage', {
   title: "Custom Object Records",
   records
  });

 } catch (error) {
  console.log(error.response.data);
 }

});


/* ==============================
   ROUTE 2 - Form Page
================================ */

app.get('/update-cobj', (req, res) => {

    res.render('updates', {
        title: "Update Custom Object Form | Integrating With HubSpot I Practicum"
    });

});


/* ==============================
   ROUTE 3 - Create Record
================================ */

app.post('/update-cobj', async (req, res) => {

    const createData = {
        properties: {
            name: req.body.name,
            author: req.body.author,
            description: req.body.description
        }
    };

    const url = 'https://api.hubapi.com/crm/v3/objects/2-226799187';

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {

        await axios.post(url, createData, { headers });

        res.redirect('/');

    } catch (error) {
        console.log(error);
    }

});


app.listen(3000, () => console.log("Server running http://localhost:3000"));