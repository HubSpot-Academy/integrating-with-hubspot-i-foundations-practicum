const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_TOKEN = "pat-eu1-0ee2eeb9-8e81-492a-8628-e7a7b49a9d19";

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get("/", async (req, res) => {
  const objectType = "2-114716868";
  const properties = [
    "bike_name",
    "model",
    "country_of_manufacture",
    "name"
  ];

  const bikes = `https://api.hubspot.com/crm/v3/objects/${objectType}?properties=${properties}`;

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
    "Content-Type": "application/json",
  };
  try {
    const response = await axios.get(bikes, { headers });
    const data = response.data.results;

    res.render("homepage", { title: "Homepage", data });
  } catch (error) {
    console.error(error);
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to update new custom object data. Send this data along in the next route.

app.get("/updates", async (req, res) => {
  const objectType = "2-114716868";
  const properties = [
    "bike_name",
    "model",
    "country_of_manufacture",
    "name"
  ];

  let objectId = req.query.id;

  const getBike = `https://api.hubapi.com/crm/v3/objects/${objectType}/${objectId}?properties=${properties}`;

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
    "Content-Type": "application/json",
  };
  try {
    const response = await axios.get(getBike, { headers });
    const data = response.data;

    // res.json(data);
    res.render("updates", {
      title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
      bikeId: data.id,
      bikeName: data.properties.bike_name,
      bikeModel: data.properties.model,
      countryOfManufacture: data.properties.country_of_manufacture,
      name: data.properties.name,
    });
  } catch (error) {
    console.error(error);
  }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to update your custom object data. Once executed, redirect the user to the homepage.

app.post("/updates", async (req, res) => {
  const objectType = "2-114716868";
  const properties = [
    "bike_name",
    "model",
    "country_of_manufacture",
    "name"
  ];

  const update = {
    properties: {
      model: req.body.newModel,
      country_of_manufacture: req.body.newCountry,
      name: req.body.newName,
    },
  };

  let objectId = req.query.id;

  const updateBike = `https://api.hubapi.com/crm/v3/objects/${objectType}/${objectId}?properties=${properties}`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
    "Content-Type": "application/json",
  };
  try {
    await axios.patch(updateBike, update, { headers });

    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

// TODO: ROUTE 4 - Create a new app.get route for the form to create a new custom object data. Send this data along in the next route.

app.get("/create", async (req, res) => {
    const objectType = "2-114716868";
    const properties = [
      "bike_name",
      "model",
      "country_of_manufacture",
      "name"
    ];
  
    const createBike = `https://api.hubapi.com/crm/v3/objects/${objectType}?properties=${properties}`;
  
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
      "Content-Type": "application/json",
    };
    try {
      const response = await axios.get(createBike, { headers });
      const data = response.data;
  
      // res.json(data);
      res.render("create", {
        title: "Create Custom Object Form | Integrating With HubSpot I Practicum",
        bike_name: req.body.bikeName,
        model: req.body.bikeModel,
        country_of_manufacture: req.body.bikeCountry,
        name: req.body.bikeOwner,
      });
    } catch (error) {
      console.error(error);
    }
  });

// TODO: ROUTE 5 - Create a new app.post route for the custom objects form to create your custom object data. Once executed, redirect the user to the homepage.

app.post("/create", async (req, res) => {
    const objectType = "2-114716868";
    const properties = [
      "bike_name",
      "model",
      "country_of_manufacture",
      "name"
    ];
  
    const create = {
      properties: {
        bike_name: req.body.bikeName,
        model: req.body.bikeModel,
        country_of_manufacture: req.body.bikeCountry,
        name: req.body.bikeOwner,
      },
    };
  
    const createBike = `https://api.hubapi.com/crm/v3/objects/${objectType}?properties=${properties}`;
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
      "Content-Type": "application/json",
    };

    try {
      await axios.post(createBike, create, { headers });
  
      res.redirect("/");
    } catch (error) {
      console.error(error);
    }
  });
  
// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));


