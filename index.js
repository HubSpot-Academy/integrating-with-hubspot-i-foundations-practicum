require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;
const HUBSPOT_API_URL = 'https://api.hubapi.com/crm/v3/objects';  
const CUSTOM_OBJECT_ID = '2-34566618'; 

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const hubspotAxios = axios.create({
    headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}` 
    }
});

app.get('/', async (req, res) => {
    try {
        const response = await hubspotAxios.get(`${HUBSPOT_API_URL}/${CUSTOM_OBJECT_ID}`, {
            params: {
                properties: 'name,species,age'  
            }
        });
        const customObjects = response.data.results;
        res.render('homepage', { customObjects, title: 'Custom Object Records' });
    } catch (error) {
        console.error('Error fetching custom objects:', error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

app.post('/update-cobj', async (req, res) => {
    const { name, species, age } = req.body; 

    const data = {
        properties: {
            name,
            species,
            age
        }
    };

    try {
        await hubspotAxios.post(`${HUBSPOT_API_URL}/${CUSTOM_OBJECT_ID}`, data);
        res.redirect('/');
    } catch (error) {
        console.error('Error creating custom object:', error.response ? error.response.data : error.message);
        res.status(500).send('Internal Server Error');
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
