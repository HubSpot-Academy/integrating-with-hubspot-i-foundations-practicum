const express = require("express")
const axios = require("axios")
const app = express()
require("dotenv").config()
app.set("view engine", "pug")
app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get("/", async (req, res) => {
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        "Content-Type": "application/json",
    }
    const tHURL = "https://api.hubspot.com/crm/v3/schemas/pets"
    const petDataURL = "https://api.hubspot.com/crm/v3/objects/pets/"
    try {
        const responseTH = await axios.get(tHURL, { headers })
        const responseTHData = responseTH.data.searchableProperties
        const responsePets = await axios.get(petDataURL, { headers })
        const responsePetsData = responsePets.data.results
        const petsIds = responsePetsData.map((pet) => pet.id)
        const petDataPromises = petsIds.map((id) => {
            const petDataURL = `https://api.hubspot.com/crm/v3/objects/pets/${id}?properties=pet_name&properties=pet_breed&properties=pet_type`
            return axios.get(petDataURL, { headers }).then((response) => {
                return {
                    petId: response.data.id,
                    petName: response.data.properties.pet_name,
                    petBreed: response.data.properties.pet_breed,
                    petType: response.data.properties.pet_type,
                }
            })
        })
        const allPetsData = await Promise.all(petDataPromises)
        res.render("homepage", { title: "Custom Objects | Integrating With HubSpot I Practicum", petsData: allPetsData, tableHeaders: responseTHData })
    } catch (e) {
        console.error(e)
        res.json({ error: e })
    }
})

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get("/updates", async (req, res) => {
    const petId = req.query.petId
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        "Content-Type": "application/json",
    }
    const getPet = `https://api.hubspot.com/crm/v3/objects/pets/${petId}?properties=pet_name&properties=pet_breed&properties=pet_type`
    const title = "Update Custom Object Form | Integrating With HubSpot I Practicum"
    try {
        const response = await axios.get(getPet, { headers })
        const petData = {
            petId: response.data.id,
            petName: response.data.properties.pet_name,
            petBreed: response.data.properties.pet_breed,
            petType: response.data.properties.pet_type,
        }
        console.log(petData)
        res.render("updates", { title, petData })
    } catch (e) {
        console.error(e)
        res.json({ message: "error", error: e })
    }
})
// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post("/updates", async (req, res) => {
    const petName = req.body.petName
    const petBreed = req.body.petBreed
    const petType = req.body.petType
    const petId= req.query.petId
    const update = {
        properties: {
            pet_name: petName,
            pet_breed: petBreed,
            pet_type: petType,
        },
    }
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        "Content-Type": "application/json",
    }
    const updatePet = `https://api.hubspot.com/crm/v3/objects/pets/${petId}`
    try {
        await axios.patch(updatePet, update, { headers })
        res.redirect("back")
    } catch (e) {
        console.error(e)
    }
})
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
app.listen(3000, () => console.log("Listening on http://localhost:3000"))
