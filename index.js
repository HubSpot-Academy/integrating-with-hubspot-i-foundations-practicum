const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.HUBSPOT_PRIVATE_APP_ACCESS;

const OBJECT_TYPE = '0-1';
const CUSTOM_PROPERTIES = ['custom_name', 'custom_city', 'custom_country'];
const OBJECTS_URL = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`;
const headers = {
    ...(PRIVATE_APP_ACCESS && { Authorization: `Bearer ${PRIVATE_APP_ACCESS}` }),
    'Content-Type': 'application/json'
};

app.get('/', async (req, res) => {
    try {
        const response = await axios.get(OBJECTS_URL, {
            headers,
            params: { properties: CUSTOM_PROPERTIES.join(',') }
        });
        res.render('homepage', {
            title: 'Home | Integrating With HubSpot I Practicum',
            data: response.data.results
        });
    } catch (error) {
        console.error('Failed to retrieve records:', error.response?.data || error.message);
        res.status(500).send('Unable to retrieve CRM records.');
    }
});

app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Contact Form | Integrating With HubSpot I Practicum'
    });
});

app.post('/update-cobj', async (req, res) => {
    const record = {
        properties: Object.fromEntries(
            CUSTOM_PROPERTIES.map((property) => [property, req.body[property]])
        )
    };

    try {
        await axios.post(OBJECTS_URL, record, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Failed to create record:', error.response?.data || error.message);
        res.status(500).send('Unable to create CRM record.');
    }
});



app.listen(3000, () => console.log('Listening on http://localhost:3000'));