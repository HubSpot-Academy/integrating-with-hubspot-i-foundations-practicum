const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');


app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = 'pat-na1-3e5e4fde-a7c7-4855-944c-5c271f730920';
const baseUrl = 'https://api.hubapi.com';
const customObjectEndpoint = '/crm/v3/objects/2-17491631';

app.get('/', async (req, res) => {


    try {

        const headers = {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            'Content-Type': 'application/json'
        }
    

        const resp = await axios.get(`${baseUrl}${customObjectEndpoint}`, { headers 
        });

        const customObjects  = resp.data.results;
        console.log('hello world2 ' + JSON.stringify(customObjects));
        res.render('homepage', { customObjects });
        console.log('app.get begins' + req)

    } catch (error) {
        console.error(error);
        res.render('homepage', { customObjects: [] });
    }



})

app.get('/update-cobj', (req, res) => {

    res.render('updates', { pageTitle: 'Update Custom Object Form | Integrating With HubSpot I Practicum' }); 
});


// * Code for Route 3 goes here
app.post('/update-cobj', async (req, res) => {

    const formData = req.body;
    console.log('formData :'  + JSON.stringify(formData))

    const customObjectPayload = {
        
            "properties": {
              "partner_name": formData.partner_name,
              "partner_type": formData.partner_type,
              "account_number": formData.account_number
            }
        }
    //Post the data received from the form to create the custom object
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    
    try { 
        const result = await axios.post(`${baseUrl}${customObjectEndpoint}`, customObjectPayload, 
            { headers }
        );
        console.log('result: ' + result)

        //then redirect
        res.redirect('/');
    } catch(err) {
        console.error(err);
        res.redirect('/update-cobj'); // Handle error by redirecting back to the form

    }


})

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));