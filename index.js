const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load .env variables
const app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const HUBSPOT_PRIVATE_APP_TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;
// Headers for HubSpot API calls
const headers = {
    Authorization: `Bearer ${HUBSPOT_PRIVATE_APP_TOKEN}`,
    'Content-Type': 'application/json'
};
// TODO: ROUTE 1 - Homepage to list all custom objects
app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=title,author,summary`;
    try {
        const resp = await axios.get(url, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Homepage | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error('Error fetching custom objects:', error.response ? error.response.data : error.message);
        res.send('Error fetching data');
    }
});
// TODO: ROUTE 2 - Form to create a new custom object
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});
// TODO: ROUTE 3 - Handle form POST to create a new custom object
app.post('/update-cobj', async (req, res) => {
    const { title, author, summary } = req.body;
    const newObject = {
        properties: {
            "title": title,
            "author": author,
            "summary": summary
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
