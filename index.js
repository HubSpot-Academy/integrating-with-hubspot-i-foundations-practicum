const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// DO NOT hardcode token

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

// ROUTE 1
// Homepage Route - Display Contacts

app.get('/', async (req, res) => {

    const contacts = 'https://api.hubapi.com/crm/v3/objects/contacts';

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {

        const resp = await axios.get(contacts, {
            headers,
            params: {
                properties: 'firstname,lastname,email'
            }
        });

        const data = resp.data.results;

        res.render('homepage', {
            title: 'Homepage | HubSpot Practicum',
            data
        });

    } catch (error) {

        console.error(error);

    }

});

// ROUTE 2
// Render Form Page

app.get('/update-cobj', (req, res) => {

    res.render('updates', {
        title: 'Update Contact Form | Integrating With HubSpot I Practicum'
    });

});

// ROUTE 3
// Create New Contact

app.post('/update-cobj', async (req, res) => {

    const createContact = 'https://api.hubapi.com/crm/v3/objects/contacts';

    const newContact = {
        properties: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        }
    };

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {

        await axios.post(createContact, newContact, { headers });

        res.redirect('/');

    } catch (err) {

        console.error(err);

    }

});

// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));