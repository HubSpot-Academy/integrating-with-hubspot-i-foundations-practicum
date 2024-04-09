const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get("/", async (req, res) => {
    const dataURL =
        "https://api.hubapi.com/crm/v3/objects/vehicles?properties=vehicle_year&properties=vehicle_make&properties=vehicle_model";
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        "Content-Type": "application/json",
    };
    try {
        const response = await axios.get(dataURL, { headers });
        const data = response.data.results;
        // console.log(data);
        res.render("home", { title: "Home | Vehicles List", data });
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get("/update-cobj", (req, res) => {
    try {
        res.render("updates", {
            title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
        });
    } catch (error) {
        res.render("Error", { title: "Error 500", error });
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post("/update-cobj", async (req, res) => {
    try {
        const properties = {
            vehicle_year: req.body.vehicle_year,
            vehicle_make: req.body.vehicle_make,
            vehicle_model: req.body.vehicle_model,
        };
        console.log(properties);
        const updateURL = "https://api.hubapi.com/crm/v3/objects/vehicles";
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            "Content-Type": "application/json",
        };
        await axios.post(
            updateURL,
            { properties: properties },
            { headers }
        );
        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.render("Error", { title: "Error 500", error });
    }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));