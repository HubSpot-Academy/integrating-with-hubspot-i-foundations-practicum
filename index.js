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
  // 1) Validar token antes de llamar a HubSpot
  const PRIVATE_APP_ACCESS = process.env.TOKEN_HUBSPOT;
  if (!PRIVATE_APP_ACCESS) {
    console.error('Falta la variable de entorno TOKEN_HUBSPOT.');
    return res
      .status(500)
      .send('Config error: falta TOKEN_HUBSPOT en .env (no lo subas al repo).');
  }

  // 2) Parámetros de paginación
  const limit = Math.min(parseInt(req.query.limit || '100', 10), 100); // máx 100
  const after = req.query.after || undefined;

  // “Pila” de cursores para Prev (opcional)
  const trail = (req.query.trail ? req.query.trail.split('.') : []).filter(Boolean);
  const currentTrail = after ? [...trail, after] : trail;

  // 3) Cliente Axios configurado
  const hs = axios.create({
    baseURL: 'https://api.hubapi.com',
    headers: {
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json',
    },
    timeout: 15000,
  });

  try {
    // 4) Llamada al endpoint de contactos con properties en CSV
    const params = {
      properties: 'firstname,lastname,email',
      limit,
      archived: false,
      ...(after ? { after } : {}),
    };

    const resp = await hs.get('/crm/v3/objects/contacts', { params });

    // 5) Normalizar filas para no usar optional chaining en Pug
    const results = Array.isArray(resp.data?.results) ? resp.data.results : [];
    const contacts = results.map((r) => ({
      id: r.id,
      firstname: (r.properties && r.properties.firstname) || '',
      lastname: (r.properties && r.properties.lastname) || '',
      email: (r.properties && r.properties.email) || '',
    }));

    // 6) Paginación siguiente/anterior
    const nextAfter = resp.data?.paging?.next?.after || null;

    const prevAfter =
      currentTrail.length > 1 ? currentTrail[currentTrail.length - 2] : null;
    const prevTrail =
      currentTrail.length > 1 ? currentTrail.slice(0, -2).join('.') : '';

    const nextTrail = nextAfter
      ? [...currentTrail, nextAfter].join('.')
      : currentTrail.join('.');

    // 7) Render
    return res.render('homepage', {
      title: 'Contacts | Integrating With HubSpot I Practicum',
      contacts,
      limit,
      nextAfter,
      nextTrail,
      prevAfter,
      prevTrail,
    });
  } catch (error) {
    // Log detallado para detectar el motivo real
    const status = error?.response?.status;
    const data = error?.response?.data;
    console.error('GET / contacts error -> status:', status);
    console.error('data:', JSON.stringify(data, null, 2));
    console.error('message:', error.message);

    // Errores frecuentes y cómo se ven:
    // 401/403 -> Token inválido o scopes insuficientes (asegúrate de "crm.objects.contacts:read").
    // 400 -> parámetro inválido (properties mal formateado, after inválido, etc).
    // 429 -> rate limit, reintentar luego.
    return res.status(500).send('Error obteniendo contactos (revisa consola del servidor).');
  }
});

// ---------- ROUTE 2: Formulario (render pug "updates") ----------
app.get('/update-cobj', (req, res) => {
  res.render('update', {
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
