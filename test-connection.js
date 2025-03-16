require('dotenv').config();
const axios = require('axios');

async function testConnection() {
  try {
    console.log('Testing HubSpot API connection...');
    const response = await axios.get(
      'https://api.hubapi.com/crm/v3/objects/contacts?limit=1',
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Connection successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Connection failed:');
    console.error(error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testConnection();