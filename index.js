require('dotenv').config();

const express = require('express');
const axios = require('axios');

const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const books = 'https://api.hubspot.com/crm/v3/objects/2-64393620/?properties=name,author,genre';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try{
    const response = await axios.get(books, { headers })
    const data = response.data.results
    res.render('homepage', {title: 'Books in Hubspot', data})
    } catch (error) {
        console.error(error);
    }

})
// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj',async (req, res) => {
    res.render('updates', {title: 'Add a Book to HubSpot'})
 
});


// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const update = {
        properties : {
            "name": req.body.name,
            "author": req.body.author,
            "genre": req.body.genre
    }

    }
    const updateBooks = 'https://api.hubspot.com/crm/v3/objects/2-64393620';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try{
    const request = await axios.post(updateBooks, update, { headers })
    res.redirect('/')
    } catch (error) {
        console.error(error);
    }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));