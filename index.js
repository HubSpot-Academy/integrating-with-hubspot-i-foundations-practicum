require('dotenv').config();
const express = require('express');
const { Client } = require('@hubspot/api-client');

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize HubSpot Client
const hubspotClient = new Client({ accessToken: process.env.PRIVATE_APP_ACCESS_TOKEN });

// Use the exact Object ID found in your URL: 2-203999469
const OBJECT_ID = '2-203999469';

// ROUTE 1: Homepage - Fetch data
app.get('/', async (req, res) => {
    try {
        // Use basicApi.getPage to retrieve records
        const response = await hubspotClient.crm.objects.basicApi.getPage(OBJECT_ID);
        res.render('homepage', { items: response.results });
    } catch (error) {
        console.error('--- ERROR FETCHING DATA ---');
        console.error(error);
        res.status(500).send('Error fetching data. Check terminal for details.');
    }
});

// ROUTE 2: Form page
app.get('/update-cobj', async (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form' });
});

// ROUTE 3: POST route
app.post('/update-cobj', async (req, res) => {
    const newRecord = {
        properties: {
            "name": req.body.name,
            "sku": req.body.sku,
            "price": req.body.price
        }
    }
    try {
        // Use basicApi.create to create records
        await hubspotClient.crm.objects.basicApi.create(OBJECT_ID, { properties: newRecord.properties });
        res.redirect('/');
    } catch(err) {
        console.error('--- ERROR CREATING RECORD ---');
        console.error(err);
        res.status(500).send('Error creating record. Check terminal for details.');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));