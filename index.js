const express = require('express');
const axios = require('axios');

const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = "";

app.get('/Laptops', async (req, res) => {

    const contacts = 'https://api.hubspot.com/crm/v3/objects/Laptops';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try {
        const resp = await axios.get(Laptops, { headers });
        const data = resp.data.results;
        res.render('Laptops', { title: 'Laptops | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }

});

app.get('/update', async (req, res) => {
    // http://localhost:3000/update?Name=HP
    const Name = req.query.name;

    const getLaptop = `https://api.hubapi.com/crm/v3/objects/Laptops/$Name?idProperty=Name&properties=Name,Price`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(getLaptop, { headers });
        const data = response.data;

        // res.json(data);
        res.render('update', {LaptopName: data.properties.Name, Price: data.properties.Price});
        
    } catch(err) {
        console.error(err);
    }
});

app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "Price": req.body.newVal
        }
    }

    const Name = req.query.Name;
    const updateLaptop = `https://api.hubapi.com/crm/v3/objects/Laptops`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateLaptop, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});


app.listen(3000, () => console.log('Listening on http://localhost:3000'));
