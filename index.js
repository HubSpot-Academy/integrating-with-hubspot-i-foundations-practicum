const express = require('express');
const axios = require('axios');
const app = express();

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get('/', async (req, res) => {
    const animalsRequest = 'https://api.hubapi.com/crm/v3/objects/2-22879493?limit=10&properties=name,animal_biography,animal_type&archived=false';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const response = await axios.get(animalsRequest, { headers });
        const results = response.data.results;
        const animals = results.map((result)=>{
            return {
                name : result.properties.name,
                bio : result.properties.animal_biography,
                type : result.properties.animal_type
            };
        })
        console.log('here it is:', animals);
        res.render('homepage', { title: 'Animals | HubSpot APIs', animals });  
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get('/update-cobj', async (req, res) => {
    try {
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });      
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
app.post('/update-cobj', async (req, res) => {
    const newAnimal = {
        properties : {
            "name" : req.body.name,
            "animal_biography" : req.body.animal_bio,
            "animal_type" : req.body.animal_type

        }
    }

    //const email = req.query.email; - pass something like this to const newAnimalReq?
    
    const createUrl = `https://api.hubapi.com/crm/v3/objects/2-22879493`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(createUrl, newAnimal, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
        res.redirect('/');
    }

});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));