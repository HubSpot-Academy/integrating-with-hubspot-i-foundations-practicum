const express = require("express");
const axios = require("axios");
const env = require('dotenv').config();
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const instrumentObjectType = "2-30527186";

// ROUTE 1 - app.get route for the homepage to call your custom object data.
app.get("/", async (req, res) => {
  const instruments = `https://api.hubspot.com/crm/v3/objects/${instrumentObjectType}?properties=name,type,description,brand`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    const resp = await axios.get(instruments, { headers });
    const data = resp.data.results;
    res.render("homepage", {
      title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
      data,
    });
  } catch (error) {
    console.error(error);
  }
});

// ROUTE 2 - app.get route for the form to create or update new custom object data.
app.get("/update-cobj", async (req, res) => {
  try {
    res.render("updates");
  } catch (error) {
    console.log(error);
  }
});

// ROUTE 3 - app.post route for the custom objects form to create the custom object data.
app.post("/update-cobj", async (req, res) => {
  const add = {
    properties: {
      description: req.body.description,
      name: req.body.name,
      type: req.body.type,
      brand: req.body.brand,
    },
  };
  const addInstrument = `https://api.hubapi.com/crm/v3/objects/${instrumentObjectType}`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    await axios.post(addInstrument, add, { headers });
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));