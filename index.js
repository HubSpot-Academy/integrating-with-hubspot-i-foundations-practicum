const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT.
// Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-eu1-c0988919-3456-4c80-9119-a19cf26bd11d';

const HEADERS = {
    'Authorization': `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};



// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data.
// Pass this data along to the front-end and create a new pug template in the views folder.
app.get('/', async (req, res) => {
    const scooters = 'https://api.hubapi.com/crm/v3/objects/p_scooters?properties=name,model,top_speed';
    try {
        const resp = await axios.get(scooters, { headers: HEADERS });
        res.render('welcome', {
            title: 'Integrating With HubSpot I Practicum',
            scooters: resp.data.results
        });
    } catch (e) {
        console.error(e);
        res.render('error');
    }
})

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data.
// Send this data along in the next route.
app.get('/update-cobj', async (req, res) => {
    try {
        res.render('updates', {
            title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
        });
    } catch (e) {
        console.error(e);
        res.render('error');
    }
})

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your
// custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

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