require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * DATA FROM YOUR .env FILE
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

// ==========================================
// 1. HOME ROUTE: Display the Table
// ==========================================
app.get('/', async (req, res) => {
    // Your actual Custom Object ID from HubSpot
    const customObjectID = '2-242367249'; 
    const endpoint = `https://api.hubapi.com/crm/v3/objects/${customObjectID}?properties=name,color,species`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(endpoint, { headers });
        const data = response.data.results;
        res.render('homepage', { title: 'Custom Objects | HubSpot Fundamentals', data });
    } catch (error) {
        console.error("Error fetching from HubSpot:", error.message);
        res.status(500).send("Error fetching data. Check your terminal.");
    }
});

// ==========================================
// 2. GET FORM ROUTE: Show the creation form
// ==========================================
app.get('/update-cobj', async (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// ==========================================
// 3. POST ROUTE: Send form data to HubSpot
// ==========================================
app.post('/update-cobj', async (req, res) => {
    const customObjectID = '2-242367249';
    const endpoint = `https://api.hubapi.com/crm/v3/objects/${customObjectID}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    // MATCHING SECTION: These keys match your Pug input 'name' attributes
    const newRecord = {
        properties: {
            "name": req.body.name,
            "color": req.body.color,
            "species": req.body.species,
            "plants": req.body.name // We can just send the name again here to satisfy the requirement
        }
    };

    try {
        await axios.post(endpoint, newRecord, { headers });
        // Redirecting back home tells the browser the request is finished
        res.redirect('/'); 
    } catch (err) {
        console.error("Error posting to HubSpot:", err.response ? err.response.data : err.message);
        res.status(500).send("HubSpot Error: Check terminal for details.");
    }
});

// START THE SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("The routes are loading correctly!");
    console.log(`BOOM! The server is definitely running on http://localhost:${PORT}`);
});