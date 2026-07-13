const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();;

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const OBJECT_TYPE_ID = process.env.OBJECT_TYPE_ID;
// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
 const objectTypeId = OBJECT_TYPE_ID;
app.get('/', async (req, res) => {
    //const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
        const contacts = `https://api.hubapi.com/crm/v3/objects/${objectTypeId}?properties=color,edible,name`;


    const headers = {       
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        console.log("DEBUG: Retrieved contacts data:", data);
        res.render('homepage', { title: 'Plants| HubSpot APIs', data });   
    } catch (error) {
        console.error(error);
    
    }
});
// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
  const contacts = `https://api.hubapi.com/crm/v3/objects/${objectTypeId}?properties=color,edible,name`;
;

    const headers = {       
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }


    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        
        res.render('update-cobj', { title: 'Form'});   
    } catch (error) {
        console.error(error);
    
    }

})

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
app.post('/update-cobj', async (req, res) => {
   
    const updateUrl = `https://api.hubapi.com/crm/v3/objects/${objectTypeId}`;
    
    console.log("DEBUG: Sending PATCH request to:", updateUrl);

    const headers = {       
        Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const data = {
        properties: {
            name: req.body.name,
            color: req.body.color,
            edible: req.body.edible
        }
    };

    try {
        
        console.log("DEBUG: Awaiting HubSpot response...");
        const response = await axios.post(updateUrl, data, { headers });
       //console.log("SUCCESS! Response Status:", response.status);
        res.redirect('/');
    } catch (error) {
        // This will catch the crash and print the actual reason for the failure
        console.error("CRITICAL FAILURE - Catch block triggered:");
        if (error.response) {
            console.error("Data:", error.response.data);
            console.error("Status:", error.response.status);
        } else {
            console.error("Error Message:", error.message);
        }
        res.status(500).send("Update failed.");
    }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));