const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); // Set the correct path to your views folder

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-eu1-d6a71838-d4b0-435c-b6fa-8e09f5d46327';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
// ... (previous code remains unchanged)

// Function to fetch CRM record data for the Pet object


app.get('/', async (req, res) => {
    try {
      const petsEndpoint = 'https://api.hubspot.com/crm/v3/objects/assets?properties=prop1,prop2,name';
      const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
      };
      
      const response = await axios.get(petsEndpoint, { headers });
      console.log(response.data)

      if (response.data && response.data.results) {
        const data = response.data.results;
        data.forEach(element => {
            console.log(element.properties);
                
            });
       res.render('homepage', { title: 'Pets', data: data });
      } else {
        console.error('Empty or invalid response data.');
        res.status(500).send('Failed to fetch pets data');
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
      res.status(500).send('Failed to fetch pets data');
    }
  });
  

// Other routes and configurations...

// ... (rest of the code)


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update CRM Record' });
  });

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };
app.post("/update-cobj", async (req, res) => {
    const url = "https://api.hubspot.com/crm/v3/objects/assets";
    const body = {
      properties: {
        name: req.body.name,
        prop1: req.body.prop1,
        prop2: req.body.prop2,
      },
    };
  
    try {
      await axios.post(url, body, { headers });
      res.redirect("/");
    } catch (err) {
      console.error(err);
    }
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