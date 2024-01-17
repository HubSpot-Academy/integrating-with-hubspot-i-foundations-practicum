const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-eu1-0ee2eeb9-8e81-492a-8628-e7a7b49a9d19';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/homepage', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const response = await axios.get(contacts, { headers });
        const data = response.data.results;
        res.render('homepage', { title: 'Homepage', data});
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/updates', async (req, res) => {
    const email = req.query.email;
    const contactId = 101
    
    const url = `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}?associations=bikes`;
    
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const response = await axios.get(url, { headers });
        const data = response.data;
        
        let contactBike = "";
        
        for (const [key, value] of Object.entries(data.associations)) {
            console.log(data.associations[key])
            contactBike = data.associations[key].results[0];
          }

        res.render('updates', {title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', userFirstname: data.properties.firstname, userLastname: data.properties.lastname, userEmail: data.properties.email, bikeName: contactBike});
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/updates', async (req, res) => {
    const update = {
        associations: {
            "bike_name": req.body.newVal  
        }
    }
    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(error) {
        console.error(error);
    }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));