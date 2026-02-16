const express = require("express");
const axios = require("axios");
const app = express();

require('dotenv').config();
app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const objectId = '2-224956572';

const getHeaders = () => {
    return {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
}


// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.ACCESS_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get("/", async (req, res) => {
  const url = `https://api.hubspot.com/crm/v3/objects/${objectId}?limit=100&properties=Age&properties=breed&properties=Name`;
  try {
    const resp = await axios.get(url, { headers: getHeaders() });
    const data = resp.data.results;
    res.render("home", { data });
  } catch (error) {
    console.error(
      "Error fetching the custom object:",
      error.response?.data || error.message,
    );
    res.status(500).send("Error fetching the custom object");
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', async (req, res) => {
    res.render('update');
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
    const url = `https://api.hubspot.com/crm/v3/objects/${objectId}`;
    try {
        const { age, breed, name } = req.body;
        const payload = { properties: { age, breed, name } }
        const resp = await axios.post(url, payload, { headers: getHeaders() });
        if (resp?.status === 201) {
            res.redirect('/');
        } else {
            alert("Unexpected error occured");
        }
    } catch (error) {
        console.error('Error creating the custom object:', error.response?.data || error.message);
        res.status(500).send('Error creating the custom object');
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
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
