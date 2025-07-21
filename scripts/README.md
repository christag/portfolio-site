# Service Import Scripts

Programmatically import services into your Strapi CMS without manual data entry.

## Quick Start

1. **Use existing services** (fastest option):

   ```bash
   node scripts/import-services.js
   ```

2. **Import from CSV** (spreadsheet-friendly):

   ```bash
   node scripts/import-services-csv.js scripts/services-template.csv
   ```

3. **Import from JSON** (full control):
   ```bash
   node scripts/import-services-json.js scripts/services-template.json
   ```

## Setup

1. **Environment Variables**: Make sure your Strapi connection is configured:

   ```bash
   # Check your environment variables
   echo $STRAPI_URL
   echo $STRAPI_API_TOKEN
   ```

2. **API Permissions**: Ensure your API token has **write** access to the Services collection type in Strapi admin.

## Import Options

### Option 1: Pre-built Services (`import-services.js`)

- **Best for**: Quick start with professional IT services
- **Includes**: 3 complete services with tiers, pricing, and features
- **Just run**: `node scripts/import-services.js`

### Option 2: CSV Import (`import-services-csv.js`)

- **Best for**: Bulk import from spreadsheets
- **Template**: `scripts/services-template.csv`
- **Usage**:
  1. Edit the CSV template with your services
  2. Run: `node scripts/import-services-csv.js your-services.csv`

**CSV Format:**

```csv
title,description,category,featureHighlights,isPinned,slug,contactMethod
"Service Name","Description here","Category","Feature 1;Feature 2",true,service-slug,email
```

### Option 3: JSON Import (`import-services-json.js`)

- **Best for**: Complex services with tiers and detailed pricing
- **Template**: `scripts/services-template.json`
- **Supports**: Full tier structures, multiple deliverables, complex pricing
- **Usage**:
  1. Edit the JSON template with your services
  2. Run: `node scripts/import-services-json.js your-services.json`

## Troubleshooting

### Services Not Appearing on Website

If services import successfully but don't show on your website:

1. **Check Publishing Status**: In Strapi admin, go to Content Manager > Services and make sure services are **Published** (not Draft)

2. **Check API Permissions**:
   - Go to Settings > Roles > Public > Services
   - Make sure **find** and **findOne** are checked

3. **Clear Cache**: Restart your frontend development server or redeploy

### Common Import Errors

**403 Forbidden**: API token doesn't have write permissions

- Solution: Check API token permissions in Strapi admin

**404 Not Found**: Services collection doesn't exist

- Solution: Make sure the Services content type is created in Strapi

**400 Bad Request**: Data format doesn't match content model

- Solution: Check that your service fields match your Strapi content model

### Debug Mode

For detailed debugging, check the browser console on your services page. The enhanced logging will show:

```
🔍 Testing Strapi connection to: https://your-strapi.railway.app
🔑 API Token available: YES
📡 Testing endpoint: /api/services
📊 Response status: 200 OK
✅ Strapi health check passed
```

## Adding More Services Later

You can run these scripts multiple times. Each script will create new services (it won't update existing ones with the same title).

To update existing services, either:

1. Delete them in Strapi admin first, then re-import
2. Edit them manually in Strapi admin
3. Use the Strapi API directly with PUT/PATCH requests

## Custom Fields

If you've added custom fields to your Services content model, update the scripts to include them:

```javascript
const service = {
  title: 'Your Service',
  description: 'Description',
  customField: 'Your custom value',
  // ... other fields
};
```
