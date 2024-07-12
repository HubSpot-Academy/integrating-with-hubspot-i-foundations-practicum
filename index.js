const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async(req, res) => {
    const favoriteSports = 'https://api.hubspot.com/crm/v3/objects/2-32128514?properties=name,country,outstanding_athlete';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try{
        const resp = await axios.get(favoriteSports, { headers });
        const data = resp.data.results;
        res.render('updates', { title: 'Favorite Sports | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
    }
});


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async(req, res) =>{
    try{
        res.render('create');
    } catch(error){
        console.error(error);
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const create = {
        properties: {
            "name": req.body.name,
            "country": req.body.country,
            "outstanding_athlete": req.body.outstanding_athlete
        }
    }

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const name = req.body.name;
    const searchSport = `https://api.hubspot.com/crm/v3/objects/2-32128514/${name}?idProperty=name`
    let updateId;
    try {
        const resp = await axios.get(searchSport, { headers });
        const data = resp.data;
        updateId = data.id;
    } catch (error) {
        console.error(error);
    }

    if (!updateId) {
        const createNewSport = `https://api.hubapi.com/crm/v3/objects/2-32128514`;
        try {
            const response = await axios.post(createNewSport, create, { headers });
            res.redirect('/');
        } catch (err) {
            res.redirect('/');
            console.error(err);
        }
    } else {
        const updateSport = `https://api.hubapi.com/crm/v3/objects/2-32128514/${updateId}`;
        try {
            const response = await axios.patch(updateSport, create, { headers });
            res.redirect('/');
        } catch (err) {
            res.redirect('/');
            console.error(err);
        }
    }
});

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