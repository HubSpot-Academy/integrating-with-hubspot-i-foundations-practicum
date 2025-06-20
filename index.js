const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const HUBSPOT_API_URL = process.env.HUBSPOT_API_URL;
const OBJECT_TYPE_ID = process.env.OBJECT_TYPE_ID;

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${HUBSPOT_API_URL}/crm/v3/objects/${OBJECT_TYPE_ID}`, {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                'Content-Type' : 'application/json'
            },
            params: {
                properties: 'pet_name, pet_breed, pet_favorite_toy',
                limit: 100,
            },
        });
        const records = response.data.results;
        res.render('homepage', {
            title: 'Custom Object Records | Practicum',
            records,
        });
    } catch(error) {
        console.error('Error fetching custom object: ', error.response?.data || error.message);
        res.status(500).send('Error fetching custom object');
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
    });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// POST form submission
app.post('/update-cobj', async (req, res) => {
    const { pet_name, pet_breed, pet_favorite_toy } = req.body;
    console.log('Form submitted: ', req.body);

    try {
        const response = await axios.post(`${HUBSPOT_API_URL}/crm/v3/objects/${OBJECT_TYPE_ID}`, {
            properties: {
                pet_name, 
                pet_breed, 
                pet_favorite_toy,
            },
        }, {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Record created:", response.data);
        res.redirect('/');
    } catch(err) {
        console.error('Error creating object:', err.response?.data || err.message);
        res.status(500).send('Failed to create record');
    }
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));