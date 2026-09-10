const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';

// Custom object type ID from the HubSpot developer test account (see README.md)
const CUSTOM_OBJECT_TYPE_ID = '2-68976453';
// Internal names of the three custom properties created on this object.
// Update these if they differ from the property internal names in HubSpot.
const CUSTOM_PROPERTIES = ['name', 'age', 'bio'];

const hubspotHeaders = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

const customObjectUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE_ID}`;

// ROUTE 1 - Homepage: retrieve custom object records and render them in a table
app.get('/', async (req, res) => {
    try {
        const resp = await axios.get(customObjectUrl, {
            headers: hubspotHeaders,
            params: { properties: CUSTOM_PROPERTIES.join(',') }
        });
        const data = resp.data.results;
        res.render('homepage', {
            title: 'Custom Objects Table | Integrating With HubSpot I Practicum',
            data
        });
    } catch (error) {
        console.error(error.response?.data || error);
        const hubspotMessage = error.response?.data?.message;
        res.status(500).send(
            `Error retrieving custom object records${hubspotMessage ? `: ${hubspotMessage}` : ''}`
        );
    }
});

// ROUTE 2 - Render the HTML form used to create a new custom object record
app.get('/update-cobj', async (req, res) => {
    try {
        res.render('updates', {
            title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error rendering the custom object form');
    }
});

// ROUTE 3 - Create a new CRM record from the form data, then redirect home
app.post('/update-cobj', async (req, res) => {
    const newRecord = {
        properties: {
            name: req.body.name,
            age: req.body.age,
            bio: req.body.bio
        }
    };

    try {
        await axios.post(customObjectUrl, newRecord, { headers: hubspotHeaders });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating custom object record');
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