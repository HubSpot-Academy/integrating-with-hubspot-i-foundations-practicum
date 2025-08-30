const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';
const CUSTOM_OBJECT_TYPE = "2-49324263";
const HUBSPOT_API = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?limit=10&properties=name&properties=vin&properties=year&properties=make`;


const HEADERS = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  "Content-Type": "application/json",
};


// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get("/", async (req, res) => {
  const contacts = HUBSPOT_API;

  try {
    const resp = await axios.get(contacts, { headers: HEADERS });
    const data = resp.data.results;
    console.log(data);
    res.render("homepage", { title: "Cars | HubSpot APIs", data });
  } catch (error) {
    console.error(error);
  }
});



// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post("/submit-cobj", async (req, res) => {
  const update = {
    properties: {
      name: req.body.name,
      vin: req.body.vin,
      year: req.body.year,
      make: req.body.make,
    },
  };

  const updateContact = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;

  try {
    await axios.post(updateContact, update, { headers: HEADERS });
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
