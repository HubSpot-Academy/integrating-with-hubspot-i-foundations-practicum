const express = require('express');
const axios = require('axios');
const app = express();
const path = require('path');

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', path.join(__dirname, 'views'));



const private_app_token = ''

app.get('/homepage-projects-jp', async (req, res) => {
  const projects-jpEndpoint = 'https://api.hubspot.com/crm/v3/objects/projects-jp?properties=project_name,project_description,project_notes';
  const headers = {
    Authorization: `Bearer ${private_app_token}`,
    'Content-Type': 'application/json'
  }
  const params = {
    properties: ['project_name', 'project_description', 'project_notes'] // Add the property names you want here
  }
  try {
    const response = await axios.get(projects-jpEndpoint, { headers, params });
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    const projects-jp = response.data.results;
    console.log('Project data:', JSON.stringify(project, null, 2));
    res.render('homepage', { project-jp: projects-jp });
  } catch (error) {
    console.error(error);
  }
})

app.get('/update-projects-jp', (req, res) => {
  try {
    res.render('updates', { pageTitle: 'Update Custom Object Form | Integrating With HubSpot I Practicum' }); // Render the updates.pug template
  } catch (error) {
    console.error(error);
  }
});


app.post('/update-projects-jp', async (req, res) => {
  const projects-jpEndpoint = 'https://api.hubspot.com/crm/v3/objects/projects-jp';
  const headers = {
    Authorization: `Bearer ${private_app_token}`,
    'Content-Type': 'application/json'
  }
  const data = {
    properties: {
      project_name: req.body.project_name,
      project_description: req.body.project_description,
      project_notes: req.body.project_notes
    }
  }
  try {
    const response = await axios.post(projects-jpEndpoint, data, { headers });
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    res.redirect('/homepage-projects-jp'); // Redirects to home page
  } catch (error) {
    console.error(error);
  }
});


app.listen(3000, () => console.log('Server running on port 3000')); 
