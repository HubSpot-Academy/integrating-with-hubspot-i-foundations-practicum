const express = require('express');
require('dotenv').config();
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

app.get('/', async (req,res)=> {
    const cobj = `https://api.hubapi.com/crm/v3/objects/pets?properties=name,pet_color,pet_type`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    const params = {
        properties: ['name', 'pet_type', 'pet_color'] 
      };
    try {
        const resp = await axios.get(cobj, { headers, params });
        const data = resp.data.results;
        res.render("homepage", {
            title: "Pets | Integrating With HubSpot I Practicum",
            data: data
          });
    } catch (error) {
        res.render("Error", { title: "Error 500", error });
    }
})

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

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

// * Code for Route 3 goes here

app.post('/update-cobj', async(req,res)=>{
    try {
        const properties = {
            name: req.body.name,
            pet_color: req.body.pet_color,
            pet_type: req.body.pet_type
        }
        const updateUrl = "https://api.hubapi.com/crm/v3/objects/pets"
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            "Content-Type": "application/json",
        };
        await axios.post(updateUrl, {properties:properties},{headers})
        res.redirect("/")
        } catch (error) {
        res.render("Error", { title: "Error 500", error });
    }
})

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));