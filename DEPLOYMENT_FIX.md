# Deployment Fix Guide

## Issues Fixed

### 1. 404 Errors on Non-Main Pages

**Problem**: Astro was configured with `build.format: 'file'` but the `_redirects` was set up for SPA-style routing, causing conflicts.

**Solution**:

- Changed `astro.config.mjs` to use `build.format: 'directory'` for clean URLs
- Updated `_redirects` to properly handle static routes and dynamic service pages
- Ensured 404 fallback is the last rule

### 2. CSS Not Loading on 404 Page

**Problem**: The 404 page CSS wasn't loading because of incorrect asset path resolution.

**Solution**: The changes above should fix this, but if issues persist:

- Ensure all CSS imports in Layout.astro use absolute paths
- Verify that the `_astro` asset directory is properly cached in `_headers`

## Changes Made

### astro.config.mjs

```diff
build: {
-   format: 'file', // Generate .html files for better compatibility
+   format: 'directory', // Generate clean URLs without .html extension
    assets: '_astro',
    inlineStylesheets: 'auto',
    split: true,
},
```

### \_redirects

```diff
- /* /404.html 404
+ # Handle trailing slashes for clean URLs
+ /services/ /services 301
+ /portfolio/ /portfolio 301
+ /i-am/ /i-am 301
+
+ # Dynamic service pages (preserve existing routes)
+ /services/* /services/:splat 200
+
+ # 404 fallback - MUST be last rule
+ /* /404 404
```

## Deployment Steps

1. **Build the site locally to test**:

   ```bash
   cd website
   npm run build
   npm run preview
   ```

2. **Test these URLs locally**:
   - `http://localhost:4321/` (should work)
   - `http://localhost:4321/services` (should work)
   - `http://localhost:4321/portfolio` (should work)
   - `http://localhost:4321/i-am` (should work)
   - `http://localhost:4321/services/some-service` (should work if service exists)
   - `http://localhost:4321/non-existent-page` (should show 404 with CSS)

3. **Deploy to Cloudflare Pages**:
   - Push changes to your repository
   - Cloudflare Pages will automatically redeploy
   - Test the same URLs on your live site

## Additional Troubleshooting

If issues persist after deployment:

### Check Build Output

The `dist/` folder should contain:

- `index.html` at root
- `services/index.html`
- `portfolio/index.html`
- `i-am/index.html`
- `404/index.html`
- `services/[slug]/index.html` (for dynamic routes)
- `_astro/` folder with assets

### Verify Cloudflare Pages Settings

In your Cloudflare Pages dashboard:

- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `website` (if deploying from monorepo)

### CSS Loading Debug

If CSS still doesn't load on 404:

1. Check browser dev tools for 404 asset requests
2. Verify `_astro` folder is being served correctly
3. Check that CSS files exist in `dist/_astro/`

## Rollback Plan

If these changes cause issues, revert:

```bash
# Revert astro.config.mjs
git checkout HEAD~1 -- website/astro.config.mjs

# Revert _redirects
git checkout HEAD~1 -- website/_redirects
```

Then redeploy.
