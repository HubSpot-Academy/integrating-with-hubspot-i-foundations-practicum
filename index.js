const express = require('express');
const axios = require('axios');
const app = express();
const port = 8080;

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;
console.log('PRIVATE_APP_ACCESS:', PRIVATE_APP_ACCESS); // Log to check if the token is set

app.get('/', (req, res) => {
  const message = req.query.message; // Get the success message from query parameters
  res.render('index', { title: 'Hey', helloMessage: 'Hello there!', successMessage: message });
});

app.get('/update-cobj', (req, res) => {
  try {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
  } catch (error) {
    console.error(error);
  }
});

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

app.get('/pets', async (req, res) => {
  const petsUrl = 'https://api.hubapi.com/crm/v3/objects/pets?properties=pet_name&properties=pet_type&properties=pet_breed';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json',
  };

  console.log('Starting to fetch pets'); // Log start of fetching process

  try {
    const resp = await axios.get(petsUrl, { headers });
    const data = resp.data.results;
    console.log('Fetched Pets Data:', data);  // Log the fetched data

    if (!Array.isArray(data)) {
      console.error('Data is not an array');
      res.status(500).send('Invalid data format');
      return;
    }

    res.render('pets', { title: 'Pets | HubSpot APIs', data });
  } catch (error) {
    console.error('Error fetching pets:', error.response ? error.response.data : error.message);
    res.status(500).send('An error occurred while fetching pets.');
  }
});


app.post('/update-pets', async (req, res) => {
  const petProperties = {
      properties: {
          pet_name: req.body.pet_name,
          pet_type: req.body.pet_type,
          pet_breed: req.body.pet_breed
      }
  }

  const updatePet = `https://api.hubapi.com/crm/v3/objects/pets`;
  const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
  };

  try { 
      await axios.post(updatePet, petProperties, { headers } );
      res.redirect('/?message=Pet Added Successfully');
  } catch(err) {
      console.error(err);
  }

});


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

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

// Global error handler for unhandled exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1); // Exit the process to avoid unknown state
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1); // Exit the process to avoid unknown state
});

// * Localhost
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
