const express = require('express');
const axios = require('axios');
const app = express();

require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const HUBSPOT_OBJECT_TYPE = process.env.HUBSPOT_OBJECT_TYPE;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
const buildHeaders = () => ({
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
});

const fetchObjectsByType = async (objectType) => {
    const endpoint = `https://api.hubapi.com/crm/v3/objects/${objectType}`;
    const resp = await axios.get(endpoint, {
        headers: buildHeaders(),
        params: {
            properties: 'name,model,license_plate'
        }
    });
    return resp.data.results || [];
};

const renderVehiclesPage = async (req, res) => {
    if (!PRIVATE_APP_ACCESS) {
        return res.render('vehicles', {
            title: 'Vehicles | HubSpot APIs',
            data: [],
            error: 'PRIVATE_APP_ACCESS is missing in .env'
        });
    }
    if (!HUBSPOT_OBJECT_TYPE) {
        return res.render('vehicles', {
            title: 'Vehicles | HubSpot APIs',
            data: [],
            error: 'HUBSPOT_OBJECT_TYPE is missing in .env'
        });
    }

    try {
        const records = await fetchObjectsByType(HUBSPOT_OBJECT_TYPE);
        const data = records.map((record) => {
            const properties = record.properties || {};
            return {
                name: properties.name || '-',
                model: properties.model || '-',
                licencePlate: properties.license_plate || properties.licence_plate || '-'
            };
        });

        res.render('vehicles', {
            title: 'Vehicles | HubSpot APIs',
            data,
            error: null
        });
    } catch (error) {
        const status = error.response?.status || 'UNKNOWN';
        console.error(error.response?.data || error.message || error);
        res.render('vehicles', {
            title: 'Vehicles | HubSpot APIs',
            data: [],
            error: `Custom object data could not be loaded (${status}).`
        });
    }
};

app.get('/', renderVehiclesPage);
app.get('/vehicles', renderVehiclesPage);

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

// This is sample code to give you a reference for how you should structure your calls. 
// App.get sample
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

// * * App.post sample
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