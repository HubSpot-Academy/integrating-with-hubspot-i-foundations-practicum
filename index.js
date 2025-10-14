const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dotenv.config();

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

const customProperties = ['name', 'release_year', 'record_label'];

app.get('/', async (req, res) => {
    const customObjectLink = 'https://api.hubspot.com/crm/v3/objects/p147078849_Radiohead_Albums';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const queryParams = {
        properties: customProperties.join(','),
        limit: 10
    };
    
    const url = new URL(customObjectLink);
    Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
    try {
        const resp = await axios.get(url, { headers });
        const customObjects = resp.data.results;
        res.render('homepage', { title: 'Custom Objects | HubSpot APIs', customObjects });
    } catch (error) {
        console.error(error);
    }
});


app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Create/Update Custom Object | HubSpot APIs' });
});


app.post('/update-cobj', async (req, res) => {
    const createOrUpdate = {
        properties: {
            "name": req.body.name,
            "release_year": req.body.release_year,
            "record_label": req.body.record_label
        }
    };
    const createContact = 'https://api.hubapi.com/crm/v3/objects/p147078849_Radiohead_Albums';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    
    try {
        await axios.post(createContact, createOrUpdate, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));