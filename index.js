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
