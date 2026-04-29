const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// ROUTE 1 - Homepage
app.get('/', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/2-202015426?properties=name,publisher,price';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        const response = await axios.get(url, { headers });
        const data = response.data.results;
        res.render('homepage', { title: 'Video Games | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error(error);
    }
});

// ROUTE 2 - Update Form
app.get('/update-cobj', async (req, res) => {
    try {
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
    } catch (error) {
        console.error(error);
    }
});

// ROUTE 3 - POST new record
app.post('/update-cobj', async (req, res) => {
    const { name, publisher, price } = req.body;
    const url = 'https://api.hubapi.com/crm/v3/objects/2-202015426';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const body = {
        properties: { name, publisher, price }
    };
    try {
        await axios.post(url, body, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));