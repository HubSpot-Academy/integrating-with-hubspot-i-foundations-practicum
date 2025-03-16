async function createRecords() {
    try {
      console.log('Starting to create records...');
      console.log(`Object type: ${objectType}`);
      console.log(`Using token: ${process.env.HUBSPOT_TOKEN ? 'Token exists' : 'Token missing'}`);
      
      // Create records one by one
      for (const record of records) {
        console.log(`Attempting to create record: ${record.properties.name}`);
        try {
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
        } catch (recordError) {
          console.error(`Failed to create record ${record.properties.name}:`);
          console.error(recordError.message);
          if (recordError.response) {
            console.error('Status:', recordError.response.status);
            console.error('Data:', JSON.stringify(recordError.response.data, null, 2));
          }
        }
      }
      
      console.log('Finished processing all records');
    } catch (error) {
      console.error('Error in main function:');
      console.error(error.message);
    }
  }