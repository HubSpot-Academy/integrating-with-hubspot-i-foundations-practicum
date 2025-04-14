const express = require('express');
const axios = require('axios');
require('dotenv').config()
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.pat;

app.get('/', async (req, res) => {
    const mountains = 'https://api.hubspot.com/crm/v3/objects/p_mountains?properties=name,location,elevation,country';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(mountains, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Mountains | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

app.get('/update-cobj', async (req, res) => {
    const objectId = req.query.id;
    if (objectId) {
        const getMountain = `https://api.hubapi.com/crm/v3/objects/p_mountains/${objectId}?properties=name,location,elevation,country,hs_object_id`;
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        }
        try {
            const resp = await axios.get(getMountain, { headers });
            const data = resp.data.properties;
            res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', data, submitLabel: 'Update Mountain' });
        } catch (error) {
            console.error(error);
        }
    } else {
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', submitLabel: 'Create Mountain' });
    }
});

app.post('/update-cobj', async (req, res) => {
    const {
        name,
        location,
        elevation,
        country
    } = req.body;
    
    const update = {
        properties: {
            "name": name,
            "location": location,
            "elevation": elevation,
            "country": country
        }
    }
    const objectId = req.body.record_id;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    
    // If the objectId is not null, then we are updating an existing custom object
    // If the objectId is null, then we are creating a new custom object
    if (objectId) {
        const updateMountain = `https://api.hubapi.com/crm/v3/objects/p_mountains/${objectId}`;

        try { 
            await axios.patch(updateMountain, update, { headers } );
            res.redirect('/');
        } catch(err) {
            console.error(err);
        }
    } else {
        const createMountain = `https://api.hubapi.com/crm/v3/objects/p_mountains/`;

        try { 
            await axios.post(createMountain, update, { headers } );
            res.redirect('/');
        } catch(err) {
            console.error(err);
        }
    }
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));