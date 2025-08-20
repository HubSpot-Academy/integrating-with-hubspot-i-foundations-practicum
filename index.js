require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const PRIVATE_APP_ACCESS = process.env.TOKEN_HUBSPOT;

// ---------- ROUTE 1: Homepage (lista contactos) ----------
app.get('/', async (req, res) => {
  const url = 'https://api.hubapi.com/crm/v3/objects/contacts';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    // Trae solo las propiedades que vas a mostrar
    const resp = await axios.get(url, {
      headers,
      params: {
        properties: ['firstname', 'lastname', 'email'],
        limit: 50,
        archived: false
      }
    });

    const data = resp.data.results || [];
    res.render('homepage', {
      title: 'Contacts | Integrating With HubSpot I Practicum',
      contacts: data
    });
  } catch (err) {
    console.error('GET / error:', err?.response?.data || err.message);
    res.status(500).send('Error obteniendo contactos.');
  }
});

// ---------- ROUTE 2: Formulario (render pug "updates") ----------
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
  });
});

// ---------- ROUTE 3: Crear contacto desde el formulario ----------
app.post('/update-cobj', async (req, res) => {
  const { firstname, lastname, email } = req.body;

  const url = 'https://api.hubapi.com/crm/v3/objects/contacts';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  const body = {
    properties: {
      firstname,
      lastname,
      email
    }
  };

  try {
    await axios.post(url, body, { headers });
    res.redirect('/');
  } catch (err) {
    console.error('POST /update-cobj error:', err?.response?.data || err.message);
    res.status(500).send('Error creando el contacto. Revisa la consola del servidor.');
  }
});

// ---------- Localhost ----------
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
