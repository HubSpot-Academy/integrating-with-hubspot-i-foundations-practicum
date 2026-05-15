const axios = require('axios');
require('dotenv').config();

const token = process.env.PRIVATE_APP_ACCESS_TOKEN;

if (!token) {
  console.error('Missing PRIVATE_APP_ACCESS_TOKEN in .env');
  process.exit(1);
}

const hubspot = axios.create({
  baseURL: 'https://api.hubapi.com',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

async function createCustomObject() {
  try {
    const schema = {
      name: 'games',
      labels: {
        singular: 'Game',
        plural: 'Games',
      },
      primaryDisplayProperty: 'name',
      requiredProperties: ['name'],
      searchableProperties: ['name', 'publisher'],
      properties: [
        {
          name: 'name',
          label: 'Name',
          type: 'string',
          fieldType: 'text',
          groupName: 'game_information',
        },
        {
          name: 'publisher',
          label: 'Publisher',
          type: 'string',
          fieldType: 'text',
          groupName: 'game_information',
        },
        {
          name: 'price',
          label: 'Price',
          type: 'number',
          fieldType: 'number',
          groupName: 'game_information',
        },
      ],
      associatedObjects: ['CONTACT'],
    };

    const response = await hubspot.post('/crm/v3/schemas', schema);

    console.log('Custom object created successfully!');
    console.log('Object type ID:', response.data.objectTypeId);
    console.log('Fully qualified name:', response.data.fullyQualifiedName);
    console.log('');
    console.log('Copy this into your .env:');
    console.log(`CUSTOM_OBJECT_TYPE_ID=${response.data.objectTypeId}`);
  } catch (error) {
    console.error('Error creating custom object:');
    console.error(error.response?.data || error.message);
  }
}

createCustomObject();