const express = require('express');
const axios = require('axios');
const app = express();
const env = require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const private_app_token = 'pat-na1-e8a03560-d6a4-4d32-b3b9-4e74dd85fe61';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const name = req.query.name;
    const pokemon = 'https://api.hubspot.com/crm/v3/objects/2-22838691?properties=name,power,strength,weakness';
    const headers = {
        Authorization: `Bearer ${private_app_token}`,
        'Content-Type': 'application/json' 
    }
    try {
        const response = await axios.get(pokemon, { headers} );
        // const data = response.data;
        // res.json(data);
        const data = response.data.results;
        res.render('pokemon', { title: 'Pokemon | HubSpot APIs', data });
        console.log(data);
    } catch (error) {
        console.error(error);
        console.log("Didn't work");
    }
});

// app.get("/update-cobj")



// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.


app.get('/update', async (req, res) => {
    // http://localhost:3000/update?email=paul@unlimitedtechsolutions.com
    const id = req.query.id;
    const getPokemon = `https://api.hubspot.com/crm/v3/objects/2-22838691`;
    const headers = {
        Authorization: `Bearer ${private_app_token}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(getPokemon, { headers });
        const data = response.data.results;
        // res.json(data)
        res.render('update');
    } catch(err) {
        console.error(err);
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update', async (req, res) => {

    const create = {
        properties: {
            "name": req.body.newVal,
            "power": req.body.newPower,
            "strength": req.body.newStrength,
            "weakness": req.body.newWeakness
        }
    };

 
    
    const createPokemon = `https://api.hubapi.com/crm/v3/objects/2-22838691`;
    const headers =  {
        Authorization: `Bearer ${private_app_token}`,
        'Content-Type': 'application/json'
    };
    
    try {
    await axios.post(createPokemon, create, { headers } );
    res.redirect('/');
    } catch(err) {
        console.error(err);
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