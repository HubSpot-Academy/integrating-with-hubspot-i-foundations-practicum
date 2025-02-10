
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());





// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
require('dotenv').config();
const PRIVATE_APP_ACCESS = process.env.ACCESSToken;


// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
// * Code for Route 1 goes here


app.get('/' , async (req, res) => {
    const fastCars = 'https://api.hubapi.com/crm/v3/objects/2-164595241?properties=name,model_year,color,price';
    const headers ={
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const response = await axios.get(fastCars, { headers});
       // res.json(response.data.results);
        res.render('fastcars', {
            fastCars: response.data.results
        });

    }catch (error){
        console.log(error);
        console.log(process.env.ACCESSToken);
       
    }
    
})

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
// * Code for Route 2 goes here
app.get('/update-cobj', (req, res) => {
    res.render('update-cobj');
    
  });


// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
// * Code for Route 3 goes here
app.post('/submit', async (req, res) => {
    const { name, model, year, color, price } = req.body;
    // Process the form data (e.g., save to a database)
    console.log('Received form data:', { name, model, year, color, price  });
    const payload = [`
        {
          "name": "name",
          "value": "${name}"
        },
        {
          "name": "model",
          "value": "${model}"
        },
        {
          "name": "price",
          "value": "${price}"
        },
        {
          "name": "color",
          "value": "${color}"
        }
      `];

    console.log(payload);
    
    const fastCars = 'https://api.hubapi.com/crm/v3/objects/2-164595241';
    const headers ={
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const response = await axios.post(fastCars, payload, { headers});
       // res.json(response.data.results);

    }catch (error){
        console.log(error);
        console.log(process.env.ACCESSToken);
       
    }

    res.redirect("/");

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
app.listen(3000, () => console.log('Listening on http://localhost:3000'));