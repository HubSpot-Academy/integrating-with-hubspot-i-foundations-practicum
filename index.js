// Load environment variables FIRST
require('dotenv').config();

// First commit for Integrating With HubSpot I: Foundations practicum
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get("/", async (req, res) => {
  const getBooksUrl = 'https://api.hubapi.com/crm/v3/objects/2-57191154?properties=name,author,genre';

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.get(getBooksUrl, { headers });
    const books = response.data.results;

    res.render("homepage", {
      title: "Homepage | Integrating With HubSpot I Practicum",
      books
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Error fetching books');
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum"
  });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form
app.post("/update-cobj", async (req, res) => {
  const { name, author, genre } = req.body;

  const createBookUrl = 'https://api.hubapi.com/crm/v3/objects/2-57191154';

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  const data = {
    properties: {
      name: name,
      author: author,
      genre: genre
    }
  };

  try {
    await axios.post(createBookUrl, data, { headers });
    res.redirect('/');
} catch (error) {
  console.error('FULL ERROR:', error.response?.data || error);
  res.status(500).send(JSON.stringify(error.response?.data, null, 2));
}
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
