const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('dotenv').config();
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;

app.get('/', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/2-144466597?properties=name,country,image_url,website,opening_date';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try {
        const resp = await axios.get(url, { headers });
        const parks = resp.data.results;
        res.render('homepage', { title: 'My parks', parks });
    } catch (error) {
        console.error('Error fetching parks:', error);
        res.status(500).send('Error fetching parks data');
    }
});

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'});
});

app.post('/update-cobj', async (req, res) => {
  const { name, country, image_url, website, opening_date } = req.body;

  const url = 'https://api.hubapi.com/crm/v3/objects/2-144466597';
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  const data = {
    properties: {
      name,
      country,
      image_url,
      website,
      opening_date
    }
  };

  try {
    await axios.post(url, data, { headers });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating park:', error);
    res.status(500).send('Error creating park');
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