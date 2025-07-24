# Service Worker Headers Bug - Navigation 404 Issue

**Date:** January 2025  
**Severity:** Critical  
**Status:** ✅ RESOLVED  
**Affected Browsers:** Desktop Chrome, Firefox, Edge (not iOS Safari/WebKit)

## Issue Summary

Navigation links on the website were returning 404 errors when clicked, but worked correctly on hard refresh. The issue only affected desktop browsers (Chrome, Firefox, Edge) while working perfectly on iOS Safari and iOS Firefox.

## Root Cause

The service worker (`public/sw.js`) contained a bug in the `addTimestamp()` function that attempted to directly modify immutable HTTP response headers:

```javascript
// BUGGY CODE - CAUSED 404s
function addTimestamp(response) {
  if (response.headers) {
    response.headers.set('sw-cached-at', Date.now().toString());
    // ❌ TypeError: Failed to execute 'set' on 'Headers': Headers are immutable
  }
}
```

When users clicked navigation links, the service worker intercepted the requests and failed with the error:

```
TypeError: Failed to execute 'set' on 'Headers': Headers are immutable
```

This caused navigation requests to fail, resulting in 404 errors.

## Why This Bug Existed

### Original Implementation Purpose

The service worker was designed with advanced caching optimizations including:

- Static asset caching with versioning
- API response caching with TTL (Time To Live)
- Image optimization and caching
- Performance monitoring
- Background sync capabilities

The `addTimestamp()` function was intended to:

1. Add cache timestamps to responses for TTL management
2. Enable sophisticated cache invalidation strategies
3. Support performance monitoring and analytics

### Why It Worked on iOS But Not Desktop

- **iOS WebKit**: Handles service worker errors more gracefully, often falling back to network requests when SW fails
- **Desktop Browsers**: Fail hard when service worker throws errors, causing navigation to completely break
- This browser difference made the bug particularly difficult to diagnose

## Troubleshooting Process

### Initial Misdiagnosis

1. **Suspected redirect configuration** - Modified `_redirects` file multiple times
2. **Suspected Astro build format** - Changed from `file` to `directory` format
3. **Suspected view transitions** - Disabled view transition APIs
4. **Suspected prefetch functionality** - Disabled Astro prefetch
5. **Suspected cache modules** - Disabled cache optimization imports

### Key Breakthrough

The critical clue was that the issue was **browser-specific**:

- ✅ Works: iOS Safari, iOS Firefox (WebKit)
- ❌ Fails: Desktop Chrome, Firefox, Edge

This indicated a **JavaScript/Service Worker issue** rather than server-side routing.

### Final Diagnosis

Browser console revealed the exact error:

```
[SW] Navigation request failed: https://portfolio-site-dev.pages.dev/portfolio
TypeError: Failed to execute 'set' on 'Headers': Headers are immutable
    at addTimestamp (sw.js:408:22)
    at handleNavigationRequest (sw.js:336:7)
```

## Solution

### Fixed the addTimestamp Function

```javascript
// ✅ FIXED CODE
function addTimestamp(response) {
  // Cannot modify response headers directly as they are immutable
  // Instead, create a new response with modified headers
  try {
    const newHeaders = new Headers(response.headers);
    newHeaders.set('sw-cached-at', Date.now().toString());
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  } catch (error) {
    console.warn('[SW] Failed to add timestamp to response:', error);
    return response; // Return original response if modification fails
  }
}
```

### Updated All Function Calls

Changed all 7 occurrences from:

```javascript
// OLD - Mutating approach
const responseToCache = networkResponse.clone();
addTimestamp(responseToCache);
cache.put(request, responseToCache);
```

To:

```javascript
// NEW - Immutable approach
const responseToCache = addTimestamp(networkResponse.clone());
cache.put(request, responseToCache);
```

### Version Bump

Updated service worker version from `v1.3.3` to `v1.3.4` to force cache invalidation and ensure users get the fix.

## Prevention Guidelines

### For Future AI/Human Developers

#### 1. Service Worker Development Rules

- **NEVER** directly modify response headers - they are immutable
- **ALWAYS** create new Response objects when modifying headers
- **TEST** service workers in multiple browsers, especially Chrome vs Safari
- **VERSION BUMP** service workers after critical fixes to force updates

#### 2. Debugging Browser-Specific Issues

- If an issue works on iOS but not desktop → Check service worker console errors
- If navigation works on refresh but not on clicks → Check service worker interception
- Always check browser console for service worker errors during navigation

#### 3. Service Worker Best Practices

```javascript
// ✅ CORRECT: Create new response with modified headers
function modifyResponse(response, headerName, headerValue) {
  try {
    const newHeaders = new Headers(response.headers);
    newHeaders.set(headerName, headerValue);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  } catch (error) {
    console.warn('Failed to modify response:', error);
    return response;
  }
}

// ❌ WRONG: Direct header modification
function badModifyResponse(response, headerName, headerValue) {
  response.headers.set(headerName, headerValue); // Will throw error!
  return response;
}
```

#### 4. Testing Checklist

When making service worker changes:

- [ ] Test in Chrome DevTools
- [ ] Test in Firefox DevTools
- [ ] Test in Safari DevTools (if available)
- [ ] Test navigation clicks (not just page refreshes)
- [ ] Check console for service worker errors
- [ ] Test in private/incognito mode
- [ ] Verify service worker version updates properly

#### 5. Architecture Notes

This site uses:

- **Astro** static site generator with `format: 'file'` (generates `.html` files)
- **Cloudflare Pages** hosting with `_redirects` for clean URLs
- **Service Worker** for caching, PWA features, and performance optimization
- **Build-time data fetching** from Strapi CMS
- **View Transitions API** (disabled for static site compatibility)

The service worker is critical for:

- Image optimization and lazy loading
- API response caching with TTL
- Offline functionality
- PWA capabilities
- Performance monitoring

## Files Modified

1. `public/sw.js` - Fixed `addTimestamp()` function and all its usages
2. `src/layouts/Layout.astro` - Re-enabled service worker registration
3. `_redirects` - Restored working fallback rule from main branch
4. `astro.config.mjs` - Restored working `format: 'file'` configuration

## Lessons Learned

1. **Browser differences matter** - Always test across browsers, especially for service worker functionality
2. **Service worker errors are silent killers** - They can break navigation without obvious symptoms
3. **Immutable web APIs require careful handling** - Response headers, Request objects, etc.
4. **Console debugging is crucial** - The exact error message led directly to the solution
5. **Version management is critical** - Service workers cache aggressively and need version bumps for updates

## Related Documentation

- [MDN: Response Headers](https://developer.mozilla.org/en-US/docs/Web/API/Response/headers)
- [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Astro: Service Workers](https://docs.astro.build/en/guides/integrations-guide/)
- [Cloudflare Pages: Redirects](https://developers.cloudflare.com/pages/platform/redirects/)

---

**Resolution Date:** January 23, 2025  
**Total Debug Time:** ~8 hours  
**Impact:** Critical navigation functionality restored across all browsers
