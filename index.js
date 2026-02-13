require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;
const CUSTOM_OBJECT = '2-56736078';
const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
}

// TODO: ROUTE 1 - Homepage route to display custom object data in a table format..

app.get('/', async (req, res) => {
    axios.get(`https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT}?properties=name,company,model_year,car_type`, { 
        headers,
        // params: { 
        //     properties: ['name','company','model_year','car_type'] 
        // } 
    }
)
.then(response => {
  console.log("30",JSON.stringify(response.data.results, null, 2));
  res.render('homepage', {
    title: 'Custom Objects Table',
    data: response.data.results
  });
})
.catch(error => {
        console.error('Error fetching custom object data:', error);
        res.send("Error fetching data");
    });
  });


// TODO: ROUTE 2 - Show Form Page route to render the form for creating or updating custom object data.

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form' });
});

// TODO: ROUTE 3 - Submit Form Data route to handle form submissions for creating or updating custom object data.

app.post('/update-cobj', async (req, res) => {
    const { name, company, model_year, car_type } = req.body;
    axios.post(`https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT}`, 
    {
        properties: {
            name,
            company,
            model_year,
            car_type
        }  
    }, { headers })
    .then(response => {
        res.redirect('/');
    })
    .catch(error => {
        console.error('Error creating/updating custom object:', error);
        res.send("Error submitting data");
    });
});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));