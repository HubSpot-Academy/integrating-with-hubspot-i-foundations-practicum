const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.HS_TOKEN;
const CUSTOM_OBJECT = process.env.HS_CUSTOM_OBJECT;
const PROPS = (process.env.HS_PROPS).split(',').map(s => s.trim()).filter(Boolean);

const hsHeaders = {
  Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
  'Content-Type': 'application/json',
};

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get('/', async (req, res) => {
// * Code for Route 1 goes here
  try {
    // Construimos la URL para listar objetos con las propiedades solicitadas
    const propsQuery = PROPS.length ? `?properties=${encodeURIComponent(PROPS.join(','))}` : '';
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT}${propsQuery}`;

    const resp = await axios.get(url, { headers: hsHeaders });
    const rows = resp.data?.results || [];

    // Renderizar plantilla homepage.pug
    const labels = {
        nombre: 'Name',
        tipo_de_animal: 'Animal Type', 
        edad: 'Age'                
        };

    res.render('homepage', {
      title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
      rows,
      props: PROPS, // para imprimir columnas dinámicamente
      labels       // para mostrar nombres legibles en la tabla
    });
  } catch (error) {
    console.error('Error GET /:', error?.response?.data || error.message);
    res.status(500).send('Error al obtener datos del objeto personalizado.');
  }
});
// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get('/update-cobj', (req, res) => {
// * Code for Route 2 goes here
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
    props: PROPS, // para generar inputs automáticamente
  });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
app.post('/update-cobj', async (req, res) => {
// * Code for Route 3 goes here
  try {
    // Construimos el objeto properties a partir del body
    const properties = {};
    for (const p of PROPS) {
      properties[p] = req.body[p] ?? ''; // toma valor del input con el mismo nombre interno
    }

    const payload = { properties };

    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT}`;
    await axios.post(url, payload, { headers: hsHeaders });

    // Al crear, volvemos a la página de inicio
    res.redirect('/');
  } catch (error) {
    console.error('Error POST /update-cobj:', error?.response?.data || error.message);
    
    res.status(500).send('Error al crear el registro del objeto personalizado.');
  }
});
/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));