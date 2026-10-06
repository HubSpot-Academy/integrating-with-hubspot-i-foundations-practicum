require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

// Homepage with all pets
app.get('/', async (req, res) => {

    const pets = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        'Authorization': `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        
        const response = await axios.get(pets, { headers });
        let data = response.data.results.slice(2);

        // format date a bit
        data.forEach((contact, index) => {

            let newDate = new Date(Date.parse(contact.properties.lastmodifieddate)).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
            data[index].properties.lastmodifieddate = newDate;
        });

        console.log(data);
        
        res.render('home', { title: 'Show Custom Objects/Contacts | Integrating With HubSpot I Practicum', data });      
    }
    catch (error) {

        console.error('Error fetching objects:', error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

// ADD PET FORM
app.get('/new-pet', async (req, res) => {

    data = {};
    res.render('updates', { title: 'Create Custom Object/Contacts Form | Integrating With HubSpot I Practicum' });      
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

// add pet
app.post('/new-pet', async (req, res) => {

    console.log("#####  NEW!  ##############");

    const newPet = {
        properties: {
            "firstname": req.body.firstname,
            "lastname": req.body.lastname,
            "email": req.body.email
        }
    }

    const createPet = 'https://api.hubapi.com/crm/v3/objects/contacts/';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {

        await axios.post(createPet, newPet, { headers } );
        res.redirect('/');
    }
    catch(err) {
    
        console.error(err);
    }


});

// UPDATE PET FORM
app.get('/update-pet', async (req, res) => {

    data = req.query;
    console.log("======== UPDATE GET");
    console.log(data);
    res.render('updates', { title: 'Update Custom Object/Contacts Form | Integrating With HubSpot I Practicum', data });      
});

// update pet
app.post('/update-pet', async (req, res) => {

    console.log("#####  UPDATE!  ##############");
    console.log(req.body);

    const petData = {
        properties: {
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        }
    }

    const email = req.body.email;
    const updateCPet = 'https://api.hubapi.com/crm/v3/objects/contacts/' + email + '?idProperty=email';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {

        await axios.patch(updateCPet, petData, { headers } );
        res.redirect('/');
    }
    catch(err) {
    
        console.error(err);
    }
 
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
