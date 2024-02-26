const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug'); // Set the view engine to Pug
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = 'pat-na1-801b84ff-16be-499d-ba99-069267968fef'; // Your private app access token goes here

// Route 1 - Fetch data of VideoGame custom object and render it on the homepage
app.get('/', async (req, res) => {
    const videoGamesEndpoint = 'https://api.hubapi.com/crm/v3/objects/VideoGame?properties=name,bio,game';
    const headers = {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
    };

    try {
      const resp = await axios.get(videoGamesEndpoint, { headers });
      const videoGamesData = resp.data.results;
      res.render('homepage', { title: 'Custom Object Table', videoGamesData });
      //res.json(videoGamesData);
    } catch (error) {
      console.error(error);
    }
  });

// Route 2 - Render the form for creating or updating VideoGame custom object
app.get('/update-cobj', (req, res) => {
  res.render('updates.pug', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// Route 3 - Handle form submission to create or update VideoGame custom object
app.post('/update-cobj', async (req, res) => {
  const { name, bio, game } = req.body;
  const newVideoGame = {
    properties: { name, bio, game }
  };

  const createVideoGameEndpoint = 'https://api.hubspot.com/crm/v3/objects/VideoGame';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    await axios.post(createVideoGameEndpoint, newVideoGame, { headers });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating or updating Video Game Character');
  }
});

// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
