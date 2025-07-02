require('dotenv').config();
const express = require('express');
const axios = require('axios');
const hubspot = require('@hubspot/api-client');
const app = express();

const hubspotClient = new hubspot.Client({
  accessToken: process.env.PRIVATE_APP_ACCESS
});

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** ✅ ROUTE 1 — Homepage: Mostrar todos los contactos */
app.get('/', async (req, res) => {
  try {
    const contactsResponse = await hubspotClient.crm.contacts.basicApi.getPage(
      10,
      undefined,
      [
        'email',
        'firstname',
        'lastname',
        'icecream_flavor',
        'message',
        'feeling_after_eating',
        'second_scoop'
      ]
    );

    const contacts = contactsResponse.results;

    res.render('contacts', {
      title: 'Dessert Directory | Contacts',
      data: contacts
    });
  } catch (error) {
    console.error('❌ Error fetching contacts:', error.message || error);
    res.status(500).send('Error fetching contacts');
  }
});

//** ✅ ROUTE 2 — Formulario para crear nuevo contacto */
app.get('/update-contact', (req, res) => {
  res.render('updates', {
    title: 'Update Contact | Dessert Directory'
  });
});
//** ✅ ROUTE 3
app.post('/update-contact', async (req, res) => {
  const {
    fullname,
    email,
    icecream_flavor,
    message,
    feeling_after_eating,
    second_scoop
  } = req.body;

  const [firstname, ...rest] = fullname.split(' ');
  const lastname = rest.join(' ') || 'DessertLover';

  try {
    const createContact = await hubspotClient.crm.contacts.basicApi.create({
      properties: {
        email,
        firstname,
        lastname,
        icecream_flavor,
        message,
        feeling_after_eating,
        second_scoop
      }
    });

    console.log('✅ Contact created:', createContact.id);
    res.redirect('/');
  } catch (error) {
    console.error('❌ Error creating contact:', error.message || error);
    res.status(500).send(`<h2>Something went wrong.</h2><p>${error.message}</p>`);
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
