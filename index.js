//Load env files and the libraries I need
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

// Configure express for parsing, finding files and use Pug
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', './views');

const HUBSPOT_TOKEN = process.env.PRIVATE_APP_ACCESS_TOKEN;

//Object API Name
const OBJECT_TYPE = '2-63084340';

//Column API name
const PROPERTY_1 = 'pet_name';           
const PROPERTY_2 = 'color';   
const PROPERTY_3 = 'pet_type';
const PROPERTY_4 = 'sound';

// Column headers 
const COL_1_LABEL = 'Name';
const COL_2_LABEL = 'Color';
const COL_3_LABEL = 'Type';
const COL_4_LABEL = 'Sound';

// Route 1: Homepage — GET /
// Displays table
// ─────────────────────────────────────────────
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`,
      {
        params: {
          properties: `${PROPERTY_1},${PROPERTY_2},${PROPERTY_3},${PROPERTY_4}`,
          limit: 100
        },
        headers: {
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const records = response.data.results;

    res.render('homepage', {
      title: 'Custom Object List | Integrating With HubSpot I Practicum',
      records,
      col1: COL_1_LABEL,
      col2: COL_2_LABEL,
      col3: COL_3_LABEL,
      col4: COL_4_LABEL,
      prop1: PROPERTY_1,
      prop2: PROPERTY_2,
      prop3: PROPERTY_3,
      prop4: PROPERTY_4
    });

  } catch (error) {
    console.error('Error fetching records:', error.response?.data || error.message);
    res.status(500).send('Error fetching records. Check your terminal for details.');
  }
});

// ─────────────────────────────────────────────
// Route 2:
// Record creation page
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
    col1: COL_1_LABEL,
    col2: COL_2_LABEL,
    col3: COL_3_LABEL,
    col4: COL_4_LABEL,
    prop1: PROPERTY_1,
    prop2: PROPERTY_2,
    prop3: PROPERTY_3,
    prop4: PROPERTY_4
  });
});

// ─────────────────────────────────────────────
// Route 3:
// Receives form data and creates a new record
// ─────────────────────────────────────────────
app.post('/update-cobj', async (req, res) => {
  const formData = req.body;

  try {
    await axios.post(
      `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`,
      {
        properties: {
          [PROPERTY_1]: formData[PROPERTY_1],
          [PROPERTY_2]: formData[PROPERTY_2],
          [PROPERTY_3]: formData[PROPERTY_3],
          [PROPERTY_4]: formData[PROPERTY_4]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // homepage redirect
    res.redirect('/');

  } catch (error) {
    console.error('Error creating record:', error.response?.data || error.message);
    res.status(500).send('Error creating record. Check your terminal for details.');
  }
});

// server start
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000 — open this in your browser');
});
