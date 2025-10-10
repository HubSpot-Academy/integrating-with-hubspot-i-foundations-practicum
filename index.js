require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`https://api.hubapi.com/crm/v3/objects/2-174555175?properties=pokemon_name,pokemon_type,pokemon_description&limit=100`, {
        headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    const pokemons = response.data.results.map(obj => ({
        pokemon_name: obj.properties.pokemon_name,
        pokemon_type: obj.properties.pokemon_type,
        pokemon_description: obj.properties.pokemon_description
    }));

    res.render('home', { pokemons });
  } catch (error) {
    console.error(error);
    res.send('Error fetching custom objects');
  }
});

app.get('/update-cobj', (req, res) => {
  res.render('updates', { pageTitle: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

app.post('/update-cobj', async (req, res) => {
  const { pokemon_name, pokemon_type, pokemon_description } = req.body;

  try {
    // Send POST request to HubSpot API
    await axios.post(
      'https://api.hubapi.com/crm/v3/objects/2-174555175',
      {
        properties: {
          pokemon_name,
          pokemon_type,
          pokemon_description
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // After successful creation, redirect back to homepage
    res.redirect('/');
  } catch (error) {
    console.error(error.response?.data || error);
    res.send('Error creating new Pokémon record');
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));