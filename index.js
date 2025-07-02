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

// * Code for Route 1 goes here

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-contact', (req, res) => {
  res.render('updates', {
    title: 'Update Contact | Dessert Directory'
  });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-contact', async (req, res) => {
  const { fullname, email, icecream_flavor, message } = req.body;

  const [firstname, ...rest] = fullname.split(' ');
  const lastname = rest.join(' ') || 'DessertLover';

try {
    const createContact = await hubspotClient.crm.contacts.basicApi.create({
      properties: {
        email,
        firstname,
        lastname,
        icecream_flavor,
        message
      }
    });

    console.log('✅ Contact created:', createContact.id);
    res.send(`<h2>🎉 Contact created!</h2><p><a href="/">Go Home</a></p>`);

  } catch (error) {
    console.error('❌ Error creating contact:', error.message || error);
    res.status(500).send(`<h2>Woorp! Something went wrong.</h2><p>${error.message}</p>`);
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




// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
