const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
require('dotenv').config();

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;
app.get('/', async (req, res) => {

const movies =
'https://api.hubapi.com/crm/v3/objects/2-63442938?properties=name,director,genre';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {

        const response = await axios.get(movies, { headers });

        const data = response.data.results;
        
        console.log(JSON.stringify(data, null, 2));

        res.render('homepage', {
            title: 'Movies',
            data
        });

    } catch (error) {

        console.error(error.response?.data || error.message);

        res.send('Error retrieving movies');

    }

});
// * Code for Route 1 goes here

app.get('/update-cobj', (req, res) => {

    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });

});
// * Code for Route 2 goes here

app.post('/update-cobj', async (req, res) => {

    const createMovie = {
        properties: {
            name: req.body.name,
            director: req.body.director,
            genre: req.body.genre
        }
    };

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {

        await axios.post(
            'https://api.hubapi.com/crm/v3/objects/2-63442938',
            createMovie,
            { headers }
        );

        res.redirect('/');

    } catch (error) {

        console.error(error.response?.data || error);

    }

});
// * Code for Route 3 goes here

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));