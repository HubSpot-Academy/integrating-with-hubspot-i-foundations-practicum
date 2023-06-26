const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// Import required modules
const express = require('express');
const axios = require('axios');
const app = express();

// Set up the view engine
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.urlencoded({ extended: true }));

// Define the route for "/update-cobj"
app.get('/update-cobj', (req, res) => {
  const pageTitle = 'Update Custom Object Form | Integrating With HubSpot I Practicum';
  res.render('updates', { pageTitle });
});

// Define the app.post route for form submission
app.post('/update-cobj', (req, res) => {
  // Capture form data
  const formData = req.body;

  // Make a POST request to create a new custom object
  axios
    .post('https://app.hubspot.com/sales-products-settings/24461038/object/2-15978272', formData)
    .then((response) => {
      // Custom object created successfully
      console.log('New custom object created:', response.data);

      // Redirect back to the homepage
      res.redirect('/');
    })
    .catch((error) => {
      // Error occurred while creating the custom object
      console.error('Error creating custom object:', error);

      // Redirect back to the homepage
      res.redirect('/');
    });
});

// Define the root route
app.get('/', (req, res) => {
  res.send('Welcome to the homepage!');
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

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


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
