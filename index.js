const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const PRIVATE_APP_ACCESS = 'pat-na1-79f9510a-9f0a-47be-b8a5-e6f7d8d7bcec';


app.get('/', async (req, res) => {

  const cars =  'https://api.hubapi.com/crm/v3/objects/2-29614249?properties=car_name,make,model';  
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  }  

  try {
    const resp = await axios.get(cars, { headers });
    const data = resp.data.results;
    res.render('cars', { title: 'Cars HubSpot API', data });
  } catch (error) {
    console.error(error);
  }
});


app.get('/add', async (req, res) => {

    try {
        res.render('add', {});
        
    } catch(err) {
        console.error(err);
    }
});

app.post('/add', async (req, res) => {

    console.log(req.body); 
  
    try {
      const { car_name, make, model } = req.body;
  
      await axios.post(
        'https://api.hubapi.com/crm/v3/objects/2-29614249',
        { properties: { car_name, make, model } },
        { headers: { Authorization: `Bearer ${PRIVATE_APP_ACCESS}` } }
      )
      .then(response => {
        console.log('Registro criado com sucesso:', response.data);
        res.redirect('/');
      })
      .catch(error => {
        console.error('Erro ao criar registro:', error.response.data);
        res.status(500).send('Erro ao criar registro do objeto personalizado');
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao criar registro do objeto personalizado');
    }
  });

app.listen(3000, () => console.log('Servidor rodando na porta http://localhost:3000'));
