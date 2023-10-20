require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PRIVATE_APP_ACCESS = process.env.API_TOKEN;
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', async (req, res) => {

    const pets = 'https://api.hubapi.com/crm/v3/objects/pets?limit=10&properties=pet_name%2C%20age%2C%20type&archived=false';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try {
        const resp = await axios.get(pets, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Object Table', data });      
    } catch (error) {
        console.error(error);
    }

});

app.get('/update-cobj', async (req, res) => {
    
    try {
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
    } catch(err) {
        console.error(err);
    }
});

app.post('/update-cobj', async (req, res) => {
    const update = {
        properties: {
            "pet_name": req.body.pet_name,
            "age": req.body.age,
            "type": req.body.type
        }
    }

    const createPet = "https://api.hubapi.com/crm/v3/objects/pets";
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(createPet, update, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }

});


app.listen(3000, () => console.log('Listening on http://localhost:3000'));
