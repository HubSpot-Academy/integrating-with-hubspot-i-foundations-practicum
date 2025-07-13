const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.HUBSPOT_API_KEY;

// ROUTE 1 - Homepage route to list contacts
app.get('/', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/contacts?properties=firstname,hs_role,company&limit=100&sort=-createdAt';

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(url, { headers });
        var records = response.data.results;
        records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get only the 10 most recent
        records = records.slice(0, 10);

        res.render('homepage', { title: 'Recent Contact Records', records });
    } catch (err) {
        console.error(err.response?.data || err);
        res.send('Failed to fetch contact records.');
    }
});

// ROUTE 2 - Render form to add a contact
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Add New Contact | HubSpot Integration Practicum' });
});

// ROUTE 3 - Handle contact form submission
app.post('/update-cobj', async (req, res) => {
    const { firstname, hs_role, company } = req.body;

    console.log('Form submission:', req.body); // for debugging

    const contactData = {
        properties: {
            firstname,
            hs_role,
            company
        }
    };

    const url = 'https://api.hubapi.com/crm/v3/objects/contacts';

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(url, contactData, { headers });
        console.log('Contact created:', response.data);
        res.redirect('/');
    } catch (err) {
        console.error('Error creating contact:', err.response?.data || err.message);
        res.status(500).send('Failed to create contact.');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));