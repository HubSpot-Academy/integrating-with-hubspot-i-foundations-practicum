const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;


const CUSTOM_OBJECT_TYPE = '2-63519306'; 


const CUSTOM_PROPS = ['name', 'location', 'type'];

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const headers = {
    Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

// ROUTE 1: Homepage — fetch and display all records
app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=${CUSTOM_PROPS.join(',')}`;
    try {
        const resp = await axios.get(url, { headers });
        const records = resp.data.results;
        res.render('homepage', {
            title: 'Apartments | Integrating With HubSpot I Practicum',
            records,
            props: CUSTOM_PROPS
        });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error fetching records');
    }
});

// ROUTE 2: Show the form
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// ROUTE 3: Handle the form submission
app.post('/update-cobj', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const newRecord = {
        properties: {
            name: req.body.name,
            author: req.body.location, 
            genre: req.body.type      
        }
    };
    try {
        await axios.post(url, newRecord, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error creating record');
    }
});

app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));