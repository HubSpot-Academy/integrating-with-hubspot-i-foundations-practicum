const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-na1-de7fd6da-ca1c-4106-b64a-2908b9c13bec';
const SALESORDER_OBJECTTYPEID = '2-19009984';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get('/', async (req, res) => {
    const ordersURL = `https://api.hubspot.com/crm/v3/objects/${SALESORDER_OBJECTTYPEID}?limit=100&properties=so&properties=name&properties=grand_total&properties=estimated_ship_date`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(ordersURL, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'View Custom Object List | Integrating With HubSpot I Practicum', data });      
    } catch (error) {
        console.error(error);
    }
})

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get('/update-cobj/:id?', async (req, res) => {
    let order = {}
    if (req.params.id) {
        const ordersURL = `https://api.hubspot.com/crm/v3/objects/${SALESORDER_OBJECTTYPEID}/${req.params.id}?properties=so&properties=name&properties=grand_total&properties=estimated_ship_date`;
        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        }
        try {
            const resp = await axios.get(ordersURL, { headers });
            const data = resp.data;
            if (data) {
                order = data.properties
            }
        } catch (error) {
            console.error(error);
        }
    }
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', order });
})

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post('/update-cobj/:id?', async (req, res) => {
    if (!req.body || req.body === ''){
        res.statusCode(400)
        res.send('Bad Request')
        return
    }

    const salesOrderProps = {
        "so": req.body.so,
        "name": req.body.name,
        "grand_total": req.body.grand_total,
        "estimated_ship_date": req.body.estimated_ship_date,
    }
    
    const update = {
        properties: salesOrderProps
    }

    const updateURL = `https://api.hubapi.com/crm/v3/objects/${SALESORDER_OBJECTTYPEID}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        if (req.params.id) {
            await axios.patch(`${updateURL}/${req.params.id}`, update, { headers } );
        } else {
            await axios.post(updateURL, update, { headers } );
        }
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }
})

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));