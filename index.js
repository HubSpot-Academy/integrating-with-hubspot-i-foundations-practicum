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
    const objectId = await checkCustomObject();
    const data = await getCustomObject(objectId);
    
    res.render('homepage', { title: 'Index', data, objectId });
});

// ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', async (req, res) => {
    const objectId = req.query.id;

    if (!objectId) {
        const objectId = await checkCustomObject();
        res.redirect(301, `/update-cobj?id=${objectId}`);
    }

    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum.'});
});

// ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const update = {
        properties: {
            "name": req.body.name,
            "winner": req.body.winner,
            "looser": req.body.looser
        }
    }
    const objectId = req.query.id;
    const custom = `https://api.hubspot.com/crm/v3/objects/${objectId}`;

    try { 
        await axios.post(custom, update, { headers } );
        res.redirect(301, '/');
    } catch(err) {
        console.error(err);
    }

});

// * Localhost
app.listen(3000, () => console.log('-> http://localhost:3000'));


const checkCustomObject = async () => {
    const custom = `https://api.hubspot.com/crm/v3/schemas`;
    try {
        const { data } = await axios.get(custom, { headers });

        if (data.results) {
            const competitions = data.results.filter(x => x.fullyQualifiedName && x.fullyQualifiedName.toLowerCase().includes(CUSTOM_OBJECT_NAME));
            
            let objectId;
            // haven't custom object
            if (competitions.length === 0) 
            {
                // then create it
                const results = await createCustomObject();
                objectid = results.objectTypeId;
            } else {
                objectId = competitions[0].objectTypeId;
            }

            return objectId;
        }
    } catch (error) {
        if (error.response && error.response.status === 400) {
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
    const params = new URLSearchParams();
    params.append('properties', 'name');
    params.append('properties', 'winner');
    params.append('properties', 'looser');
    
    const custom = `https://api.hubspot.com/crm/v3/objects/${objectId}`;
    try {
        const { data } = await axios.get(custom, { headers, params });
        return data.results;
        
    } catch (error) {
        console.log(error.data);
    }

    return false;
};