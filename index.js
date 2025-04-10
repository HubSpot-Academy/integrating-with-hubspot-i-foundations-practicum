// Load environment variables
require('dotenv').config();

// Import required packages
const express = require('express');
const axios = require('axios');
const path = require('path');

// Initialize Express
const app = express();

// Set up middleware
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Get environment variables
const PRIVATE_APP_TOKEN = process.env.PRIVATE_APP_TOKEN;
const OBJECT_TYPE = "2-43176702"; // Replace with your actual object type

// API base URL
const API_BASE_URL = 'https://api.hubapi.com';

// Set up headers for API requests
const headers = {
 'Authorization': `Bearer ${PRIVATE_APP_TOKEN}`,
 'Content-Type': 'application/json'
};

// Home page route - List all guitars
app.get('/', async (req, res) => {
 try {
   // Make API call to get all guitar records
   const response = await axios.get(
     `${API_BASE_URL}/crm/v3/objects/${OBJECT_TYPE}?properties=name,year,description`, 
     { headers }
   );
   
   // Render homepage with guitar data
   res.render('homepage', {
     guitars: response.data.results
   });
 } catch (error) {
   console.error('Error fetching guitar data:', error.response ? error.response.data : error.message);
   res.status(500).send('Error fetching guitar data. Check console for details.');
 }
});

// Form page route - Display the form to add a new guitar
app.get('/update-cobj', (req, res) => {
 res.render('updates', {
   title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
 });
});

// Form submission route - Process the form data
app.post('/update-cobj', async (req, res) => {
 try {
   // Get form data
   const { name, year, description } = req.body;
   
   // Prepare data for API call
   const data = {
     properties: {
       name,
       year,
       description
     }
   };
   
   // Make API call to create new guitar
   await axios.post(
     `${API_BASE_URL}/crm/v3/objects/${OBJECT_TYPE}`,
     data,
     { headers }
   );
   
   // Redirect to homepage after successful creation
   res.redirect('/');
 } catch (error) {
   console.error('Error creating guitar:', error.response ? error.response.data : error.message);
   res.status(500).send('Error creating guitar. Check console for details.');
 }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
 console.log(`Server running at http://localhost:${PORT}`);
});