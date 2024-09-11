const dotenv = require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const PORT = process.env.PORT || 3000;


const cheeseProperties = ["cheese_name", "cheese_origin", "cheese_taste"];
const cheeseURL = `https://api.hubspot.com/crm/v3/objects/cheese?properties=${cheeseProperties.join(
  "&properties="
)}`;
app.get("/", async (req, res) => {
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    const resp = await axios.get(cheeseURL, { headers });
    const data = resp.data.results;
    console.log("Data fetched successfully:", data);
    res.render("cheese", { title: "Cheese | HubSpot APIs", data });
  } catch (error) {
    console.error(error);
  }
});

app.get("/update-cheese", async (req, res) => {
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    const resp = await axios.get(cheeseURL, { headers });
    const data = resp.data.results;
    console.log("Data fetched successfully:", data);
    res.render("updates", {
      title:
        "Update Custom Object Form | Integrating With HubSpot I Practicum.",
      data,
    });
  } catch (error) {
    console.error(error);
  }
});

app.post("/create", async (req, res) => {
  const { cheese_name, cheese_origin, cheese_taste } = req.body;

  const newCheese = {
    properties: {
      cheese_name: cheese_name,
      cheese_origin: cheese_origin,
      cheese_taste: cheese_taste,
    },
  };

  const createCheeseURL = `https://api.hubapi.com/crm/v3/objects/cheese`;

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    await axios.post(createCheeseURL, newCheese, { headers });
    res.redirect("/");
  } catch (err) {
    console.error("Error creating new cheese:", err);
    res.status(500).send("Error creating new cheese");
  }
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}...`));
