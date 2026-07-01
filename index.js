const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;
const FORM_TITLE = 'Update Custom Object Form | Integrating With HubSpot I Practicum';
const HOME_TITLE = 'Board Games | Integrating With HubSpot I Practicum';

if (!PRIVATE_APP_ACCESS || !CUSTOM_OBJECT_TYPE) {
    console.error('Missing PRIVATE_APP_ACCESS or CUSTOM_OBJECT_TYPE in .env - HubSpot requests will fail until these are set.');
}

const hubspot = axios.create({
    baseURL: 'https://api.hubapi.com',
    headers: {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
});

// Custom (non HubSpot-defined) properties on the object, "name" first
async function getCustomProperties() {
    const resp = await hubspot.get(`/crm/v3/properties/${CUSTOM_OBJECT_TYPE}`);
    return resp.data.results
        .filter(property => !property.hubspotDefined)
        .sort((a, b) => (a.name === 'name' ? -1 : b.name === 'name' ? 1 : 0));
}

// ROUTE 1 - Homepage: fetch every custom property for every Board Game record and render them in a table
app.get('/', async (req, res) => {
    try {
        const properties = await getCustomProperties();
        const propertyNames = properties.map(property => property.name).join(',');
        const resp = await hubspot.get(`/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=${propertyNames}`);
        res.render('homepage', { title: HOME_TITLE, properties, data: resp.data.results });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(502).render('homepage', {
            title: HOME_TITLE,
            properties: [],
            data: [],
            error: 'Could not load records from HubSpot. Check the server logs and your .env configuration.'
        });
    }
});

// ROUTE 2 - Render the form used to create a new Board Game record
app.get('/update-cobj', async (req, res) => {
    try {
        const properties = await getCustomProperties();
        res.render('updates', { title: FORM_TITLE, properties });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(502).render('updates', {
            title: FORM_TITLE,
            properties: [],
            error: 'Could not load the form fields from HubSpot.'
        });
    }
});

// ROUTE 3 - Create the new Board Game record from the form data, then redirect home
app.post('/update-cobj', async (req, res) => {
    if (!req.body.name || !req.body.name.trim()) {
        const properties = await getCustomProperties().catch(() => []);
        return res.status(400).render('updates', { title: FORM_TITLE, properties, error: 'Name is required.' });
    }

    try {
        await hubspot.post(`/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`, { properties: req.body });
        res.redirect('/');
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        const properties = await getCustomProperties().catch(() => []);
        res.status(502).render('updates', {
            title: FORM_TITLE,
            properties,
            error: 'Could not create the record in HubSpot. Please try again.'
        });
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
