const express = require("express");
const axios = require("axios");
const app = express();
require("dotenv").config();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

const HUBSPOT_BASE_URI ='https://api.hubspot.com/crm/v3';
const PORT = 3000;

const baseURI = `http://localhost:${PORT}`;

app.get("/", async (_req, res) => {
  const customObject =
    `${HUBSPOT_BASE_URI}/objects/pets?properties=name,bio,pet_color,pet_country,pet_owner_address,pet_owner_name,pet_owner_phone_number`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    const resp = await axios.get(customObject, { headers });
    const data = resp.data.results;
    res.render("homepage", { baseURI: baseURI + "/update-cobj", data });
  } catch (e) {
    console.error(e?.message);
    res.render("error");
  }
});

app.get("/update-cobj", async (_req, res) => {
  try {
    res.render("update", { baseURI: baseURI + "/update-cobj" });
  } catch (e) {
    console.error(e.message);
    res.render("error");
  }
});

app.post("/update-cobj", async (req, res) => {
  const updateProp = {
    properties: {
      name: req?.body?.name ?? '',
      bio: req?.body?.bio ?? '',
      pet_color: req?.body?.pet_color ?? '',
      pet_country: req?.body?.pet_country ?? '',
      pet_owner_address: req?.body?.pet_owner_address ?? '',
      pet_owner_name: req?.body?.pet_owner_name ?? '',
      pet_owner_phone_number: req?.body?.pet_owner_phone_number ?? '',
    },
  };
  const updateCustomObject = `${HUBSPOT_BASE_URI}/objects/pets`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    await axios.post(updateCustomObject, updateProp, { headers });
    res.redirect("/");
  } catch (e) {
    console.error(e.message);
    res.redirect("/");
  }
});

app.use((_req, res, next) => {
  res.render("error", { baseURI });
});

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));