const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = 'pat-eu1-85bcfee7-c58f-4402-826a-528e6c0e3263';

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));

app.get('/', async (req, res) => {
  const coffee =
    'https://api.hubapi.com/crm/v3/objects/coffee?limit=10&properties=name&properties=description&properties=price&properties=dietary_info&archived=false';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };
  try {
    const resp = await axios.get(coffee, { headers });
    const data = resp.data.results;
    res.render('homepage', { title: 'Coffee Table', data });
  } catch (error) {
    console.error(error);
  }
});

app.get('/update-cobj', async (req, res) => {
  const title =
    'Update Custom Object Form | Integrating With HubSpot I Practicum';
  res.render('updates', { title: title });
});

app.post('/update-cobj', async (req, res) => {
  const formData = req.body;

  const customObjectData = JSON.stringify({
    properties: {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      dietary_info: formData.dietary_info
    }
  });

  const coffee = `https://api.hubapi.com/crm/v3/objects/coffee`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    await axios.post(coffee, customObjectData, { headers });
    res.redirect('/');
  } catch (err) {
    console.error(err);
  }
});
