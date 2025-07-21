#!/usr/bin/env node

/**
 * Import Services from JSON to Strapi
 *
 * Usage: node scripts/import-services-json.js services.json
 *
 * JSON Format: Array of service objects (see services-template.json)
 */

const fs = require('fs');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function createService(service) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN
          ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        data: service,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Created service: "${service.title}"`);
      return result;
    } else {
      const errorText = await response.text();
      console.error(`❌ Failed to create service "${service.title}":`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText.substring(0, 300),
      });
      return null;
    }
  } catch (error) {
    console.error(
      `💥 Network error creating "${service.title}":`,
      error.message
    );
    return null;
  }
}

async function main() {
  const jsonFile = process.argv[2];

  if (!jsonFile) {
    console.error('❌ Please provide a JSON file path');
    console.log('Usage: node scripts/import-services-json.js services.json');
    console.log(
      'Example: node scripts/import-services-json.js scripts/services-template.json'
    );
    process.exit(1);
  }

  if (!fs.existsSync(jsonFile)) {
    console.error(`❌ JSON file not found: ${jsonFile}`);
    process.exit(1);
  }

  console.log(`📂 Reading JSON file: ${jsonFile}`);

  let services;
  try {
    const jsonContent = fs.readFileSync(jsonFile, 'utf8');
    services = JSON.parse(jsonContent);
  } catch (error) {
    console.error(`❌ Failed to parse JSON file:`, error.message);
    process.exit(1);
  }

  if (!Array.isArray(services)) {
    console.error('❌ JSON file must contain an array of services');
    process.exit(1);
  }

  console.log(`🚀 Importing ${services.length} services to Strapi...`);
  console.log(`📡 Strapi URL: ${STRAPI_URL}`);
  console.log(`🔑 API Token: ${STRAPI_API_TOKEN ? 'SET' : 'NOT SET'}`);

  const results = [];
  for (const service of services) {
    if (!service.title) {
      console.warn(`⚠️ Skipping service without title:`, service);
      continue;
    }

    console.log(`\n📝 Creating: ${service.title}...`);
    const result = await createService(service);
    results.push(result);

    // Add a small delay to be nice to the API
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const successful = results.filter((r) => r !== null).length;
  const failed = results.length - successful;

  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Successful: ${successful}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📋 Total: ${results.length}`);

  if (failed > 0) {
    console.log(`\n🔧 If services failed to create, check:`);
    console.log(`   - Strapi is running and accessible`);
    console.log(`   - API token has write permissions to services`);
    console.log(
      `   - Services content model exists and matches the data structure`
    );
    console.log(`   - Check the error messages above for specific issues`);
  }
}

main().catch((error) => {
  console.error('💥 Import failed:', error);
  process.exit(1);
});
