require('dotenv').config();
const express = require('express');

const axios = require('axios');

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
// ضع التوكن بتاع برايفيت اب هنا محليا فقط
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// ✅ ROUTE 1 — Homepage showing pets list
app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/2-194124358?properties=name,type,age`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(url, { headers });
        const pets = resp.data.results;
        res.render('homepage', {
            title: "Pets List | HubSpot Practicum",
            pets
        });
    } catch (error) {
        console.error(error);
        res.send("Error fetching data");
    }
});

// ✅ ROUTE 2 — Show Form
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: "Update Custom Object Form | Integrating With HubSpot I Practicum" });
});

// ✅ ROUTE 3 — Handle Form Submission
app.post('/update-cobj', async (req, res) => {
    const data = {
        properties: {
            name: req.body.name,
            type: req.body.type,
            age: req.body.age
        }
    };

    const url = `https://api.hubapi.com/crm/v3/objects/2-194124358`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(url, data, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.send("Error creating record");
    }
});

// Start server
app.listen(3000, () => console.log('Listening on http://localhost:3000'));