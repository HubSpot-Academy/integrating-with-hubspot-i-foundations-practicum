const express = require('express');
const axios = require('axios');
const { configDotenv } = require('dotenv');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('dotenv').config();
const private_app_token = process.env.PRIVATE_APP_TOKEN;


// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get('/homepage-heroes',async(req,res)=>{
    const heroesEndpoint = 'https://api.hubspot.com/crm/v3/objects/heroes?properties=name,main_attribute,number_of_spells';
    const headers ={
        Authorization:`Bearer ${private_app_token}`,
        'Content-Type':'application/json'
    }
    try{
        const response = await axios.get(heroesEndpoint,{headers});
        console.log('API Response:',JSON.stringify(response.data,null,2));
        const heroes = response.data.results;
        console.log('Hero data:',JSON.stringify(heroes,null,2));
        res.render('homepage',{heroes:heroes});
    } catch (error){
        console.error(error);
    }
}
)
// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get('/update-heroes',(req,res)=>{
try{
    res.render('update-heroes',{pageTitle:'Update Custom Object Form | Integrating With HubSpot I Practicum'})
} catch(error){
    console.error(error);
}
}
);

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
app.post('/update-heroes',async(req,res)=>{
    const heroesEndpoint = 'https://api.hubspot.com/crm/v3/objects/heroes';
    const headers ={
        Authorization:`Bearer ${private_app_token}`,
        'Content-Type':'application/json'
    }
    const data = {
    properties:{
        name: req.body.name,
        main_attribute: req.body.main_attribute,
        number_of_spells:req.body.number_of_spells
    }
}
try{
    const response = await axios.post(heroesEndpoint,data,{headers});
    console.log('API Response:',JSON.stringify(response.data,null,2));
    res.redirect('/homepage-heroes');
}catch(error){console.log(error);}});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));