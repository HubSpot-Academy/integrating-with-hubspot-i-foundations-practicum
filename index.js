require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();  // MOVED: After requires!
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');  // FIXED: 'view', not 'veiw'
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));  // REMOVED DUPLICATES

const hubspot = axios.create({
  baseURL: 'https://api.hubapi.com',
  headers: {
    Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

const CUSTOM_OBJECT = process.env.HUBSPOT_CUSTOM_OBJECT_TYPE;
console.log('custom object', CUSTOM_OBJECT);  // FIXED: String interpolation

// ROUTE 1: Homepage (MOVED BEFORE FORM ROUTES)
app.get('/', async (req, res) => {
  try {
    const response = await hubspot.get(`/crm/v3/objects/${CUSTOM_OBJECT}`, {
      params: {
        properties: 'name,device,value',  // missed third property
        limit: 100
      }
    });

    const records = response.data.results || [];
    console.log('Sample record:', JSON.stringify(records[0], null, 2));

    res.render('homepage', {
      title: 'Custom Objects Homepage | Integrating With HubSpot I Practicum',
      records
    });
  } catch (error) {
    console.error('Error fetching custom object records:', error.response?.data || error.message);
    res.status(500).send('Error fetching records');
  }
});

// ROUTE 2: Form GET (MISSING - THIS FIXES Cannot GET /update-cobj!)
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

// ROUTE 3: Form POST
app.post('/update-cobj', async (req, res) => {
  try {
    const { name, device, value } = req.body;

    const payload = {
      properties: {
        name: name,
        device: device,
        value: value
      }
    };

    await hubspot.post(`/crm/v3/objects/${CUSTOM_OBJECT}`, payload);
    res.redirect('/');
  } catch (error) {
    console.error('Error creating custom object record:', error.response?.data || error.message);
    res.status(500).send('Error creating record');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
