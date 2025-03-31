const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config({ path: 'key.env' }); // Load environment variables

const app = express();
const PORT = 3000;

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Ensure the private app access token is stored securely
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;

// TODO: ROUTE 1 - Fetch and display custom object data on the homepage
app.get('/', async (req, res) => {
    try {
      const url = 'https://api.hubapi.com/crm/v3/objects/planets?properties=name,colour,size';
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        };

        const response = await axios.get(url, { headers });

        // Log the full API response for debugging
        console.log('API Response:', response.data);

        // Log just the properties field for each record
        response.data.results.forEach(record => {
            console.log('Record properties:', record.properties);
        });

        // properties are within 'properties.name', 'properties.colour', and 'properties.size'
        const data = response.data.results;

        // Render the homepage with the retrieved records
        res.render('homepage', { title: 'Planets | HubSpot APIs', records: data });
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).send('Error retrieving records');
    }
});

// TODO: ROUTE 2 - Serve the form to create or update custom object data
app.get('/update-coi', (req, res) => {
    res.render('update-form', { title: 'Update Custom Object' });
});

// TODO: ROUTE 3 - Handle form submission to create/update custom objects
app.post('/update-coi', async (req, res) => {
    try {
        // Get form data
        const { name, size, colour } = req.body;

        const url = 'https://api.hubapi.com/crm/v3/objects/planets?properties=name,colour,size';
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        };

        // Prepare payload
        const data = {
            properties: {
                name,
                size,
                colour
            }
        };

        await axios.post(url, data, { headers });

        res.redirect('/');
    } catch (error) {
        console.error('Error creating record:', error.response ? error.response.data : error.message);
        res.status(500).send('Error saving record');
    }
});

// * Localhost
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
