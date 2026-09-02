require('dotenv').config();

const express = require('express');
const axios = require('axios');

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// HubSpot custom object information
const PET_OBJECT_TYPE = '2-68580801';
const PET_PROPERTIES = ['name', 'age', 'type'];

// Shared authorization headers for HubSpot API requests
const headers = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  'Content-Type': 'application/json'
};

// ROUTE 1
// Retrieve Pet records and render the homepage table.
app.get('/', async (req, res) => {
  const getPetsUrl =
    `https://api.hubapi.com/crm/v3/objects/${PET_OBJECT_TYPE}` +
    `?limit=100&properties=${PET_PROPERTIES.join(',')}`;

  try {
    const response = await axios.get(getPetsUrl, { headers });
    const data = response.data.results;

    res.render('homepage', {
      title: 'Pet Records | Integrating With HubSpot I Practicum',
      data
    });
  } catch (error) {
    console.error(
      'Error retrieving Pet records:',
      error.response?.data || error.message
    );

    res.status(500).send('Unable to retrieve Pet records from HubSpot.');
  }
});

// ROUTE 2
// Render the form used to create a Pet record.
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title:
      'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

// ROUTE 3
// Create a Pet record from the submitted form data.
app.post('/update-cobj', async (req, res) => {
  const createPetUrl =
    `https://api.hubapi.com/crm/v3/objects/${PET_OBJECT_TYPE}`;

  const newPet = {
    properties: {
      name: req.body.name,
      age: req.body.age,
      type: req.body.type
    }
  };

  try {
    await axios.post(createPetUrl, newPet, { headers });
    res.redirect('/');
  } catch (error) {
    console.error(
      'Error creating Pet record:',
      error.response?.data || error.message
    );

    res.status(500).send('Unable to create the Pet record in HubSpot.');
  }
});

// Localhost
app.listen(3000, () =>
  console.log('Listening on http://localhost:3000')
);