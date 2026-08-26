require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS_TOKEN = process.env.PRIVATE_APP_ACCESS_TOKEN;
const CUSTOM_OBJECT_ID = "2-267281541";

app.get("/", async (req, res) => {
  const customObjectsUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}?properties=name,brand`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS_TOKEN}`,
    "Content-Type": "application/json"
  };
  try {
    const response = await axios.get(customObjectsUrl, { headers });
    res.render("homepage", { title: "Cars | HubSpot Practicum", data: response.data.results });
  } catch (error) {
    console.error("GET Error:", error.response ? error.response.data : error.message);
    res.render("homepage", { title: "Cars | HubSpot Practicum", data: [] });
  }
});

app.get("/update-cobj", (req, res) => {
  res.render("updates", { title: "Update Custom Object Form | Integrating With HubSpot I Practicum" });
});

app.post("/update-cobj", async (req, res) => {
  const updateUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS_TOKEN}`,
    "Content-Type": "application/json"
  };

  // Map form fields to the exact properties found in your schema
  const properties = {
    name: req.body.name,
    brand: req.body.model // Mapping the model/brand input field to the valid "brand" property
  };

  try {
    await axios.post(updateUrl, { properties }, { headers });
    res.redirect("/");
  } catch (error) {
    console.error("Detailed HubSpot API Error:", JSON.stringify(error.response ? error.response.data : error.message, null, 2));
    res.status(500).send("Error creating record. Check terminal for details.");
  }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
