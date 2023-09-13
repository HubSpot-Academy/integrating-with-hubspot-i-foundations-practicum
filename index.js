const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-eu1-278efacb-75d7-45d8-b3a9-a4b9152221c8';

// Route 1 - Fetch custom object data and render the homepage template
app.get('/', async (req, res) => {
    try {
        // Fetch custom object records
        const response = await axios.get('https://api.hubspot.com/crm/v3/objects/recipes?properties=name,instructions,ingredients,tastiness', {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                'Content-Type': 'application/json',
            },
        });

        console.log(response.data.results);

        const customObjects = response.data.results;

        // Render the homepage.pug template and pass the custom object data
        res.render('homepage', { title: 'Custom Object Records', customObjects });
    } catch (error) {
        console.error(error);
    }
});

// Route 2 - Render the updates.pug template
app.get('/update-cobj', (req, res) => {
    // Render the updates.pug template with the page title and a link to the homepage
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// Route 3 - Create or update a custom object record
app.post('/update-cobj', async (req, res) => {
    try {
        // Capture form data
        const { name, ingredients, instructions, tastiness } = req.body;

        // Create a new custom object instance
        const newCustomObject = {
            "properties": {
                "name": name,
                "ingredients": ingredients,
                "instructions": instructions,
                "tastiness": tastiness
            },
        };

        // Make a POST request to create a new custom object
        await axios.post('https://api.hubspot.com/crm/v3/objects/recipes', newCustomObject, {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                'Content-Type': 'application/json',
            },
        });

        // Redirect back to the homepage
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
});

// Serve this app on Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));