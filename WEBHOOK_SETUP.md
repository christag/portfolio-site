# Strapi Webhook Integration Setup Guide

## Overview

This guide covers the complete setup of webhooks between Strapi CMS and Cloudflare Pages to trigger automatic rebuilds when content is updated.

## Architecture

```
Strapi CMS → Lifecycle Hooks → Webhook Function → Cloudflare Pages Deploy Hook → Site Rebuild
```

## 1. Cloudflare Pages Configuration

### Deploy Hook Setup

1. Go to your Cloudflare Pages project dashboard
2. Navigate to **Settings** → **Builds & deployments**
3. Scroll to **Deploy hooks** section
4. Click **Add deploy hook**
5. Configure:
   - **Hook name**: `strapi-content-update`
   - **Deploy branch**: `main`
   - **Description**: `Triggered by Strapi content updates`
6. Copy the generated webhook URL (format: `https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/{hook-id}`)

### Environment Variables (Cloudflare Pages)

Add these in **Settings** → **Environment variables**:

```bash
# Required for webhook authentication (optional but recommended)
STRAPI_WEBHOOK_SECRET=your-secure-secret-here

# Deploy hook URL (used by the webhook function)
CLOUDFLARE_DEPLOY_HOOK_URL=https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/{hook-id}
```

## 2. Strapi CMS Configuration

### Environment Variables (Railway/Strapi)

Add these to your Strapi deployment:

```bash
# Webhook endpoint URL (your Cloudflare Pages domain + /webhook)
STATIC_SITE_WEBHOOK_URL=https://www.christagliaferro.com/webhook

# Optional: Webhook authentication secret (same as Cloudflare)
STRAPI_WEBHOOK_SECRET=your-secure-secret-here
```

### Lifecycle Hooks

Lifecycle hooks are already configured for all content types:

- `bio-article/lifecycles.ts`
- `author-profile/lifecycles.ts`
- `site-settings/lifecycles.ts`

These hooks trigger webhooks on:

- `afterCreate`
- `afterUpdate`
- `afterDelete`
- `afterPublish`
- `afterUnpublish`

## 3. Webhook Function

The webhook function is located at `/functions/webhook.js` and handles:

### Security Features

- Event filtering (only processes relevant events)
- Optional signature verification
- CORS handling for OPTIONS requests
- Error handling and logging

### Supported Events

- `entry.create`
- `entry.update`
- `entry.delete`
- `entry.publish`
- `entry.unpublish`

### Request Flow

1. Strapi lifecycle hook triggers
2. POST request sent to `/webhook` endpoint
3. Webhook function validates request
4. Deploy hook URL called to trigger rebuild
5. Cloudflare Pages rebuilds site with updated content

## 4. Testing the Integration

### Test Webhook Manually

```bash
curl -X POST https://www.christagliaferro.com/webhook \
  -H "Content-Type: application/json" \
  -H "x-strapi-signature: your-secret" \
  -d '{
    "event": "entry.update",
    "model": "bio-article",
    "entry": {
      "id": 1,
      "documentId": "test-doc",
      "publishedAt": "2025-01-19T13:00:00.000Z"
    },
    "createdAt": "2025-01-19T13:00:00.000Z"
  }'
```

### Test Content Updates

1. Login to Strapi admin panel
2. Update any bio article, author profile, or site settings
3. Check Cloudflare Pages deployment logs
4. Verify site updates with new content

## 5. Monitoring and Debugging

### Strapi Logs

Monitor Strapi logs for webhook trigger messages:

```
Triggering webhook for entry.update on bio-article:1
Webhook triggered successfully for entry.update
```

### Cloudflare Pages Logs

Check deployment logs in Cloudflare Pages dashboard:

- Build triggered by webhook
- Build completion status
- Any build errors

### Common Issues

#### Webhook Not Triggering

- Verify `STATIC_SITE_WEBHOOK_URL` is set correctly in Strapi
- Check Strapi logs for error messages
- Ensure lifecycle hooks are properly loaded

#### Build Not Starting

- Verify `CLOUDFLARE_DEPLOY_HOOK_URL` is correct
- Check webhook function logs in Cloudflare Pages
- Confirm deploy hook is active in Cloudflare settings

#### Authentication Failures

- Ensure `STRAPI_WEBHOOK_SECRET` matches in both environments
- Verify webhook signature generation/validation

## 6. Security Considerations

### Best Practices

1. **Use HTTPS**: All webhook URLs should use HTTPS
2. **Authenticate Requests**: Use webhook secrets for validation
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **Validate Payloads**: Verify webhook payload structure
5. **Log Security Events**: Monitor for suspicious webhook activity

### Environment Security

- Keep webhook secrets secure and rotate regularly
- Use environment variables for all sensitive data
- Restrict webhook endpoint access if possible

## 7. Performance Optimization

### Preventing Duplicate Builds

- Webhook function filters events to prevent unnecessary builds
- Only content-affecting events trigger rebuilds
- Debouncing can be implemented for rapid successive changes

### Build Optimization

- Use incremental builds when possible
- Cache dependencies and assets
- Optimize build pipeline for speed

## 8. Troubleshooting Guide

### Webhook Function Issues

```javascript
// Add debug logging to webhook function
console.log('Webhook payload:', body);
console.log('Environment vars:', {
  CLOUDFLARE_DEPLOY_HOOK_URL: !!env.CLOUDFLARE_DEPLOY_HOOK_URL,
  STRAPI_WEBHOOK_SECRET: !!env.STRAPI_WEBHOOK_SECRET,
});
```

### Strapi Lifecycle Issues

```javascript
// Add debug logging to lifecycle hooks
console.log('Lifecycle event triggered:', eventType, model, entry.id);
console.log('Webhook URL configured:', !!process.env.STATIC_SITE_WEBHOOK_URL);
```

### Network Connectivity

- Test webhook URL accessibility from Strapi server
- Verify firewall rules allow outbound HTTPS requests
- Check DNS resolution for webhook domains

## 9. Advanced Configuration

### Custom Event Filtering

Modify lifecycle hooks to filter specific events:

```javascript
// Only trigger for published content
if (entry.publishedAt) {
  await triggerWebhook('entry.update', 'bio-article', entry);
}
```

### Webhook Payload Customization

Extend webhook payload with additional data:

```javascript
const payload = {
  event: eventType,
  model,
  entry: {
    id: entry.id,
    documentId: entry.documentId,
    publishedAt: entry.publishedAt,
    title: entry.title, // Additional field
    lastModified: entry.updatedAt,
  },
  metadata: {
    timestamp: new Date().toISOString(),
    source: 'strapi-lifecycle',
    version: '1.0.0',
  },
};
```

## 10. Maintenance

### Regular Tasks

- Monitor webhook success rates
- Review and rotate webhook secrets
- Update webhook function as needed
- Test webhook functionality monthly
- Review build performance metrics

### Updates and Changes

- Test webhook integration after Strapi updates
- Verify compatibility with Cloudflare Pages changes
- Update documentation as configuration evolves
