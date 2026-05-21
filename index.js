require("dotenv").config();

const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");

const PORT = process.env.PORT || 3000;

const HUBSPOT_TOKEN = process.env.PRIVATE_APP_ACCESS_TOKEN;

// Custom object id for Object Plants
const CUSTOM_OBJECT_TYPE = "2-229979947";

// Homepage Route
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`,
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
        },
        params: {
          properties: "name,species,watering_schedule",
        },
      },
    );

    res.render("homepage", {
      title: "Homepage",
      records: response.data.results,
    });
  } catch (err) {
    console.log(err.response?.data || err.message);

    res.send("Error loading homepage");
  }
});

// Form Route
app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

// POST Route
app.post("/update-cobj", async (req, res) => {
  const { name, species, watering_schedule } = req.body;

  try {
    await axios.post(
      `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`,
      {
        properties: {
          name,
          species,
          watering_schedule,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    res.redirect("/");
  } catch (err) {
    console.log(err.response?.data || err.message);

    res.send("Error creating record");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});