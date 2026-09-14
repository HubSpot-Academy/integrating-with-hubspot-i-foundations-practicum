const express = require('express');
const axios = require('axios');
const app = express();

require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;


// ROUTE 1 - Homepage
app.get('/', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts?properties=firstname,lastname,email';

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(contacts, { headers });
        const data = response.data.results;

        res.render('homepage', {
            title: 'HubSpot Contacts',
            data
        });

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error retrieving contacts');
    }
});


// ROUTE 2 - Display form
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});


// ROUTE 3 - Create new contact
app.post('/update-cobj', async (req, res) => {

    const newContact = {
        properties: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        }
    };

    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(contacts, newContact, { headers });

        res.redirect('/');

    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error creating contact');
    }
});


// Localhost
app.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});