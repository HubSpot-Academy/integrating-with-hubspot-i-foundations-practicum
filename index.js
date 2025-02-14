const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS; 

// ROUTE 1 - Homepage: Fetch and display contact data
app.get('/', async (req, res) => {
    const endpoint = 'https://api.hubapi.com/crm/v3/objects/contacts?properties=firstname,lastname,email';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(endpoint, { headers });
        const data = resp.data.results; // Extracting the contacts from the API response
        res.render('homepage', { title: 'Contacts List', data });
    } catch (error) {
        console.error('Error fetching contacts:', error.response?.data || error.message);
        res.status(500).send('Error fetching contacts');
    }
});

// ROUTE 2 - Render form for creating/updating contacts
app.get('/update-contact', (req, res) => {
    res.render('updates', { title: 'Update Contact' });
});

// ROUTE 3 - Handle form submission to create/update contacts
app.post('/update-contact', async (req, res) => {
    const { firstname, lastname, email } = req.body;

    const payload = {
        properties: {
            firstname,
            lastname,
            email
        }
    };

    const endpoint = 'https://api.hubapi.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(endpoint, payload, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating contact:', error.response?.data || error.message);
        res.status(500).send('Error creating contact');
    }
});

// Start server
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
