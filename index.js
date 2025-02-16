const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('dotenv').config();
const PRIVATE_APP_ACCESS = process.env.ACCESS_TOKEN;

const headers = {
    "Authorization": `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
}

//get all characters from the custom object
app.get('/', async (req, res) => {
    const url = 'https://api.hubspot.com/crm/v3/objects/p45674435_harry_potter_characters';
    const params = "?properties=name,house,wand&associations=contacts";
    
    try {
        const response = await axios.get(url + params, { headers });
        const characters = response.data.results;

        res.render('homepage', { title: 'Characters | HubSpot APIs', characters: characters });
    } catch (error) {
        console.error(error);
    }
});

//create or update new custom object data

app.get("/update-cobj", async (req, res) => {
    res.render("updates", {
        title: "Update Custom Object Form - Harry Potter Characters",
    });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
    const url = 'https://api.hubspot.com/crm/v3/objects/p45674435_harry_potter_characters';
    const data = req.body;
    const character = {
        properties: {
            name: data.name,
            house: data.house,
            wand: data.wand
        }
    };

    try {
        await axios.post(url, character, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
    }
});



// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));