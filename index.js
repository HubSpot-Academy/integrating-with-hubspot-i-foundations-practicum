require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.ACCESS_TOKEN;

// ============================================
// ROUTE 1: Homepage - Display all contacts
// ============================================
app.get('/', async (req, res) => {
    const objectType = 'contacts';
    const url = `https://api.hubapi.com/crm/v3/objects/${objectType}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    
    try {
        const response = await axios.get(url, { headers });
        const data = response.data.results;
        res.render('homepage', { title: 'My Contacts', data: data || [] });
    } catch (error) {
        console.error('Error fetching contacts:', error.message);
        res.render('homepage', { title: 'My Contacts', data: [] });
    }
});

// ============================================
// ROUTE 2: Show form to create a new contact
// ============================================
app.get('/create-object', (req, res) => {
    res.render('create-form', { title: 'Create New Contact' });
});

// ============================================
// ROUTE 3: Submit form to create a new contact
// ============================================
app.post('/create-object', async (req, res) => {
    const objectType = 'contacts';
    const url = `https://api.hubapi.com/crm/v3/objects/${objectType}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    
    const newObject = {
        properties: {
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        }
    };
    
    try {
        const response = await axios.post(url, newObject, { headers });
        console.log('Contact created:', response.data);
        res.redirect('/');
    } catch (error) {
        console.error('Error creating contact:', error.response?.data || error.message);
        res.send(`
            <h2>Error Creating Contact</h2>
            <p>${error.response?.data?.message || error.message}</p>
            <a href="/create-object">← Go Back</a>
        `);
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));