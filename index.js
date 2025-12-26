require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ***************************************************************
// CONFIGURACIÓN FINAL
// ***************************************************************
const PRIVATE_APP_TOKEN = process.env.PRIVATE_APP_ACCESS_TOKEN;

// TU ID DE OBJETO REAL (Sacado de tu enlace)
const OBJECT_ID = '2-54575926';

// Nombres internos de las propiedades
const PROP_NAME = 'name';
const PROP_PUB = 'publisher';
const PROP_PRICE = 'price';
// ***************************************************************

// RUTA 1: HOME (Tabla de videojuegos)
app.get('/', async (req, res) => {
    const endpoint = `https://api.hubapi.com/crm/v3/objects/${OBJECT_ID}?properties=${PROP_NAME},${PROP_PUB},${PROP_PRICE}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
    };
    try {
        const resp = await axios.get(endpoint, { headers });
        res.render('homepage', { 
            title: 'Practicum Videojuegos | Final', 
            data: resp.data.results,
            props: { name: PROP_NAME, pub: PROP_PUB, price: PROP_PRICE } 
        });
    } catch (error) {
        console.error('Error al conectar con HubSpot:', error.response ? error.response.data : error.message);
        res.render('error', { title: 'Error de conexión | Revisa consola' });
    }
});

// RUTA 2: FORMULARIO (Mostrar)
app.get('/update-cobj', (req, res) => {
    res.render('updates', { 
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' 
    });
});

// RUTA 3: FORMULARIO (Crear registro)
app.post('/update-cobj', async (req, res) => {
    const endpoint = `https://api.hubapi.com/crm/v3/objects/${OBJECT_ID}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
    };
    const data = {
        properties: {
            [PROP_NAME]: req.body.name,
            [PROP_PUB]: req.body.publisher,
            [PROP_PRICE]: req.body.price
        }
    };
    try {
        await axios.post(endpoint, data, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error al crear videojuego:', error.response ? error.response.data : error.message);
        res.redirect('/');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));