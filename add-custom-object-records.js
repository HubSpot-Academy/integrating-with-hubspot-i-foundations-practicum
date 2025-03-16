require('dotenv').config();
const axios = require('axios');


const objectType = 'p_pet'; 

// Sample data for creating records
const records = [
  {
    properties: {
      name: 'Fluffy',
      species: 'Cat',
      age: 3
    }
  },
  {
    properties: {
      name: 'Buddy',
      species: 'Dog',
      age: 5
    }
  },
  {
    properties: {
      name: 'Nemo',
      species: 'Fish',
      age: 1
    }
  }
];

async function createRecords() {
  try {
    // Records one by one
    for (const record of records) {
      const response = await axios.post(
        `https://api.hubapi.com/crm/v3/objects/${objectType}`,
        record,
        {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(`Record created: ${response.data.properties.name}`);
      console.log('Record ID:', response.data.id);
    }
    
    console.log('All records created successfully!');
  } catch (error) {
    console.error('Error creating records:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

createRecords();