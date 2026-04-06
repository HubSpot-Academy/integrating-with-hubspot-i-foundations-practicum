const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
// * Code for Route 1 goes here
app.get('/', async (req, res) => {
    // Get Custom Object Data
    const memberships = 'https://api.hubspot.com/crm/v3/objects/2-227693084?properties=name,membership_type,start_date,end_date&associations=contacts';
    const headers = {
        Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(memberships, { headers });
        const data = resp.data.results;

        // get associated contact info and update the data.
        if(data.length > 0) {
            for (let i = 0; i < data.length; i++) {

                const contactId = data[i]?.associations?.contacts?.results?.[0]?.id;

                if (contactId) {
                    try {
                        const contactResp = await axios.get(
                            `https://api.hubspot.com/crm/v3/objects/contacts/${contactId}?properties=firstname,lastname`,
                            { headers }
                        );
                        const contact = contactResp.data.properties;
                        const contactName = `${contact.firstname || ''} ${contact.lastname || ''}`.trim();
                        console.log(contactName);
                        // ✅ attach to existing object
                        data[i].contactName = contactName || '-';
                    } catch (err) {
                        data[i].contactName = '-';
                    }
                } else {
                    data[i].contactName = '-';
                }
            }
        }

        res.render('homepage', { title: 'Home Page', data });      
    } catch (error) {
        console.error(error);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
// * Code for Route 2 goes here
app.get('/update-cobj', async (req, res) => {
    // Get Custom Object Property (Memebership Type) Data through the API to populate the dropdown in the form
    const membership_types = 'https://api.hubspot.com/crm/v3/properties/2-227693084/membership_type';
    const headers = {
        Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(membership_types, { headers });
        const membershipOptions = resp?.data?.options;
        // get contacts (Not for the real world example when contact count is bigger)
        const get_contacts = 'https://api.hubspot.com/crm/v3/objects/0-1?properties=hs_object_id,firstname,lastname';
        const response = await axios.get(get_contacts, { headers });
        const contacts = response?.data?.results;
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum.', membershipOptions, contacts });    
    } catch (error) {
        console.error(error);
    } 
});


// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
    // Create Custom Object Record through the API using the form data
    const createMembership = {
        properties: {
            "name": req.body.name,
            "membership_type": req.body.membership_type,
            "start_date": req.body.start_date,
            "end_date": req.body.end_date
        }
    }

    const membership = 'https://api.hubspot.com/crm/v3/objects/2-227693084';
    const headers = {
        Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        const response =await axios.post(membership, createMembership, { headers } );
        const membershipId = response.data.id;
        if(membershipId){
        await axios.put(
                `https://api.hubspot.com/crm/v3/objects/2-227693084/${membershipId}/associations/0-1/${req.body.contact_id}/${process.env.associationTypeId}`,
                {},
                { headers }
            );
        }
        res.redirect('/');
    } catch(err) {
        console.error(err);
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