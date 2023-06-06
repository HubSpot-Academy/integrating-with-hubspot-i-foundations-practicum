const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = "pat-na1-bf8e5671-ddc8-4631-a9ab-bbb199798e62";

const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  "Content-Type": "application/json",
};

const params = new URLSearchParams([
  ["properties", ["name", "publisher", "rating"]],
]);

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get("/", async (req, res) => {
  const url = "https://api.hubspot.com/crm/v3/objects/games";
  try {
    const response = await axios.get(url, { headers, params });
    const data = response.data.results;
    res.render("games", {
      title: "List Custom Objects | Integrating With HubSpot I Practicum",
      data,
    });
  } catch (error) {
    console.error(error);
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get("/update-cobj", async (req, res) => {
  let data = {};
  if (req.query.id) {
    const url =
      "https://api.hubspot.com/crm/v3/objects/games" + "/" + req.query.id;
    try {
      const response = await axios.get(url, {
        headers,
        params,
      });
      data = { id: response.data.id, ...response.data.properties };
    } catch (error) {
      console.error(error);
    }
  }
  res.render("update", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
    ...data,
  });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post("/update-cobj", async (req, res) => {
  const data = {
    properties: {
      name: req.body.name,
      publisher: req.body.publisher,
      rating: req.body.rating,
    },
  };

  const url =
    "https://api.hubspot.com/crm/v3/objects/games" +
    (req.body.id ? "/" + req.body.id : "");

  try {
    req.body.id
      ? await axios.patch(url, data, { headers })
      : await axios.post(url, data, { headers });
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

/** using get to delete is far from ideal but saves me learning any more about pug */
app.get("/delete-cobj", async (req, res) => {
  const url = "https://api.hubspot.com/crm/v3/objects/games/" + req.query.id;

  try {
    await axios.delete(url, { headers });
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
