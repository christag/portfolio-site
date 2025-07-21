#!/usr/bin/env node

/**
 * Import Services from CSV to Strapi
 *
 * Usage: node scripts/import-services-csv.js services.csv
 *
 * CSV Format:
 * title,description,category,featureHighlights,isPinned,slug,contactMethod
 * "Service Title","Description here","Category","Feature 1;Feature 2;Feature 3",true,service-slug,email
 */

const fs = require('fs');
const path = require('path');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map((h) => h.replace(/"/g, '').trim());
  const services = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = [];
    let inQuotes = false;
    let currentValue = '';

    // Simple CSV parser that handles quoted values
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"' && (j === 0 || line[j - 1] === ',')) {
        inQuotes = true;
      } else if (
        char === '"' &&
        inQuotes &&
        (j === line.length - 1 || line[j + 1] === ',')
      ) {
        inQuotes = false;
      } else if (char === ',' && !inQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim()); // Add the last value

    const service = {};
    headers.forEach((header, index) => {
      const value = values[index] || '';

      switch (header) {
        case 'featureHighlights':
          service[header] = value ? value.split(';').map((f) => f.trim()) : [];
          break;
        case 'isPinned':
          service[header] = value.toLowerCase() === 'true';
          break;
        default:
          service[header] = value;
      }
    });

    if (service.title) {
      services.push(service);
    }
  }

  return services;
}

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
        error: errorText.substring(0, 200),
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
  const csvFile = process.argv[2];

  if (!csvFile) {
    console.error('❌ Please provide a CSV file path');
    console.log('Usage: node scripts/import-services-csv.js services.csv');
    process.exit(1);
  }

  if (!fs.existsSync(csvFile)) {
    console.error(`❌ CSV file not found: ${csvFile}`);
    process.exit(1);
  }

  console.log(`📂 Reading CSV file: ${csvFile}`);
  const csvContent = fs.readFileSync(csvFile, 'utf8');
  const services = parseCSV(csvContent);

  console.log(`🚀 Importing ${services.length} services to Strapi...`);
  console.log(`📡 Strapi URL: ${STRAPI_URL}`);
  console.log(`🔑 API Token: ${STRAPI_API_TOKEN ? 'SET' : 'NOT SET'}`);

  const results = [];
  for (const service of services) {
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
}

main().catch((error) => {
  console.error('💥 Import failed:', error);
  process.exit(1);
});
