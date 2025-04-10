// Load the dotenv package
require('dotenv').config();

// Log what's in the environment
console.log('Environment variables loaded:');
console.log('PRIVATE_APP_TOKEN exists:', !!process.env.PRIVATE_APP_TOKEN);
if (process.env.PRIVATE_APP_TOKEN) {
  // Only show the first few characters for security
  const firstFew = process.env.PRIVATE_APP_TOKEN.substring(0, 5);
  console.log('First few characters of token:', firstFew + '...');
}
console.log('OBJECT_TYPE:', process.env.OBJECT_TYPE || 'NOT FOUND');

// Check if dotenv is correctly configured
console.log('\nChecking dotenv configuration:');
const path = require('path');
const fs = require('fs');
const envPath = path.resolve(process.cwd(), '.env');
console.log('.env file should be at:', envPath);
console.log('.env file exists:', fs.existsSync(envPath));

// If it exists, show the first line (without revealing the full token)
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const firstLine = envContent.split('\n')[0];
  if (firstLine.startsWith('PRIVATE_APP_TOKEN=')) {
    console.log('First line starts correctly with PRIVATE_APP_TOKEN=');
    console.log('First few characters after equals:', firstLine.split('=')[1].substring(0, 5) + '...');
  } else {
    console.log('First line of .env file:', firstLine);
  }
}