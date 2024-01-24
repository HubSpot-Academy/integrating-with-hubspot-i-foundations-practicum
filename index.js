require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

app.get("/", async (req, res) => {
  try {
    const apiURL = `https://api.hubapi.com/crm/v3/objects/tours?properties=tour_name,tour_description,tour_date,tour_cost,tour_contact_number`;
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      "Content-Type": "application/json",
    };
    const response = await axios.get(apiURL, { headers });
    const tours = response.data.results;
    res.render("home", { title: "Tour Plans", tours });
  } catch (error) {
    console.error(error);
  }
});

app.get("/create", async (req, res) => {
  res.render("create", { title: "Add Tour" });
});

app.post("/create", async (req, res) => {
  const data = {
    properties: {
      tour_name: req.body.tour_name,
      tour_description: req.body.tour_description,
      tour_date: req.body.tour_date,
      tour_cost: req.body.tour_cost,
      tour_contact_number: req.body.tour_contact_number,
    },
  };

  const apiURL = `https://api.hubapi.com/crm/v3/objects/tours`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    await axios.post(apiURL, data, { headers });
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
