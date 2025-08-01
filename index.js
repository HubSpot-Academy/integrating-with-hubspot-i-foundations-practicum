// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// HubSpot Private App Access Token from .env
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

// This is the fully qualified name for your custom object.
// You MUST replace this placeholder with the exact value from your HubSpot account.
// It should be in the format: 'p' + [Portal ID] + '_' + [Internal name]
const CUSTOM_OBJECT_NAME_FOR_API = 'p50294925_pets';

// Middleware to parse URL-encoded bodies (from HTML forms)
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'public' directory
app.use(express.static('public'));
// Set Pug as the templating engine
app.set('view engine', 'pug');
app.set('views', './views');

// ===================================
// === Routes for the Practicum ===
// ===================================

// App.get for the homepage ("/")
// Retrieves and displays all custom object records in a table.
app.get('/', async (req, res) => {
    try {
        // HubSpot API endpoint to retrieve all custom object records
        // Make sure to include all your custom property internal names in the 'properties' query parameter.
        const getAllUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_NAME_FOR_API}?properties=name,species,bio,dog`;

        const response = await axios.get(getAllUrl, {
            headers: {
                'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        // The custom object records are in the 'results' array
        const customObjects = response.data.results;

        res.render('homepage', {
            title: 'Custom Objects | Integrating With HubSpot I Practicum',
            customObjects: customObjects
        });
    } catch (error) {
        console.error('Error fetching custom object records:', error.response ? error.response.data : error.message);
        res.status(500).send('Error fetching custom object records.');
    }
});

// App.get for rendering the update form ("update-cobj")
app.get('/update-cobj', (req, res) => {
    // Renders the 'updates.pug' template, which contains the form.
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// App.post for creating a new custom object record ("/update-cobj")
app.post('/update-cobj', async (req, res) => {
    // Get form data from the request body, including the new 'dog' property
    const { name, species, bio, dog } = req.body;

    // Create the properties object to send to HubSpot
    // The keys must match your custom property internal names exactly.
    const properties = {
        name: name,
        species: species,
        bio: bio,
        dog: dog // <-- Added the required 'dog' property
    };

    const data = {
        properties: properties
    };

    try {
        // HubSpot API endpoint to create a custom object record
        const createUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_NAME_FOR_API}`;

        // Make the API call
        await axios.post(createUrl, data, {
            headers: {
                'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Custom object record created successfully!');
        // Redirect to the homepage to see the new record
        res.redirect('/');
    } catch (error) {
        console.error('Error creating custom object record:', error.response ? error.response.data : error.message);
        res.status(500).send('Error creating custom object record.');
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
