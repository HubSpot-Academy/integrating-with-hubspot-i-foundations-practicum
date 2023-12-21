const express = require('express');
const axios = require('axios');
const app = express();

// Grab API key from .env file in the root folder of this project
require('dotenv').config()

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.API_KEY;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. 
// Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

app.get('/', async (req, res) => {
    const timeentries = 'https://api.hubspot.com/crm/v3/objects/2-120345063/';
    const params = new URLSearchParams({
        properties: 'name, description, duration'
    }).toString();
    const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        }
        try {
            const resp = await axios.get(`${timeentries}?${params}`, { headers });
            const data = resp.data.results;
            console.log(resp.data);
            res.render('homepage', { title: 'TimeEntries | HubSpot APIs', data });      
        } catch (error) {
            console.error(error);
        }
})


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. 
// Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum.' });
    
})


// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. 
// Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
 
    try{

        const {name, description, duration} = req.body;
        const updateData = {
            properties: {
                "name": name,
                "description": description,
                "duration": duration    
            }
        };

        const url = "https://api.hubspot.com/crm/v3/objects/2-120345063"

        await axios.post(url, updateData, {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                'Content-type': 'application/json'
            }
        })
        // Redirecting to homepage
            res.redirect('/');
    
    
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
})


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));