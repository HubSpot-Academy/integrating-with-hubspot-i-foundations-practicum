const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';

app.get('/', async (req, res) => {
    // Include all properties we want to retrieve
    const properties = ['firstname', 'email', 'phone', 'createdate'];
    const crmUrl = `https://api.hubspot.com/crm/v3/objects/contacts?properties=${properties.join(',')}`;
    
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    
    try {
        const response = await axios.get(crmUrl, { headers });
        const contacts = response.data.results || [];
        res.render('homepage', { 
            title: 'CRM Contacts | Home',
            contacts: contacts
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).render('error', { 
            message: 'Error loading contacts',
            error: process.env.NODE_ENV === 'development' ? error : {}
        });
    }
});

app.post('/update-cobj', async (req, res) => {
    const { name, email, phone } = req.body;
    
    const newContact = {
        properties: {
            "firstname": name,
            "email": email,
            "phone": phone
        }
    };

    const url = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(url, newContact, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).send('Error creating contact');
    }
});

app.get('/update-cobj', (req, res) => {
    res.render('updates', { 
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));