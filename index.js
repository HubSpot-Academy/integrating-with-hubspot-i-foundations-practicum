const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-eu1-32927214-9c47-49a4-83bc-a732d39d094d';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', (req, res) => {
    axios.get('https://api.hubapi.com/crm/v3/objects/personnages?properties=nom,age,biographie', {
        headers: {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        const objetsPersonnalises = response.data.results;
    
        res.render('homepage', {
            pageTitle: 'Accueil | Integrating With HubSpot I Practicum',
            objetsPersonnalises,
        });
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des objets personnalisés:', error);
        res.redirect('/');
    });    
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', { pageTitle: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', (req, res) => {
    const nom = req.body.nom;
    const age = req.body.age;
    const biographie = req.body.biographie;

    const nouvelObjetPersonnalise = {
        properties: {
            nom,
            age,
            biographie,
        }
    };

    axios.post('https://api.hubapi.com/crm/v3/objects/personnages', nouvelObjetPersonnalise, {
        headers: {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log('Objet personnalisé créé avec succès:', response.data);

            res.redirect('/');
        })
        .catch(error => {
            console.error('Erreur lors de la création de l\'objet personnalisé:', error);

            res.redirect('/');
        });
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