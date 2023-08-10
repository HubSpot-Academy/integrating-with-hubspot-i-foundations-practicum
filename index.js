const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');


app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = 'pat-na1-3e5e4fde-a7c7-4855-944c-5c271f730920';
const baseUrl = 'https://api.hubapi.com';
const customObjectEndpoint = '/crm/v3/objects/custom-objects';

// route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', (req, res) => {

    const partners = '';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(partners, { headers });
        const data = resp.data.results;
        res.render('updates', { pageTitle: 'Update Custom Object Form | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error(error);
    }



})
// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', async (req, res) => {

    res.render('homepage', { customObjects: /* List of custom objects */ });


})
// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {

    const formData = req.body;

    //we need to post the data received from the form to create the custom object
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    
    try { 
        await axios.post('', formData, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
              }
        } );
        //then redirect
        res.redirect('/');
    } catch(err) {
        console.error(err);
        res.redirect('/update-cobj'); // Handle error by redirecting back to the form

    }


})

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));