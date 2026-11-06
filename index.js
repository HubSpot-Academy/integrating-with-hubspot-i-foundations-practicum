require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const OBJECT_TYPE = process.env.OBJECT_TYPE;

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}?properties=name,platform,genre&limit=100`;

    try {
        const resp = await axios.get(url, { headers });
        const games = resp.data.results;
        res.render('homepage', { title: 'Games | Integrating With HubSpot I Practicum', games });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Error getting the records');
    }
});


app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});


app.post('/update-cobj', async (req, res) => {
    const newRecord = {
        properties: {
            name: req.body.name,
            platform: req.body.platform,
            genre: req.body.genre
        }
    };

    const url = `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`;

    try {
        await axios.post(url, newRecord, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Error creating the record');
    }
});


app.listen(3000, () => console.log('Listening on http://localhost:3000'));