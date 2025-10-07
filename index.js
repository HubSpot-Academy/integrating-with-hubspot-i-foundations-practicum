const express = require('express');
const axios = require('axios');
const app = express();
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'YOUR_PRIVATE_APP_ACCESS_TOKEN';

app.get('/', async (req, res) => {
    const object = 'https://api.hubapi.com/crm/v3/objects/p_redes_sociales?properties=nombre_red,anio_creacion,ceo';

    const options={
         headers: {
        'Authorization': `Bearer ${PRIVATE_APP_ACCESS}`,
        //'Content-Type': 'application/json'
        }
    };
    try {
        const resp = await axios.get(object, options);
        const data = resp.data.results;
        //res.json(data);
        res.render('homepage', { title: 'Custom Cbject Form | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});
app.post('/update-cobj', async (req, res) => {
    const newc = {
        properties: {
            "nombre_red": req.body.name
            ,"anio_creacion": req.body.year
            ,"ceo": req.body.ceo
        }
    }

    const id = req.body.create_objid;
    const newContact = `https://api.hubapi.com/crm/v3/objects/p_redes_sociales?properties/nombre_red,anio_creacion,ceo`;
    const options={
         headers: {
        'Authorization': `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
        }
    };

    try { 
        await axios.post(newContact, newc, options);
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }

});
app.get('/update-cobj', (req, res) => {
    res.render('updates', { 
        title: 'Update Custom Object Form | HubSpot APIs',
     });
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));