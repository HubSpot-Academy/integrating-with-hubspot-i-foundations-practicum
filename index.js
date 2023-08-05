const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const port = 3000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views"); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const accessToken = "pat-na1-ac0741a6-a46f-4e88-b660-06a052043cd7";

// Routes
app.get("/", async (_req, res) => {
  try {
    const response = await axios.get(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const customObjectData = response.data.results;

    res.render("contacts", {
      title: "Custom Object Records",
      customObjects: customObjectData,
    });
  } catch (error) {
    console.error("Error fetching custom object records:", error.message);
    res.status(500).send("Error fetching custom object records");
  }
});

app.get("/update-cobj", (_req, res) => {
  res.render("homepage", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

app.post("/update-cobj", async (req, res) => {
  try {
    const { firstName, lastName, Email } = req.body;

    const response = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        properties: {
          firstname: firstName,
          lastname: lastName,
          email: Email,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.redirect("/");
    return response;
  } catch (error) {
    console.error("Error creating custom object:", error.response.data);
    res.status(500).send("Error creating custom object");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
