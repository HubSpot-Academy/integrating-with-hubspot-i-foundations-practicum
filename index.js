
require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Pug
app.set("view engine", "pug");
app.set("views", "./views");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// HubSpot configuration
const hubspot = axios.create({
  baseURL: "https://api.hubapi.com",
  headers: {
    Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
    "Content-Type": "application/json"
  }
});

// Custom object configuration
const OBJECT_TYPE_ID = process.env.HUBSPOT_OBJECT_TYPE_ID;

const PET_PROPERTIES = [
  "name",
  "pet_type",
  "age",
  "breed"
];

// Route 1: Homepage
app.get("/", async (req, res) => {
  try {
    const response = await hubspot.get(
      `/crm/v3/objects/${OBJECT_TYPE_ID}`,
      {
        params: {
          properties: PET_PROPERTIES.join(","),
          limit: 100
        }
      }
    );

    const pets = response.data.results;

    res.render("homepage", {
      title: "Pet Registry | Integrating With HubSpot I Practicum",
      pets: pets
    });

  } catch (error) {
    console.error(
      "Error fetching Pet Registry records:",
      error.response?.data || error.message
    );

    res.status(500).send("Unable to retrieve Pet Registry records.");
  }
});

// Route 2: Display custom object form
app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum"
  });
});

// Route 3: Create custom object record
app.post("/update-cobj", async (req, res) => {
  try {
    const { name, pet_type, age, breed } = req.body;

    // Validate form fields
    if (!name || !pet_type || !age || !breed) {
      return res.status(400).send("All fields are required.");
    }

    if (!Number.isFinite(Number(age)) || Number(age) < 0) {
      return res.status(400).send("Please enter a valid pet age.");
    }

    const petData = {
      properties: {
        name: name.trim(),
        pet_type: pet_type.trim(),
        age: String(age),
        breed: breed.trim()
      }
    };

    const response = await hubspot.post(
      `/crm/v3/objects/${OBJECT_TYPE_ID}`,
      petData
    );

    console.log("Pet created successfully:", response.data.id);

    // Redirect to homepage
    res.redirect("/");

  } catch (error) {
    console.error(
      "Error creating Pet Registry record:",
      error.response?.data || error.message
    );

    res.status(500).send("Unable to create Pet Registry record.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
