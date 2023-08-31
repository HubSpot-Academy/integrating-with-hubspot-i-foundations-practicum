const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-na1-d06d72a9-9bed-4f97-91f7-1998749955ba';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    //res.send('homepage!')
    const pets = 'https://api.hubapi.com/crm/v3/objects/2-16358760?properties=pet_name, pet_type__v2_, pet_gender';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(pets, { headers });
        const data = resp.data.results;
        //res.send(data);
        res.render('homepage', { title: 'Pets | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
  });

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
  app.get('/update-cobj', async (req, res) => {
    res.render('updates', {title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'})
  });

  // TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
  app.post('/update-cobj', async (req, res) => {
    
    const filterGroups = [
      {
        "filters":[
          {
            "propertyName": "pet_name",
            "operator": "EQ",
            "value": req.body.petname
          }
        ]
      }
    ];
    const searchPet = 'https://api.hubapi.com/crm/v3/objects/2-16358760/search';

    const properties = {
      "pet_name": req.body.petname,
      "pet_type__v2_": req.body.pettype,
      "pet_gender": req.body.petgender
  };

    const pets = 'https://api.hubapi.com/crm/v3/objects/2-16358760';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const objSearch = await axios.post(searchPet, { filterGroups }, { headers });
        //const objSearchdata = objSearch.data.results[0].id;

       // if pet name is exist I perform the object update
        if(objSearch.data.total > 0){//update
            const respupdate = await axios.patch(pets+'/'+objSearch.data.results[0].id, { properties }, { headers });
            const dataUpdate = respupdate.data;
            if(dataUpdate.id){
                return res.redirect('/');
            }else{
                res.send("Error!");
            }
        }else{ //if the pet name is not found then I perform the create

        const resp = await axios.post(pets, { properties }, { headers });
        const data = resp.data;
        if(data.id){
            return res.redirect('/');
        }else{
            res.send("Error!");
        }
      }
    } catch (error) {
        console.error(error);
    }
  });


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));