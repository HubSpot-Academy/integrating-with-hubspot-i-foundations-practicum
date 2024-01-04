const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = '';

app.get('/', async (req, res) => {

    const pets = 'https://api.hubapi.com/crm/v3/objects/2-22211867?properties=pet_name&properties=breed&properties=age&properties=type';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try {
        const resp = await axios.get(pets, { headers });
        const data = resp.data.results;
        console.log(data);
        res.render('homepage', { title: 'Custom Object Pets | Integrating With HubSpot I Practicum', data });
    } catch (error) {
        console.error(error);
    }
});

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

app.post('/update-cobj', async (req, res) => {
    try {
        const { pet_name, breed, age, type } = req.body;

        const data = {
            properties: {
                pet_name, 
                breed,
                age, 
                type
            }
        };

        const response = await axios.post('https://api.hubapi.com/crm/v3/objects/2-22211867', data, {
            headers: {
                Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
                'Content-Type': 'application/json'
            }
        });

        res.redirect('/');
    } catch (error) {
        console.error('Error creating CRM record:', error);
        res.status(500).send('Error creating CRM record');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));