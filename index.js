const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if(typeof process.env.PRIVATE_APP_ACCESS == 'undefined') {
    console.error('This app requires an .env file containing "PRIVATE_APP_ACCESS=***MY-TOKEN***"' +
                  "\nRun with the following command\n\nnode --env-file=.env index.js"
    );
    return;
}

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const endpoint = 'https://api.hubspot.com/crm/v3/objects/2-22046266?properties=character_name,character_age,job';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(endpoint, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'View Characters | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get('/update-cobj', async (req, res) => {
    const hs_id = req.query.hs_id;
    let data = {};
    let title = 'Create New Character';
    let submit_action = 'Create';

    if(typeof hs_id != 'undefined') {
        submit_action = 'Edit';
        const endpoint = `https://api.hubspot.com/crm/v3/objects/2-22046266/${hs_id}?properties=character_name,character_age,job`;
        console.log(endpoint);
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        }
        try {
            const resp = await axios.get(endpoint, { headers });
            data = resp.data;
        } catch (error) {
            console.error(error);
        }
        title = 'Update Character';
    }

    res.render('updates', { title: title + ' | Integrating With HubSpot I Practicum', submit_action: submit_action, data });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "character_name": req.body.character_name,
            "character_age": req.body.character_age,
            "job": req.body.job
        }
    }

    let   updateEndpoint = `https://api.hubspot.com/crm/v3/objects/2-22046266`;
    if(typeof req.body.hs_id != 'undefined') {
        updateEndpoint += `/${req.body.hs_id}`;
    }
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateEndpoint, update, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }

});

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



// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));