const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
    const customObjects = 'https://api.hubspot.com/crm/v3/objects/2-14963659?portalId=39772501&properties=name&properties=description&properties=price'
    // const customObjects = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(customObjects, { headers });
        const data = resp.data.results;
        console.log("data--->", data)
        res.render('homepage', { title: 'Custom Objects | HubSpot APIs', data, cache: false });      
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj', (req, res) => {
    res.render('updates',{ title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
  });
  

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

app.post('/update-cobj', async (req, res) => {
  const customObject = {
    properties: {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
    }
  };

  const createOrUpdateCustomObjectUrl = 'https://api.hubspot.com/crm/v3/objects/2-14963659';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const checkRecordExistsUrl = `${createOrUpdateCustomObjectUrl}/search`;
    const searchPayload = {
      filterGroups: [
        {
          filters: [
            {
              propertyName: 'name', 
              operator: 'EQ',
              value: req.body.name
            }
          ]
        }
      ]
    };
    const checkRecordExistsResponse = await axios.post(checkRecordExistsUrl, searchPayload, { headers });

    if (checkRecordExistsResponse.data.total === 0) {
      // Custom object record doesn't exist, create a new one
      const createCustomObjectResponse = await axios.post(createOrUpdateCustomObjectUrl, customObject, { headers });
      console.log("New custom object record created:", createCustomObjectResponse.data);
    } else {
      // Custom object record already exists, update it
      const recordId = checkRecordExistsResponse.data.results[0].id;
      const updateCustomObjectUrl = `${createOrUpdateCustomObjectUrl}/${recordId}`;
      await axios.patch(updateCustomObjectUrl, customObject, { headers });
      console.log("Custom object record updated:", recordId);
    }

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});
// Only Updates with harcoded objectID
// app.post('/update-cobj', async (req, res) => {
//     const customObject = {
//         properties: {
//         name: req.body.name,
//         description: req.body.description,
//         price: req.body.price,
//       }
//     };
//     console.log("customObject", customObject)
//     const createOrUpdateCustomObjectUrl = 'https://api.hubspot.com/crm/v3/objects/2-14963659/6377083650';
//     const headers = {
//       Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
//       'Content-Type': 'application/json'
//     };
  
//     try {
//       await axios.patch(createOrUpdateCustomObjectUrl, customObject, { headers });
//       res.redirect('/');
//     } catch (error) {
//       console.error(error);
//       res.redirect('/');
//     }
//   });

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));