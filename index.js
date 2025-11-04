const express = require('express');
const axios = require('axios');
const app = express();

// Configuration
const PORT = 8085;
const PRIVATE_APP_ACCESS = '';
const HUBSPOT_BASE_URL = 'https://api.hubspot.com/crm/v3';
const CUSTOM_OBJECT_ID = '2-52510659';

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const hubspotClient = axios.create({
    baseURL: HUBSPOT_BASE_URL,
    headers: {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json',
    },
});

// ROUTE 1: Homepage - Fetch all pets
app.get('/', async (req, res) => {
    const url = `/objects/${CUSTOM_OBJECT_ID}`;
    const params = { properties: 'breed,color,name' };

    try {
        const response = await hubspotClient.get(url, { params });
        const data = response.data.results || [];
        res.render('homepage', {
            title: 'Pets | HubSpot Integration',
            data,
        });
    } catch (error) {
        console.error('Error fetching pets:', error.response?.data || error.message);
        res.render('homepage', {
            title: 'Pets | HubSpot Integration',
            data: [],
            error: 'Failed to load pets.',
        });
    }
});

// ROUTE 2: Render form to add new pet
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Add Pet Form | Integrating With HubSpot I Practicum',
    });
});

// ROUTE 3: Handle form submission - Create new pet
app.post('/update-cobj', async (req, res) => {
    const { breed, color, name } = req.body;

    if (!breed || !color || !name) {
        return res.status(400).render('updates', {
            title: 'Add Pet Form | Integrating With HubSpot I Practicum',
            error: 'All fields are required.',
            old: req.body,
        });
    }

    const payload = {
        properties: { breed, color, name },
    };

    try {
        await hubspotClient.post(`/objects/${CUSTOM_OBJECT_ID}`, payload);
        res.redirect('/');
    } catch (error) {
        console.error('Error creating pet:', error.response?.data || error.message);
        res.status(500).render('updates', {
            title: 'Add Pet Form | Integrating With HubSpot I Practicum',
            error: 'Failed to create pet. Please try again.',
            old: req.body,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});