require('dotenv').config();
const axios = require('axios');

const customObjectDetails = {
  name: 'pet',
  labels: {
    singular: 'Pet',
    plural: 'Pets'
  },
  primaryDisplayProperty: 'name',
  properties: [
    {
      name: 'name',
      label: 'Name',
      type: 'string',
      fieldType: 'text',
      groupName: 'objectInformation',
      displayOrder: 1,
      isRequired: true
    },
    {
      name: 'species',
      label: 'Species',
      type: 'string',
      fieldType: 'text',
      groupName: 'objectInformation',
      displayOrder: 2
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      fieldType: 'number',
      groupName: 'objectInformation',
      displayOrder: 3
    }
  ],
  associatedObjects: ['CONTACT']
};

async function createCustomObject() {
  try {
    const response = await axios.post(
      'https://api.hubapi.com/crm/v3/schemas',
      customObjectDetails,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Custom object created successfully!');
    console.log('Object ID:', response.data.id);
    console.log('Full response:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('Error creating custom object:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

createCustomObject();