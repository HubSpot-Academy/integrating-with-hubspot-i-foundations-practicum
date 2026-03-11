require("dotenv").config();

const express = require('express');
const axios = require('axios');
const req = require('express/lib/request');
const app = express();


app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE = "p7476106_friends";
// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

console.log("FINGERPRINT:", Math.random(), "FILE:", __filename, "TIME:", new Date().toISOString());


app.get("/update-cobj", (req, res) => {
    res.render("updates",{
        title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
    });
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get("/", async (req, res) => {
    const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;
    const CUSTOM_OBJECT_TYPE = "p7476106_friends";
    const properties = ["full_name", "name", "coolness", "rating"];

    const query = properties.map(p => `properties=${encodeURIComponent(p)}`).join("&");
    const listUrl = `https://api.hubspot.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?${query}`;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        "Content-Type": "application/json",
    };
 
    try{
        const resp = await axios.get(listUrl, {headers});
        const data = resp.data.results;

        res.render("homepage",{
            title: "Homepage | Integrating With HubSpot I Practicum",
            data,
            properties
        });
    } catch (error) {
        console.error("Fetch custom object records error:", error.response?.data || error);
        res.status(500).send("Error fetching records. Check logs for details.");
    }
});

app.post("/update-cobj", async (req, res) =>{
    const createUrl = `https://api.hubspot.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    
    const newRecord = {
        properties: {
            full_name: req.body.full_name,
            name: req.body.name,
            coolness: req.body.coolness,
            rating: req.body.rating,
        },
    };

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        "Content-Type": "application/json",
    };

    try{
        await axios.post(createUrl, newRecord, {headers});
        res.redirect("/");
    }   catch (error) {
        console.error("Create custom object record error:", error.response?.data || error);
        res.status(500).send("Error creating record. Check Log for details")
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.




// token test
console.log("Token loaded?", !!process.env.PRIVATE_APP_ACCESS_TOKEN);

// * Localhost

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Listening on ${PORT}`));