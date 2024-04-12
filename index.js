const express = require('express');
const axios = require('axios');
const app = express();
require("dotenv").config()


app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const contacts = "https://api.hubapi.com/crm/v3/objects/videogames?properties=name,developer,description" ;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        console.error(data);
        res.render('videogames', { title: 'Videogames | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/create', async (req, res) => {

    try { 
        res.render('create', { title: 'Videogames | HubSpot APIs'});      
    } catch(err) {
        console.error(err);
    }

});

app.post('/create', async (req, res) => {
    const create = {
        "properties":{
            "name": req.body.name,    
            "developer": req.body.developer,
            "description": req.body.description,
            "rating": req.body.rating,
            "release_date": req.body.release_date,
            "genre": req.body.genre,
            "main_platform": req.body.main_platform
        }
    }
    const createContact = `https://api.hubapi.com/crm/v3/objects/videogames`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {     
        await axios.post(createContact, create, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }

});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));