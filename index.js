const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');

const PORT = 3000;


/* HOMEPAGE */

app.get('/', async (req, res) => {

try {

const response = await axios.get(
'https://api.hubapi.com/crm/v3/objects/2-229368385',
{
headers: {
Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS_TOKEN}`,
'Content-Type': 'application/json'
},
params: {
properties: 'name,author,genre'
}
}
);

res.render('homepage', {
records: response.data.results
});

} catch (err) {

console.log(err.response.data);

res.send('Error');

}

});


/* FORM PAGE */

app.get('/update-cobj', (req, res) => {

res.render('updates');

});


/* CREATE RECORD */

app.post('/update-cobj', async (req, res) => {

const { name, author, genre } = req.body;

try {

await axios.post(
'https://api.hubapi.com/crm/v3/objects/2-229368385',
{
properties: {
name,
author,
genre
}
},
{
headers: {
Authorization: `Bearer ${process.env.PRIVATE_APP_ACCESS_TOKEN}`,
'Content-Type': 'application/json'
}
}
);

res.redirect('/');

} catch (err) {

console.log(err.response.data);

res.send('Error creating record');

}

});


app.listen(PORT, () => {

console.log(`Running on ${PORT}`);

});