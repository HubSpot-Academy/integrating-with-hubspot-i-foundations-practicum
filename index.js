const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT.
// Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-eu1-c0988919-3456-4c80-9119-a19cf26bd11d';

axios.defaults.headers.common['Authorization'] = `Bearer ${PRIVATE_APP_ACCESS}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BASE_SCOOTERS = 'https://api.hubapi.com/crm/v3/objects/p_scooters';
const SCOOTER_PROPERTIES = '?properties=name,model,top_speed'

app.get('/', async (req, res) => {
    const scooters = `${BASE_SCOOTERS}${SCOOTER_PROPERTIES}`;
    try {
        const resp = await axios.get(scooters);
        res.render('welcome', {
            title: 'Integrating With HubSpot I Practicum',
            scooters: resp.data.results
        });
    } catch (e) {
        console.error(e);
        res.render('error');
    }
})

app.get('/update-cobj/:id?', async (req, res) => {
    try {
        let data = {
            title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
            edit: false
        }

        if (req.params.id) {
            const scooter = `${BASE_SCOOTERS}/${req.params.id}${SCOOTER_PROPERTIES}`;
            const resp = await axios.get(scooter);
            data.scooter = resp.data;
            data.edit = true;
        }
        res.render('updates', data);
    } catch (e) {
        console.error(e);
        res.render('error');
    }
})

app.post('/update-cobj/:id?', async (req, res) => {
    try {
        let data = {
            properties: req.body
        };

        if (req.params.id) { // update
            const patch = `${BASE_SCOOTERS}/${req.params.id}`;
            await axios.patch(patch, data,)
        } else { // create
            await axios.post(BASE_SCOOTERS, data);
        }

        res.redirect('/');
    } catch (e) {
        console.error(e);
        res.render('error');
    }   
})

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));