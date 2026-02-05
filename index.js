const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        // Find the HVAC Trucks custom object schema by label
        const schemasUrl = 'https://api.hubapi.com/crm/v3/schemas';
        const schemasResp = await axios.get(schemasUrl, { headers });
        const schemas = schemasResp.data.results || [];
        const hvacSchema = schemas.find(s => s.labels && s.labels.plural === 'HVAC Trucks');

        if (!hvacSchema) {
            return res.send("HVAC Trucks schema not found. Visit /create-schema to create it and add sample records.");
        }

        const objectsUrl = `https://api.hubapi.com/crm/v3/objects/${hvacSchema.name}`;
        const resp = await axios.get(objectsUrl, { headers });
        const data = resp.data.results || [];
        res.render('hvactrucks', { title: 'HVAC Trucks For Sale', data });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Error fetching HVAC Trucks');
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/truck-form', (req, res) => {
    res.render('truck_form', { title: 'Add or Update HVAC Truck' });
});

// Route to render the updates template
app.get('/updates', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/truck', async (req, res) => {
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        // Find HVAC Trucks schema name
        const schemasUrl = 'https://api.hubapi.com/crm/v3/schemas';
        const schemasResp = await axios.get(schemasUrl, { headers });
        const schemas = schemasResp.data.results || [];
        const hvacSchema = schemas.find(s => s.labels && s.labels.plural === 'HVAC Trucks');

        if (!hvacSchema) {
            return res.send("HVAC Trucks schema not found. Create it at /create-schema first.");
        }

        const createUrl = `https://api.hubapi.com/crm/v3/objects/${hvacSchema.name}`;
        const body = {
            properties: {
                name: req.body.name,
                vehicle_year: req.body.vehicle_year,
                vehicle_make: req.body.vehicle_make,
                vehicle_model: req.body.vehicle_model,
                price: req.body.price
            }
        };

        await axios.post(createUrl, body, { headers });
        res.redirect('homepage');
    } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        res.status(500).send('Error creating/updating HVAC Truck');
    }
});

// Route to create the custom object schema and add sample records
app.get('/create-schema', async (req, res) => {
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const schemaPayload = {
        name: 'hvac_truck',
        labels: {
            singular: 'HVAC Truck',
            plural: 'HVAC Trucks'
        },
        primaryDisplayProperty: 'name',
        properties: [
            { name: 'name', label: 'Name', type: 'string', fieldType: 'text' },
            { name: 'vehicle_year', label: 'Vehicle Year', type: 'string', fieldType: 'text' },
            { name: 'vehicle_make', label: 'Vehicle Make', type: 'string', fieldType: 'text' },
            { name: 'vehicle_model', label: 'Vehicle Model', type: 'string', fieldType: 'text' },
            { name: 'price', label: 'Price', type: 'number', fieldType: 'number' }
        ],
        associatedObjects: ['CONTACT']
    };

    try {
        // Create schema
        await axios.post('https://api.hubapi.com/crm/v3/schemas', schemaPayload, { headers });

        // Add sample records
        const sample = [
            { name: 'Mercedes-Benz Sprinter', vehicle_year: '2020', vehicle_make: 'Mercedes-Benz', vehicle_model: 'Sprinter', price: 45000 },
            { name: 'Ford Transit', vehicle_year: '2019', vehicle_make: 'Ford', vehicle_model: 'Transit', price: 38000 },
            { name: 'Dodge Ram ProMaster', vehicle_year: '2021', vehicle_make: 'Dodge', vehicle_model: 'Ram ProMaster', price: 42000 }
        ];

        // Use the schema name to create objects
        const createUrl = `https://api.hubapi.com/crm/v3/objects/hvac_truck`;

        for (const item of sample) {
            const body = { properties: {
                name: item.name,
                vehicle_year: item.vehicle_year,
                vehicle_make: item.vehicle_make,
                vehicle_model: item.vehicle_model,
                price: item.price
            }};
            try {
                await axios.post(createUrl, body, { headers });
            } catch(e) {
                // Log and continue with next record
                console.error('Error creating sample record:', e.response ? e.response.data : e.message);
            }
        }

        res.send('HVAC Trucks schema created and sample records added. Visit / to view.');
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Error creating schema or sample records');
    }
});

// Route to import HVAC Trucks from CSV file
app.get('/import-csv', async (req, res) => {
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        // Find HVAC Trucks schema name
        const schemasUrl = 'https://api.hubapi.com/crm/v3/schemas';
        const schemasResp = await axios.get(schemasUrl, { headers });
        const schemas = schemasResp.data.results || [];
        const hvacSchema = schemas.find(s => s.labels && s.labels.plural === 'HVAC Trucks');

        if (!hvacSchema) {
            return res.status(404).send('HVAC Trucks schema not found. Visit /create-schema first.');
        }

        const createUrl = `https://api.hubapi.com/crm/v3/objects/${hvacSchema.name}`;
        const results = [];
        const errors = [];

        // Read and parse CSV file
        fs.createReadStream('./hvac_trucks.csv')
            .pipe(csv())
            .on('data', (row) => {
                results.push(row);
            })
            .on('end', async () => {
                console.log(`CSV parsed. Found ${results.length} records.`);
                
                // Import each record
                for (const row of results) {
                    const body = {
                        properties: {
                            name: row.name,
                            vehicle_year: row.vehicle_year,
                            vehicle_make: row.vehicle_make,
                            vehicle_model: row.vehicle_model,
                            price: row.price
                        }
                    };

                    try {
                        await axios.post(createUrl, body, { headers });
                        console.log(`Created: ${row.name}`);
                    } catch (err) {
                        const errorMsg = err.response ? JSON.stringify(err.response.data) : err.message;
                        console.error(`Failed to create ${row.name}:`, errorMsg);
                        errors.push({ record: row.name, error: errorMsg });
                    }
                }

                // Send response
                if (errors.length === 0) {
                    res.send(`Successfully imported ${results.length} HVAC Trucks from CSV. Visit /homepage to view.`);
                } else {
                    res.send(`Imported ${results.length - errors.length} of ${results.length} records. ${errors.length} errors occurred. Check console for details.`);
                }
            })
            .on('error', (error) => {
                console.error('Error reading CSV:', error);
                res.status(500).send('Error reading CSV file. Make sure hvac_trucks.csv exists in the project root.');
            });

    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Error importing from CSV');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));

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


