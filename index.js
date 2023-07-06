const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function (req, res, next) {
    res.setHeader(
        'Contect-Security-Policy-Report-Only',
        "default-src 'self';font-src fonts.gstatic.com;style-src 'self' fonts.googleapis.com"
    );
    next();
});

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-eu1-5cc45ed6-9314-4e9f-92a4-935464ad4c49';
const TEST_PORTAL_URL = 'https://app-eu1.hubspot.com/contacts/26979144/objects/2-114379508/views/22372295/list';

function logErr(err) {
    console.error("Error message:", err.toJSON().message);
    console.error("Error status:", err.response.status);
    console.error("Error data:", err.response.data);
    console.error("Error request:");
    console.error("  method::", err.toJSON().config.method);
    console.error("  url", err.toJSON().config.url);
    console.error("  data:", err.toJSON().config.data);
}

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get('/', async (req, res) => {

    const getWines = 'https://api.hubspot.com/crm/v3/objects/p_wines?properties=hs_object_id,name,vintage,producer,category,size,price,productcode,comment';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

// * Code for Route 1 goes here
    try {
        const resp = await axios.get(getWines, { headers });
        const data = resp.data.results;

	// res.json(data);
        res.render('homepage', { title: 'Wines | HubSpot APIs', portalUrl: TEST_PORTAL_URL, data });      

    } catch (err) {
        logErr(err);
    }

});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get('/update-cobj', async (req, res) => {

    const productcode = req.query.productcode;
    console.log("Debug: productcode:", productcode);
    const getWine = `https://api.hubapi.com/crm/v3/objects/p_wines/${productcode}?idProperty=productcode&properties=name,vintage,producer,category,size,price,productcode,comment`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const title = 'Update Custom Object Form | Integrating With HubSpot I Practicum';

// * Code for Route 2 goes here
    if (typeof productcode === "undefined" ) {
        res.render('create', { title: title });
    } else {

        try {
            const response = await axios.get(getWine, { headers });
            const data = response.data;
            console.log("Debug: data:", data);

            res.render('updates', { title: title, data });
        
        } catch(err) {
            if ( err.response && err.response.status === 404 ) {
	        // record doeas not exist
                res.render('updates', { title: title });
            } else {
                logErr(err);
            }
        }
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
app.post('/update-cobj', async (req, res) => {

    const productcode = req.body.productcode;
    const getUpdateWine = `https://api.hubapi.com/crm/v3/objects/p_wines/${productcode}?idProperty=productcode`;
    const createWine = `https://api.hubapi.com/crm/v3/objects/p_wines`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const data = { properties: req.body };

    console.log("Debug: data:", data);

    // remove empty properties
    // Object.keys(data.properties).forEach(
    //    (key) => (data.properties[key] === null || data.properties[key] === '') && delete data.properties[key]); 

    console.log("Debug: data:", data);

// * Code for Route 3 goes here
    // api call to check if wine exists based on productcode
    // then either create or update

    console.log("Debug: productcode:", productcode);

    try {
        const response = await axios.get(getUpdateWine, { headers });

        if ( response.status === 200 ) {
	    // record exists => update
            await axios.patch(getUpdateWine, data, { headers } );
	}

    } catch(err) {
        if ( err.response && err.response.status === 404 ) {
	    // record doeas not exist => create
            try {
                await axios.post(createWine, data, { headers } );

            } catch(err) {
                logErr(err);
            }

        } else {
            logErr(err);
        }
    }

    res.redirect('/');
    //res.redirect('back');

});

// ROUTE 4 - Delete your custom object data. Once executed, redirect the user to the homepage.
app.get('/delete-cobj', async (req, res) => {

    const hs_object_id = req.query.hs_object_id;
    const deleteWine = `https://api.hubapi.com/crm/v3/objects/p_wines/${hs_object_id}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.delete(deleteWine, { headers });

    } catch(err) {
        logErr(err);
    }

    res.redirect('/');
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
