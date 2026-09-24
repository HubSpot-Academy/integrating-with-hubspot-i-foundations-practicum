require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
if (!PRIVATE_APP_ACCESS) {
    console.error('Missing PRIVATE_APP_ACCESS in .env');
    process.exit(1);
}

// Custom object "Pets" in the developer test account
const PETS_OBJECT_TYPE = '2-253851326';
const PETS_PROPERTIES = ['name', 'species', 'bio'];
const PETS_URL = `https://api.hubapi.com/crm/v3/objects/${PETS_OBJECT_TYPE}`;

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    try {
        const resp = await axios.get(PETS_URL, {
            headers,
            params: { properties: PETS_PROPERTIES.join(','), limit: 100 }
        });
        const pets = resp.data.results;
        res.render('homepage', { title: 'Pets | Integrating With HubSpot I Practicum', pets });
    } catch (error) {
        console.error(error.response ? error.response.data : error);
        res.status(500).send('Could not load Pets from HubSpot.');
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const newPet = {
        properties: {
            name: req.body.name,
            species: req.body.species,
            bio: req.body.bio
        }
    };

    try {
        await axios.post(PETS_URL, newPet, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error.response ? error.response.data : error);
        res.status(500).send('Could not create the Pet in HubSpot.');
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