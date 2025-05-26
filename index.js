require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { HS_TOKEN } = process.env

const headers = { Authorization: `Bearer ${HS_TOKEN}`, 'Content-Type': 'application/json' },
    API_PREFIX = `https://api.hubspot.com/crm/v3/objects/2-45069577`

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {

    const pets = `${ API_PREFIX }?properties=pet_name,pet_nickname,pet_type`

    try{
        const response = await axios.get(pets, { headers })
        const data = response.data.results

        res.render('homepage', { title: 'Pets | Integrating With HubSpot I Practicum', data })     
    }catch(err){
        console.error(err)
    }
})

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {

    try{
        const response = await axios.get(API_PREFIX, { headers })
        const data = response.data.results

        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', data })
    }catch(err){
        console.error(err)
    } 
})

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {

    const properties = req.body

    try {
        await axios.post(`${ API_PREFIX }?idProperty=pet_name`, { properties }, { headers })

        res.redirect('/')
    }catch(err){
        console.error(err)
    }
})

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));