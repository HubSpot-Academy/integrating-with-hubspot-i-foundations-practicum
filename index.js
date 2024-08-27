const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = "";

// * Code for Route 1 goes here
app.get('/', async (req, res) => {

    const cars = 'https://api.hubspot.com/crm/v3/objects/cars?properties=car_name,car_price,car_color';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try {
        const resp = await axios.get(cars, { headers });
        const data = resp.data.results;
        res.render('cars', { title: 'Cars', data });
    } catch (error) {
        console.error(error);
    }

});

// * Code for Route 2 goes here
app.get('/update-cobj', async (req, res) => {
    res.render('update', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {
    const update = {
        properties: {
            "car_name": req.body.car_name,
            "car_color": req.body.car_color,
            "car_price": req.body.car_price
        }
    }

    const updateCar = 'https://api.hubspot.com/crm/v3/objects/cars';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(updateCar, update, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));