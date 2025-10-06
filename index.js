const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKKEN;
const PRIVATE_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;
console.log(PRIVATE_CLIENT_SECRET, PRIVATE_APP_ACCESS);
const HUBSPOT_API_URL = "https://api.hubspot.com/crm/v3/objects/contacts";

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(HUBSPOT_API_URL, {
      headers: {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        "Content-Type": "application/json",
      },
    });
    const data = response.data.results;
    console.log(data);
    res.render("homepage", { data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from HubSpot");
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get("/update-cobj", async (req, res) => {
  const { id, firstname, lastname, email } = req.query;
  res.render("updates", { id, firstname, lastname, email });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post("/add-cobj", async (req, res) => {
  const { recordId, ...properties } = req.body;

  const hubspotRequest = {
    properties,
  };

  try {
    if (recordId) {
      const updateUrl = `${HUBSPOT_API_URL}/${recordId}`;
      await axios.patch(updateUrl, hubspotRequest, {
        headers: {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
          "Content-Type": "application/json",
        },
      });
    } else {
      await axios.post(HUBSPOT_API_URL, hubspotRequest, {
        headers: {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
          "Content-Type": "application/json",
        },
      });
    }
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while communicating with HubSpot.");
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
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
