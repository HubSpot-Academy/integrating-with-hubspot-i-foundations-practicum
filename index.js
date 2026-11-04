const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const PRIVATE_APP_ACCESS = 'pat-na1-ca557874-74af-4b3d-8b29-f4f324d648af';

app.get('/pets', async (req, res) => {
    const pets = 'https://api.hubspot.com/crm/v3/objects/2-72310222';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(pets, { headers });
        const data = resp.data.results;
        res.render('pets', { title: 'Pets | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});


app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "species": req.body.newVal
        }
    }

    const email = req.query.name;
    const updatePets = `https://api.hubapi.com/crm/v3/objects/2-72310222/${name}?idProperty=name`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updatePets, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});



// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
