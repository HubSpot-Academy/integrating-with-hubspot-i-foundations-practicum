require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE; // e.g. "2-1234567"
const COBJ_PROPERTIES = (process.env.COBJ_PROPERTIES || 'name,bio,species')
    .split(',').map(s => s.trim()).filter(Boolean);

if (!HUBSPOT_ACCESS_TOKEN || !CUSTOM_OBJECT_TYPE) {
    console.error('Missing HUBSPOT_ACCESS_TOKEN or CUSTOM_OBJECT_TYPE in .env');
}

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Axios instance with auth header
const hs = axios.create({ baseURL: 'https://api.hubapi.com' });
hs.interceptors.request.use(cfg => {
    cfg.headers.Authorization = `Bearer ${HUBSPOT_ACCESS_TOKEN}`;
    cfg.headers['Content-Type'] = 'application/json';
    return cfg;
});

// 1) Homepage: list records
app.get('/', async (_req, res) => {
    try {
        const params = new URLSearchParams({
            limit: '100',
            archived: 'false',
            properties: COBJ_PROPERTIES.join(',')
        });
        const { data } = await hs.get(`/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?${params}`);
        const records = data.results || [];
        res.render('homepage', {
            title: 'Custom Objects | Integrating With HubSpot I Practicum',
            properties: COBJ_PROPERTIES,
            records
        });
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).send('Error fetching records from HubSpot');
    }
});

// 2) Render the form
app.get('/update-cobj', (_req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
        properties: COBJ_PROPERTIES
    });
});

// 3) Handle POST to create a record
app.post('/update-cobj', async (req, res) => {
    try {
        const payloadProps = {};
        for (const prop of COBJ_PROPERTIES) {
            if (typeof req.body[prop] !== 'undefined') payloadProps[prop] = req.body[prop];
        }
        await hs.post(`/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`, { properties: payloadProps });
        res.redirect('/');
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).send('Error creating record in HubSpot');
    }
});

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});