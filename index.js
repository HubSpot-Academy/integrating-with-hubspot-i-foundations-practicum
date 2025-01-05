const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require("dotenv").config();
// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.ACCESS_TOKEN;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get("/", async (req, res) => {
  const contacts = "https://api.hubspot.com/crm/v3/objects/contacts";
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    const respond = await axios.get(contacts, { headers });
    const data = respond.data.results;
    res.render("homepage", { title: "Contacts | HubSpot APIs", data });
  } catch (error) {
    console.error(error);
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Contact Object Form | Integrating With HubSpot I Practicum",
  });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post("/update-cobj", async (req, res) => {
  const update = {
    properties: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
    },
  };

  const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    await axios.post(updateContact, update, { headers });
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
