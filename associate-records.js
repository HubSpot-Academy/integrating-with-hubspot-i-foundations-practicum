require('dotenv').config();
const axios = require('axios');

const customObjectType = 'p_pet'; 
const customObjectId = 25183551600;
const contactId = 105888335200;
const associationType = 'associated';

async function associateRecords() {
  try {
    const response = await axios.put(
      `https://api.hubapi.com/crm/v3/objects/${customObjectType}/${customObjectId}/associations/contacts/${contactId}/${associationType}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Association created successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error creating association:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

associateRecords();