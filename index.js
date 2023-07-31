const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// TODO: Define your custom object properties here
const CUSTOM_PROPERTIES = ['name', 'address', 'price'];

// TODO: Implement your custom object data handling logic here
const customObjects = [];

// Route 1: Homepage
app.get('/', (req, res) => {
  res.render('homepage', { title: 'Homepage | Integrating With HubSpot I Practicum', customObjects });
});

// Route 2: Form to create or update custom objects
app.get('/update-cobj', (req, res) => {
  res.render('form', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// Route 3: Create or update custom objects
app.post('/update-cobj', (req, res) => {
  const newCustomObject = {};
  for (const prop of CUSTOM_PROPERTIES) {
    newCustomObject[prop] = req.body[prop];
  }
  customObjects.push(newCustomObject);
  res.redirect('/');
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
