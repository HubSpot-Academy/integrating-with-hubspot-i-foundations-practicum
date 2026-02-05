const axios = require('axios');
(async () => {
  const token = '';
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const resp = await axios.get('https://api.hubapi.com/crm/v3/schemas', { headers });
    const schemas = resp.data.results || [];
    const hvac = schemas.find(s => s.labels && s.labels.plural === 'HVAC Trucks');
    if (!hvac) {
      console.log('HVAC Trucks schema not found');
      process.exit(0);
    }
    console.log(JSON.stringify(hvac, null, 2));
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    process.exit(1);
  }
})();
