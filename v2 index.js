require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('veiw engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const hubspot = axios.create({
  baseURL: 'https://api.hubapi.com',
  headers: {
    Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

const CUSTOM_OBJECT = process.env.HUBSPOT_CUSTOM_OBJECT_TYPE;
console.log(`Server running on http://localhost:${PORT}`);
console.log('custom object ${CUSTOM_OBJECT');

app.post('/update-cobj', async (req, res) => {
  try {
    const { name, device } = req.body;

    const payload = {
      properties: {
        name: name,      // REQUIRED for custom objects
        device: device
      }
    };

    await hubspot.post(`/crm/v3/objects/${CUSTOM_OBJECT}`, payload);
    res.redirect('/');
  } catch (error) {
    console.error('Error creating custom object record:', error.response?.data || error.message);
    res.status(500).send('Error creating record');
  }
});



app.get('/', async (req, res) => {
  try {
    const response = await hubspot.get(`/crm/v3/objects/${CUSTOM_OBJECT}`, {
      params: {
        properties: ['name'].join(','),
        limit: 100
      }
    });

    const records = response.data.results || [];
    console.log('Sample record:', JSON.stringify(records[0], null, 2));


    res.render('homepage', {
      title: 'Custom Objects Homepage | Integrating With HubSpot I Practicum',
      records
    });
  } catch (error) {
    console.error('Error fetching custom object records:', error.response?.data || error.message);
    res.status(500).send('Error ** fetching records ***');
  }
});



// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
// * const PRIVATE_APP_ACCESS = ''; *// removed

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

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
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
