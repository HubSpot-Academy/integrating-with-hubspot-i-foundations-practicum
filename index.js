require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Include the private app access token here from your TEST ACCOUNT
const PRIVATE_APP_ACCESS = "pat-eu1-4aa23643-6f0a-426e-87fc-09216d908594";


const cardsAPI = 'https://api.hubspot.com/crm/v3/objects/cards';
const properties = 'card_name,cmc,card_type'; 

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
}

app.get('/', async (req, res) => {
    try {
        const resp = await axios.get(`${cardsAPI}?properties=${properties}`, { headers });
        const data = resp.data.results || [];
        console.log('Fetched Data:', data);
        res.render('homepage', { title: 'Cards | HubSpot APIs', data });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

app.post('/update-cobj', async (req, res) => {
    const newCard = {
        properties: {
            "card_name": req.body.card_name,
            "cmc": req.body.cmc,
            "card_type": req.body.card_type
        }
    }

    try {
        await axios.post(cardsAPI, newCard, { headers });
        res.redirect('/');
    } catch (err) {
        console.error(err);
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));