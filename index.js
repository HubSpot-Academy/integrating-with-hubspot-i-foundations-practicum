const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load .env variables

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.HUBSPOT_API_KEY;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;

// Headers for HubSpot API calls
const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

// TODO: ROUTE 1 - Homepage to list all custom objects
app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=Name,Author,Summary`;
    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Homepage | HubSpot Practicum', data });
    } catch (error) {
        console.error('Error fetching custom objects:', error.response ? error.response.data : error.message);
        res.send('Error fetching data');
    }
});

// TODO: ROUTE 2 - Form to create a new custom object
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | HubSpot Practicum' });
});

// TODO: ROUTE 3 - Handle form POST to create a new custom object
app.post('/update-cobj', async (req, res) => {
    const { name, author, summary } = req.body;
    const newObject = {
        properties: {
            "Name": name,
            "Author": author,
            "Summary": summary
        }
    };
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;

    try {
        await axios.post(url, newObject, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating custom object:', error.response ? error.response.data : error.message);
        res.send('Error creating record');
    }
});

// * Localhost server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));