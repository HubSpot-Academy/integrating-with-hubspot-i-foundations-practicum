const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');

require('dotenv').config();
const PORT = process.env.PORT || 3000;
const HUBSPOT_BASE_URL = 'https://api.hubapi.com';
const HUBSPOT_TOKEN = process.env.PRIVATE_APP_ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;
const CUSTOM_OBJECT_FIELDS = parseFields(process.env.CUSTOM_OBJECT_FIELDS || '');

validateConfiguration();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  const propertiesToFetch = CUSTOM_OBJECT_FIELDS.map((field) => field.name).join(',');

  try {
    const response = await axios.get(
      `${HUBSPOT_BASE_URL}/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`,
      {
        params: {
          properties: propertiesToFetch,
          limit: 100,
        },
        headers: hubspotHeaders(),
      },
    );

    const records = (response.data?.results || []).map((record) => ({
      id: record.id,
      properties: record.properties || {},
    }));

    res.render('homepage', {
      title: 'Custom Object Table | Integrating With HubSpot I Practicum',
      fields: CUSTOM_OBJECT_FIELDS,
      records,
      errorMessage: null,
    });
  } catch (error) {
    console.error('Failed to fetch custom object records from HubSpot:', error.message);
    res.render('homepage', {
      title: 'Custom Object Table | Integrating With HubSpot I Practicum',
      fields: CUSTOM_OBJECT_FIELDS,
      records: [],
      errorMessage: 'There was a problem retrieving your custom objects. Please check your credentials and try again.',
    });
  }
});

app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
    fields: CUSTOM_OBJECT_FIELDS,
  });
});

app.post('/update-cobj', async (req, res) => {
  const payload = {
    properties: {},
  };

  CUSTOM_OBJECT_FIELDS.forEach((field) => {
    payload.properties[field.name] = req.body[field.name] || '';
  });

  try {
    await axios.post(
      `${HUBSPOT_BASE_URL}/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`,
      payload,
      { headers: hubspotHeaders() },
    );
    res.redirect('/');
  } catch (error) {
    console.error('Failed to create custom object record in HubSpot:', error.message);
    if (error.response) {
      console.error('HubSpot response:', JSON.stringify(error.response.data, null, 2));
    }
    res.status(500).send('There was a problem creating the record. Please try again.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

function parseFields(fieldsConfig) {
  return fieldsConfig
    .split('|')
    .map((field) => field.trim())
    .filter(Boolean)
    .map((field) => {
      const [name, label] = field.split(':').map((value) => value.trim());
      if (!name) {
        throw new Error('Each value in CUSTOM_OBJECT_FIELDS must have at least a property name.');
      }
      return {
        name,
        label: label || name,
      };
    });
}

function validateConfiguration() {
  if (!HUBSPOT_TOKEN) {
    throw new Error('Missing PRIVATE_APP_ACCESS_TOKEN. Add it to your .env file.');
  }

  if (!CUSTOM_OBJECT_TYPE) {
    throw new Error('Missing CUSTOM_OBJECT_TYPE. Add it to your .env file.');
  }

  if (CUSTOM_OBJECT_FIELDS.length < 3) {
    throw new Error('CUSTOM_OBJECT_FIELDS must define at least three custom properties.');
  }
}

function hubspotHeaders() {
  return {
    Authorization: `Bearer ${HUBSPOT_TOKEN}`,
    'Content-Type': 'application/json',
  };
}


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
