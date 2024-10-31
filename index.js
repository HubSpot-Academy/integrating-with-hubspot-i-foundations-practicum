require("dotenv").config({ path: "./pass.env" });
const express = require("express");
const axios = require("axios");
const app = express();
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  const bookUrl =
    "https://api.hubapi.com/crm/v3/objects/books?properties=name,author_s_name,published_year";

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(bookUrl, { headers });
    const crmRecords = response.data.results;

    res.render("homepage", { title: "Homepage", crmRecords });
  } catch (error) {
    console.error("Error retrieving CRM records:", error);
    res.status(500).send("An error occurred while retrieving CRM records.");
  }
});

app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

app.post("/update-cobj", async (req, res) => {
  const newRecord = {
    properties: {
      name: req.body.name,
      author_s_name: req.body.author_s_name,
      published_year: req.body.published_year,
    },
  };

  const createUrl = `https://api.hubapi.com/crm/v3/objects/books`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    await axios.post(createUrl, newRecord, { headers });
    res.redirect("/");
  } catch (error) {
    console.error("Error creating a new CRM record:", error);
    res.status(500).send("An error occurred while creating the record.");
  }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
