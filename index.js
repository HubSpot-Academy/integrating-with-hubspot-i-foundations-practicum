const express = require("express");
const axios = require("axios");
const app = express();
require("dotenv").config();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const HUB_BASE_URI ='https://api.hubspot.com/crm/v3';
const PORT = 3000;

const baseURI = `http://localhost:${PORT}`;

app.get("/", async (req, res) => {
  const customObject =
    `${HUB_BASE_URI}/objects/Anime?properties=name,village,ability`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    const resp = await axios.get(customObject, { headers });
    const data = resp.data.results;
    res.render("homepage", { baseURI: baseURI + "/update-cobj", data });
  } catch (e) {
    console.error(e);
    res.render("404");
  }
});

app.get("/update-cobj", async (req, res) => {
  try {
    res.render("update", { baseURI: baseURI + "/update-cobj" });
  } catch (e) {
    console.error(e.message);
    res.render("404");
  }
});

app.post("/update-cobj", async (req, res) => {
  const update = {
    properties: {
      name: req?.body?.name ?? 'Naruto',
      ability: req?.body?.ability ?? 'Rasagen',
      village: req?.body?.village ?? 'Leaf village',
    },
  };
  const updateCustomObject = `${HUB_BASE_URI}/objects/Anime`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    await axios.post(updateCustomObject, update, { headers });
    res.redirect("/");
  } catch (e) {
    console.error(e.message);
    res.redirect("/");
  }
});

app.use((req, res, next) => {
  res.render("404", { baseURI });
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
