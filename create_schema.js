const axios = require('axios');
(async () => {
  const token = '';
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const schemaPayload = {
    name: 'hvac_truck',
    labels: { singular: 'HVAC Truck', plural: 'HVAC Trucks' },
    primaryDisplayProperty: 'name',
    properties: [
      { name: 'name', label: 'Name', type: 'string', fieldType: 'text' },
      { name: 'vehicle_year', label: 'Vehicle Year', type: 'string', fieldType: 'text' },
      { name: 'vehicle_make', label: 'Vehicle Make', type: 'string', fieldType: 'text' },
      { name: 'vehicle_model', label: 'Vehicle Model', type: 'string', fieldType: 'text' },
      { name: 'price', label: 'Price', type: 'number', fieldType: 'number' }
    ],
    associatedObjects: ['CONTACT']
  };

  try {
    const resp = await axios.post('https://api.hubapi.com/crm/v3/schemas', schemaPayload, { headers });
    console.log('Schema create response:');
    console.log(JSON.stringify(resp.data, null, 2));
  } catch (err) {
    console.error('Error creating schema:');
    console.error(err.response ? err.response.data : err.message);
    process.exit(1);
  }
})();
