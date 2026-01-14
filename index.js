require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

// Custom object and type ID (of URL) in HubSpot: /objects/2-56042618/...
const CUSTOM_OBJECT_TYPE_ID = '2-56042618'

// Internal names of the properties:
const PROP_1 = 'name';     // String required "Name"
const PROP_2 = 'bio';      // Internal real name
const PROP_3 = 'species'; // Internal real name

function getHeaders() {
  return {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };
}

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
  const url = `https://api.hubspot.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE_ID}?limit=100&properties=${PROP_1}&properties=${PROP_2}&properties=${PROP_3}`;

  try {
    const resp = await axios.get(url, { headers: getHeaders() });
    const data = resp.data.results;

    // Renderiza un pug template "home" que tú creas en /views/home.pug
    res.render('home', {
      title: 'Pets | HubSpot Custom Objects',
      data,
      prop1: PROP_1,
      prop2: PROP_2,
      prop3: PROP_3
    });
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).send(error?.response?.data || error.message);
  }
});


// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Create Pet Record',
    prop1: PROP_1,
    prop2: PROP_2,
    prop3: PROP_3
  });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
  const createUrl = `https://api.hubspot.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE_ID}`;

  // En el form vamos a mandar campos: prop1, prop2, prop3
  const payload = {
    properties: {
      [PROP_1]: req.body.prop1,
      [PROP_2]: req.body.prop2,
      [PROP_3]: req.body.prop3,
    }
  };

  try {
    await axios.post(createUrl, payload, { headers: getHeaders() });
    res.redirect('/');
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).send(err?.response?.data || err.message);
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
