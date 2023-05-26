const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', async (req, res) => {
    const characters = 'https://api.hubspot.com/crm/v3/objects/characters';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(characters, { headers });
        const data = resp.data.results;
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', data });      
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
    if (!req.body.id) {
        const newCharacter = {
            properties: {
                "name": req.body.name,
                "type": req.body.type,
                "bio": req.body.bio,
            }
        }

        const addCharacter = `https://api.hubapi.com/crm/v3/objects/characters`;
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        };

        try { 
            await axios.post(addCharacter, newCharacter, { headers } );
            res.redirect('/');
        } catch(err) {
            console.error(err);
        }
    } else if (req.body.id) {
        const character = {
            properties: {
                
            }
        }

        if (req.body.name) {
            character.properties.name = req.body.name
        }

        if (req.body.type) {
            character.properties.type = req.body.type
        }

        if (req.body.bio) {
            character.properties.bio = req.body.bio
        }

        const updateCharacter = `https://api.hubapi.com/crm/v3/objects/characters/${req.body.id}`;
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        };

        try { 
            await axios.patch(updateCharacter, character, { headers } );
            res.redirect('/');
        } catch(err) {
            console.error(err);
        }
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));