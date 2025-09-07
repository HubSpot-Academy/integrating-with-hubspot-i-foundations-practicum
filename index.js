require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');


const app = express();
const PORT = 3000;

// Set Pug as the view engine
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));

// HubSpot API configuration
const HUBSPOT_API_URL = 'https://api.hubapi.com/crm/v3/objects/p_video_game_characters';
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

// GET /update-cobj - Render the form to create a new custom object
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// POST /update-cobj - Create a new custom object record in HubSpot
app.post('/update-cobj', async (req, res) => {
    try {
        const formData = req.body;

        await axios.post(HUBSPOT_API_URL, { properties: formData }, {
            headers: {
                'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        res.redirect('/');
    } catch (error) {
        console.error('Error creating CRM record:', error.response?.data || error.message);
        res.status(500).send('Error creating CRM record');
    }
});

// GET / - Retrieve all custom object records and display in table
app.get('/', async (req, res) => {
    try {
        const response = await axios.get(HUBSPOT_API_URL, {
            headers: {
                'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`
            },
            params: {
                properties: 'character_name,character_type,price', // Replace with your custom fields
                limit: 100
            }
        });

        const records = response.data.results;
        res.render('homepage', { records });
    } catch (error) {
        console.error('Error fetching CRM records:', error.response?.data || error.message);
        res.status(500).send('Error fetching CRM records');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
