require('dotenv').config();
const express = require('express');
const axios = require('axios');
const req = require('express/lib/request');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.ACCESS_TOKEN;

//ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get('/',async (req,res) => {
    const countriesEndPoint = 'https://api.hubapi.com/crm/v3/objects/2-133206247?properties=name,Is_EU,Is_GCC';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try {
        const resp = await axios.get(countriesEndPoint, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Countries table', data });      
    } catch (error) {
        console.error(error);
    }
});



//ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get('/update-cobj',async (req,res) => {
    try {
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'});      
    } catch (error) {
        console.error(error);
    }
});

//ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
app.post('/update-cobj', async (req, res) => {
    const update = {
        properties: {
            "name": req.body.countryName,
            "is_eu": req.body.EU === 'on',
            "is_gcc": req.body.GCC === 'on'
        }
    }
    const addCountry = 'https://api.hubapi.com/crm/v3/objects/2-133206247';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(addCountry, update, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));