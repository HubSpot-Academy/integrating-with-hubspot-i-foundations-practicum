const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = "NOT ADDING TOKEN FOR SECURITY PURPOSES";

const CUSTOM_OBJECT_TYPE = "2-61325541";
const CUSTOM_OBJECT_PROPERTIES = ["name", "id", "type"];
const HUBSPOT_OBJECTS_URL = "https://api.hubspot.com/crm/v3/objects";

app.get("/", async (req, res) => {
  const url = `${HUBSPOT_OBJECTS_URL}/${CUSTOM_OBJECT_TYPE}?properties=${CUSTOM_OBJECT_PROPERTIES.join(",")}&limit=100`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    const resp = await axios.get(url, { headers });
    const data = resp.data.results || [];
    res.render("homepage", {
      title: "Custom Object Table | Integrating With HubSpot I Practicum",
      data,
    });
  } catch (error) {
    console.error(error);
    res.render("homepage", {
      title: "Custom Object Table | Integrating With HubSpot I Practicum",
      data: [],
    });
  }
});

app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

app.post("/update-cobj", async (req, res) => {
  const url = `${HUBSPOT_OBJECTS_URL}/${CUSTOM_OBJECT_TYPE}`;
  const newCustomObject = {
    properties: {
      name: req.body.name,
      id: req.body.id,
      type: req.body.type,
    },
  };

  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    await axios.post(url, newCustomObject, { headers });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.redirect("/update-cobj");
  }
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

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
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
