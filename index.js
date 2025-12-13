require("dotenv").config();

const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Pug setup
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// HubSpot setup
const HUBSPOT_BASE_URL = "https://api.hubapi.com";
const token = process.env.PRIVATE_APP_ACCESS_TOKEN;

const customObjectTypeId = process.env.CUSTOM_OBJECT_TYPE_ID;
const nameProp = process.env.NAME_PROP;
const speciesProp = process.env.SPECIES_PROP;
const ageProp = process.env.AGE_PROP;

const hubspot = axios.create({
  baseURL: HUBSPOT_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

// ROUTE 1: Homepage - show pets table
app.get("/", async (req, res) => {
  try {
    const response = await hubspot.get(`/crm/v3/objects/${customObjectTypeId}`, {
      params: {
        limit: 100,
        properties: `${nameProp},${speciesProp},${ageProp}`,
      },
    });

    res.render("homepage", {
      title: "Pets | Integrating With HubSpot I Practicum",
      pets: response.data.results || [],
      nameProp,
      speciesProp,
      ageProp,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res
      .status(500)
      .send("Error loading pets. Check token, object ID, and property names in .env");
  }
});

// ROUTE 2: Show form page
app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Add a Pet | Integrating With HubSpot I Practicum",
  });
});

// ROUTE 3: Submit form - create new pet
app.post("/update-cobj", async (req, res) => {
  try {
    const { petName, species, age } = req.body;

    await hubspot.post(`/crm/v3/objects/${customObjectTypeId}`, {
      properties: {
        [nameProp]: petName,
        [speciesProp]: species,
        [ageProp]: age,
      },
    });

    res.redirect("/");
  } catch (error) {
    console.error(error.response?.data || error.message);
    res
      .status(500)
      .send("Error creating pet. Check required fields and property internal names.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
