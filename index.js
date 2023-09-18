const express = require('express');
const axios = require('axios');
const app = express();
const dotenv = require('dotenv');
const NodeCache = require('node-cache');
const myCache = new NodeCache();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Load environment variables
dotenv.config();

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const { PRIVATE_APP_ACCESS } = process.env;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
// * Code for Route 1 goes here
app.get('/', async (req, res) => {
  const pets = 'https://api.hubspot.com/crm/v3/objects/pets';
  const params = {
    limit: 100,
    archived: false,
    properties: 'name,pet_type,pet_age',
  };
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  };
  try {
    const resp = await axios.get(pets, { params, headers });
    const data = resp.data.results;
    myCache.set('petsData', data, 0);
    // console.log(data);
    res.render('homepage', { title: 'Integrating With HubSpot I Practicum', data });
  } catch (error) {
    console.error(error);
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
// * Code for Route 2 goes here
app.get('/update-cobj', async (req, res) => {
  // Recieve params
  const petId = req.query.id;
  const mode = req.query.mode;
  // Get data from cache
  let petsData = myCache.get('petsData');
  let pet = petsData.find((pet) => pet.id === petId);
  res.render('updates', { title: 'Update Custom Object | HubSpot APIs', mode, pet });
});
// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
  console.log('post request received');

  const petId = req.body.petId;
  const name = req.body.name;
  const petType = req.body.type;
  const petAge = req.body.age;
  console.log(name, petType, petAge, petId);

  if (petId) {
    console.log('updating');
    const updatePet = `https://api.hubspot.com/crm/v3/objects/pets/${petId}`;
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json',
    };
    const body = {
      properties: {
        name,
        pet_type: petType,
        pet_age: petAge,
      },
    };
    try {
      const resp = await axios.patch(updatePet, body, { headers });
      console.log('respuesta Post actualizar', resp);
      res.redirect('/');
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log('creating');
    const createPet = 'https://api.hubspot.com/crm/v3/objects/pets';
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json',
    };
    const body = {
      properties: {
        name,
        pet_type: petType,
        pet_age: petAge,
      },
    };
    try {
      const resp = await axios.post(createPet, body, { headers });
      console.log('respuesta Post crear', resp);
      res.redirect('/');
    } catch (error) {
      console.error(error);
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
