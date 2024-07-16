require("dotenv").config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

app.get("/", async (req, res) => {
  const customObj =
    "https://api.hubspot.com/crm/v3/objects/2-31811979?properties=Food,Name,Type";

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    const resp = await axios.get(customObj, { headers });
    const data = resp.data.results;
    res.render("homepage", { title: "Custom Object Table", data });
  } catch (error) {
    console.error("error", error);
  }
});

app.get("/update-cobj", async (req, res) => {
  try {
    res.render("updates", {
      title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
    });
  } catch (err) {
    console.error(err);
  }
});

app.post("/update-cobj", async (req, res) => {
  const customObj = "https://api.hubspot.com/crm/v3/objects/2-31811979";
  const newData = {
    properties: {
      ...req.body,
    },
  };
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    await axios.post(customObj, newData, { headers });
    res.redirect("/");
  } catch (error) {
    console.error("error", error);
  }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));