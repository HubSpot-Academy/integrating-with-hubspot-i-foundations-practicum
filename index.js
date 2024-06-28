const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));

require('dotenv').config();

const private_app_token = process.env.PRIVATE_APP_ACCESS;
const headers = {
  Authorization: `Bearer ${private_app_token}`,
  "Content-Type": "application/json",
};

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://api.hubapi.com/crm/v3/objects/pets?properties=name&properties=age&properties=breed", {headers});
    const data = response.data.results;
    res.render("home", {title: "Home | Pets List", data});
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send("An error occurred while fetching pets data.");
  }
});

app.get("/update-cobj", (req, res) => {
  res.render('updates', {title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'});
});

app.post("/update-cobj", async (req, res) => {
  try {
    const { name, age, breed } = req.body;
    const properties = { name, age, breed };

    await axios.post("https://api.hubapi.com/crm/v3/objects/pets", { properties }, { headers });
    res.redirect("/");
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send("An error occurred while updating/creating a pet.");
  }
});

app.use(express.static('public'));
app.listen(3000, () => console.log('Server running on port 3000'));