const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const PRIVATE_APP_ACCESS = '';

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
}

app.get('/', async (req, res) => {
    const customObj = 'https://api.hubspot.com/crm/v3/objects/2-137398441?properties=name,age,email';

    try {
        const resp = await axios.get(customObj, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Object | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
    }
});

app.get('/update-cobj', async (req, res) => {
    res.render('updates', {title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'});
});

app.post('/update-cobj', async (req, res) => {
    const { name, age, email } = req.body;

    const data = {
        properties: {
            name,
            age,
            email,
        }
    };

    const updateContactUrl = `https://api.hubapi.com/crm/v3/objects/2-137398441`;

    try {
        await axios.post(updateContactUrl, data, { headers });

        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));