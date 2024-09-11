const dotenv = require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const PORT = process.env.PORT || 3000;


const cheeseProperties = ["cheese_name", "cheese_origin", "cheese_taste"];
const cheeseURL = `https://api.hubspot.com/crm/v3/objects/cheese?properties=${cheeseProperties.join(
  "&properties="
)}`;
app.get("/", async (req, res) => {
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    const resp = await axios.get(cheeseURL, { headers });
    const data = resp.data.results;
    console.log("Data fetched successfully:", data);
    res.render("cheese", { title: "Cheese | HubSpot APIs", data });
  } catch (error) {
    console.error(error);
  }
});

app.get("/update-cheese", async (req, res) => {
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    const resp = await axios.get(cheeseURL, { headers });
    const data = resp.data.results;
    console.log("Data fetched successfully:", data);
    res.render("updates", {
      title:
        "Update Custom Object Form | Integrating With HubSpot I Practicum.",
      data,
    });
  } catch (error) {
    console.error(error);
  }
});

app.post("/update", async (req, res) => {
  const update = {
    properties: {
      cheese_name: req.body.newVal,
    },
  };

  const cheeseName = req.query.name;
  const updateCheese = `https://api.hubapi.com/crm/v3/objects/cheese/${cheeseName}?idProperty=${cheeseName}`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    await axios.patch(updateCheese, update, { headers });
    res.redirect("back");
  } catch (err) {
    console.error(err);
  }
});
// * Code for Route 3 goes here

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/

// * Localhost
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}...`));
