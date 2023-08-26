const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = "pat-na1-e7cb266f-f6d3-42e5-8680-35e9461529b4";

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get("/", async (req, res) => {
    const dataURL =
        "https://api.hubapi.com/crm/v3/objects/vehicles?properties=name&properties=color&properties=vehicle_type";
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        "Content-Type": "application/json",
    };
    try {
        const response = await axios.get(dataURL, { headers });
        const data = response.data.results;
        // console.log(data);
        res.render("homepage", { title: "HomePage | Vehicles List", data });
    } catch (error) {
        res.render("Error", { title: "Error 500", error });
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get("/update-cobj", (req, res) => {
    try {
        res.render("updateForm", {
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
            name: req.body.name,
            color: req.body.color,
            vehicle_type: req.body.vehicle_type,
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
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
