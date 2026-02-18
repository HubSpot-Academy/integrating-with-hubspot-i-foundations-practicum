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
const PRIVATE_APP_ACCESS =process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get("/", async (req, res) => {
  const getRecipesUrl ='https://api.hubapi.com/crm/v3/objects/2-57766625?properties=name,category,cuisine_type';
  const headers = {
    Authorization:`Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };
  try {
    const response = await axios.get(getRecipesUrl, { headers });
    const recipes = response.data.results;
    res.render("homepage", {
      title: "Homepage | Integrating With HubSpot I Practicum",
      recipes
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Error fetching recipes');
  }
});
  

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.


app.get("/update-cobj"
, (req, res) => {
res.render("updates"
, {
title: "Update Custom Object Form | Integrating With HubSpot I Practicum"
});
});


// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post("/update-cobj", async (req, res) => {
  const { name, category, cuisine_type } = req.body;
  const createRecipeUrl ='https://api.hubapi.com/crm/v3/objects/2-57766625';
  const headers = {
    Authorization:`Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };
  const data = {
    properties: {
      name: name,
      category: category,
      cuisine_type: cuisine_type
    }
  };
  try {
    await axios.post(createRecipeUrl, data, { headers });
    res.redirect('/');
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Error creating recipe');
  }
});

 
//Axios test route (temporary)

app.get('/test-axios', async (req, res) => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.send('Axios test failed');
  }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
