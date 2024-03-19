/*
const express = require('express');
const axios = require('axios');
const app = express();
const session = require('express-session');
const querystring = require('querystring');

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '3368da6d-2c77-4d6b-915f-13fd5cf8ac05';

const authUrl = "https://app-eu1.hubspot.com/oauth/authorize?client_id=5a58f855-a10c-4696-860b-f7f77b4cc312&redirect_uri=http://localhost:3000/practicum/&scope=crm.objects.contacts.read%20crm.schemas.custom.read%20crm.objects.custom.read"

const tokenStore = {};

app.use(session({
    secret: Math.random().toString(36).substring(2),
    resave: false,
    saveUninitialized: true
}));

const isAuthorized = (userId) => {
    return tokenStore[userId] ? true : false;
}

async function checkContactExists() {

}

async function updateContactName(newName) {

}

async function createContact(newName) {

}

app.get('/practicum', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('practicum', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
    res.render("updates");
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const newName = req.body.newName

    const contactExists = await checkContactExists();

    if (contactExists) {
        await updateContactName(newName)
    } else {
        await createContact(newName);
    }
    res.redirect('/')
})

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000/practicum'));
*/

/* ----------------------------------------------- */

require('dotenv').config();
const axios = require('axios');
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Hubspot services
const hubspot_service = {
  hubspotHeaders: {
    headers: {
      'Authorization': `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
      'Content-Type': 'application/json'
    }
  },
  getObjects: async (objectId) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${objectId}?limit=100&archived=false&properties=name&properties=weight&properties=type`;

    try {
      const response = await axios.get(url, hubspot_service.hubspotHeaders);
      return response.data.results;
    } catch (error) {
        console.log(error)
      return;
    }
  },
  updateObjects: async (objectId, formData) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${objectId}/`;
    try {
      const item = {
        properties: {
          "name": formData.name,
          "weight": formData.weight,
          "type": formData.type
        }
      };
     
      await axios.post(url, item, hubspot_service.hubspotHeaders);
      return {
        result: true
      }
    } catch (error) {
      return {
        result: false,
        error
      }
    }
  }
}

// tool service

const tools_service = {
    page_names: {
        home: 'Dogs | Integrating With HubSpot I Practicum',
        update: 'Dogs updated | Integrating With HubSpot I Practicum',
    }
}

// index.js

const CONTACT_ID = process.env.CONTACT_ID;

app.get('/', async (req, res) => {
    res.render('home', {
        title: tools_service.page_names.home,
        data: await hubspot_service.getObjects(CONTACT_ID)
      }
    )
}
);

app.get('/updates', async (req, res) => res.render('updates', {
    title: tools_service.page_names.update
  }
));

app.post('/updates', async (req, res) => {
  const request = await hubspot_service.updateObjects(CONTACT_ID, req.body);
  if(request.result)  res.redirect('/');  
  else res.status(500).send(request.error.response ? request.error.response.data : 'Error...');
});

app.listen(3000, () => console.log(`Listening on 3000`));
