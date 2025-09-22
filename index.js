const express = require("express");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.urlencoded({ extended: true }));

const HS = axios.create({
  baseURL: "https://api.hubapi.com",
  headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` }
});

app.get("/", async (req, res) => {
  try {
    const r = await HS.get("/crm/v3/objects/contacts", {
      params: { properties: "firstname,game_name,publisher,price", limit: 100 }
    });
    res.render("homepage", { title: "Contact Table with Games", contacts: r.data.results || [] });
  } catch (_) {
    res.status(500).send("Error loading contacts. Check token/scopes.");
  }
});

app.get("/update-cobj", (req, res) => {
  res.render("updates", { title: "Update Custom Object Form | Integrating With HubSpot I Practicum" });
});

app.post("/update-cobj", async (req, res) => {
  const { name, game_name, publisher, price } = req.body;
  try {
    await HS.post("/crm/v3/objects/contacts", {
      properties: {
        firstname: name || "",
        game_name: game_name || "",
        publisher: publisher || "",
        price: price ? Number(price) : null
      }
    });
    res.redirect("/");
  } catch (_) {
    res.status(500).send("Create failed. Make sure the 3 contact properties exist.");
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`http://localhost:${process.env.PORT || 3000}`)
);

