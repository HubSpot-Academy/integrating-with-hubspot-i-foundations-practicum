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
// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
const deals = `${process.env.BASE_URL_API}objects/deals`;
const contacts = `${process.env.BASE_URL_API}objects/contacts`;
const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
}

app.get('/', async (req, res) => {
    try {
        const resp = await axios.get(deals, { headers });
        const data = resp.data.results;
        
        res.render('deals', { title: 'Custom Object Table', data });
    } catch (error) {
        console.error(error?.response?.data?.message);
    }
});
// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', async (req, res) => {
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum.', data });
    } catch (error) {
        console.error(error?.response?.data?.message);
    }
});
// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
    const { dealname, amount, dealstage, contact, state, country, city } = req.body;
    const associations = contact != "" ? [
        {
            types: [
                {
                    associationCategory: "HUBSPOT_DEFINED",
                    associationTypeId: 3
                }
            ],
            to: {
                id: contact?.toString(),
            }
        }
    ] : [];
    const post = {
        properties: {
            dealname,
            amount,
            dealstage,
            state,
            country,
            city
        },
        associations,

    }
    try {
        const response = await axios.post(deals, post, { headers });
        console.log('response: ', response?.data)
        res.redirect("/")
    } catch (error) {
        console.log(error?.response?.data?.message)
    }
});
// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));