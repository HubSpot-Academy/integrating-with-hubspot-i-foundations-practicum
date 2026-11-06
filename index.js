require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const OBJECT_TYPE = process.env.OBJECT_TYPE;

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

// rotas entram aqui

app.listen(3000, () => console.log('Listening on http://localhost:3000'));