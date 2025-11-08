require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

const HUBSPOT_TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
const ACCOUNT_ID = process.env.HUBSPOT_ACCOUNT_ID;
const CUSTOM_OBJECT = "contacts";
const PORT = process.env.PORT || 3000;

if (!HUBSPOT_TOKEN || !CUSTOM_OBJECT || !ACCOUNT_ID) {
  console.warn("⚠️ Please set HUBSPOT_PRIVATE_APP_TOKEN, HUBSPOT_CUSTOM_OBJECT, and HUBSPOT_ACCOUNT_ID in .env");
}

const hubspotClient = axios.create({
  baseURL: 'https://api.hubapi.com',
  headers: {
    Authorization: `Bearer ${HUBSPOT_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Helper function to fetch custom object records
async function fetchCustomObjects() {
  try {
    const properties = ['name', 'age', 'type']; // ⚙️ غيّري الأسماء دي حسب الخواص اللي أنشأتيها في HubSpot
    const res = await hubspotClient.get(`/crm/v3/objects/${CUSTOM_OBJECT}`, {
      params: {
        properties: properties.join(','),
        limit: 100
      }
    });
    return res.data;
  } catch (err) {
    console.error('❌ Error fetching objects:', err.response ? err.response.data : err.message);
    throw err;
  }
}

// 🏠 Homepage route
app.get('/', async (req, res) => {
  try {
    const data = await fetchCustomObjects();
    res.render('homepage', { title: 'Homepage', records: data.results || [] });
  } catch (err) {
    res.status(500).send('Error fetching data from HubSpot API.');
  }
});

// 📋 Form page route
app.get('/update-cobj', (req, res) => {
  res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// 🚀 Create new record
app.post('/update-cobj', async (req, res) => {
  try {
    const { name, age, type } = req.body;

    const body = {
      properties: {
        name: name,
        age: age,
        type: type
      }
    };

    await hubspotClient.post(`/crm/v3/objects/${CUSTOM_OBJECT}`, body);
    res.redirect('/');
  } catch (err) {
    console.error('❌ Error creating record:', err.response ? err.response.data : err.message);
    res.status(500).send('Error creating record in HubSpot.');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
