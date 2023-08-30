const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const PRIVATE_APP_ACCESS = 'pat-eu1-e223cb8c-b635-4701-bd31-de38036ff098';
const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};
const CUSTOM_OBJECT_NAME = 'competition';

// ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get('/', async (req, res) => {
    const objectId = checkCustomObject();
    const data = getCustomObject(objectId);
    res.render('index', { title: 'Index', data });
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
    res.render('form');
});

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
app.listen(3000, () => console.log('Listening on http://localhost:3000'));


const checkCustomObject = async () => {
    const custom = `https://api.hubspot.com/crm/v3/schemas`;
    try {
        const { data } = await axios.get(custom, { headers });

        if (data.results) {
            const competitions = data.results.filter(x => x.fullyQualifiedName && x.fullyQualifiedName.includes(CUSTOM_OBJECT_NAME));
            let objectId;
            // haven't custom object
            if (competitions.length > 0) 
            {
                // then create it
                const results = createCustomObject();
                objectid = results.objectTypeId;
            } else {
                objectId = competitions.objectTypeId;
            }

            return objectId;
        }
    } catch (error) {
        if (error.response.status === 400) {
            // if error means no custom object, then create it
            const results = createCustomObject();
            return results.objectTypeId;   
        }
    }

    return false;
};

const createCustomObject = async () => {
    const custom = `https://api.hubspot.com/crm/v3/schemas`;
    const customObject = {
        "name": "Competitions",
        "labels": {
            "singular": "Competition",
            "plural": "Competitions"
        },
        "properties": [
            {
                "name": "name",
                "label": "Name",
                "type": "string",
                "fieldType": "text",
                "archived": false,
                "hasUniqueValue": false
            },
            {
                "name": "winner",
                "label": "Winner",
                "type": "string",
                "fieldType": "text",
                "archived": false,
                "hasUniqueValue": false
            },
            {
                "name": "looser",
                "label": "Looser",
                "type": "string",
                "fieldType": "text",
                "archived": false,
                "hasUniqueValue": false
            },
        ],
        "primaryDisplayProperty": "name",
        "associatedObjects": [
            "CONTACT"
        ],
    };

    try {
        const { data } = await axios.post(custom, customObject, { headers });
        return data.results;
    } catch (error) {
        console.error(error);
    }
};

const getCustomObject = async (objectId) => {
    const custom = `https://api.hubspot.com/crm/v3/objects/${objectId}`;
    try {
        const { data } = await axios.get(custom, { headers });
        return data.results;
        
    } catch (error) {
        console.log(error.data);
    }

    return false;
};