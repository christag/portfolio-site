# Strapi v5 API Breaking Changes Fix

## The Issue

Strapi v5 introduced several breaking changes to the API:

1. **`documentId` instead of `id`**: Records now use `documentId` for API routes
2. **Response structure changes**: The API response format has changed
3. **Different query parameters**: Some query syntax has been updated

## Quick Test

Before making changes, let's verify this is the issue. Try these URLs in your browser:

### Old (v4) format - Returns 404:

```
https://website-cms-production-96f5.up.railway.app/api/services/1
https://website-cms-production-96f5.up.railway.app/api/bio-articles/1
```

### New (v5) format - Should work:

```
https://website-cms-production-96f5.up.railway.app/api/services
https://website-cms-production-96f5.up.railway.app/api/bio-articles
```

## Changes Needed

### 1. Update the Strapi Types

The response structure in v5 includes `documentId` alongside `id`:

```typescript
interface BioArticle {
  id: number;
  documentId: string; // NEW in v5
  title: string;
  // ... rest of fields
}

interface Service {
  id: number;
  documentId: string; // NEW in v5
  title: string;
  // ... rest of fields
}
```

### 2. Update API Calls Using IDs

In `src/lib/strapi.ts`, the `getBioArticle` method needs updating:

```typescript
// OLD (v4)
async getBioArticle(id: string): Promise<BioArticle | null> {
  const response = await this.fetchAPI<StrapiResponse<BioArticle>>(
    `/bio-articles/${id}?populate=*`
  );
}

// NEW (v5) - use documentId
async getBioArticle(documentId: string): Promise<BioArticle | null> {
  const response = await this.fetchAPI<StrapiResponse<BioArticle>>(
    `/bio-articles/${documentId}?populate=*`
  );
}
```

### 3. Update Queries Using Filters

When filtering by slug or other fields, the syntax might have changed:

```typescript
// Check if this still works in v5
async getServiceBySlug(slug: string): Promise<Service | null> {
  const response = await this.fetchAPI(
    `/services?filters[slug][$eq]=${slug}&populate=*`
  );
}
```

### 4. Update Any Frontend Code Using IDs

Search for any code that references `article.id` or `service.id` for API calls and update to use `documentId`.

## Immediate Fix - Test if APIs Work

Since your frontend falls back to local data gracefully, the first step is just to verify the basic API endpoints work:

1. **Test listing endpoints** (these should work now):
   - https://website-cms-production-96f5.up.railway.app/api/services
   - https://website-cms-production-96f5.up.railway.app/api/bio-articles
   - https://website-cms-production-96f5.up.railway.app/api/profile
   - https://website-cms-production-96f5.up.railway.app/api/settings

2. **Check response structure**: Look at the JSON to see the new field names

3. **Create test content**: In Strapi admin, create and publish some test content

## The Good News

- Your frontend already has fallback handling, so the site works even with API issues
- The permission settings are correct (you confirmed this)
- The content types are registered (visible in admin)
- Once we fix the API calls to use v5 format, everything should work

## Next Steps

1. First, test the listing endpoints to confirm they return data
2. Check the JSON structure to understand the v5 response format
3. Update the frontend code to handle the new structure
4. Test individual record fetching with documentId
