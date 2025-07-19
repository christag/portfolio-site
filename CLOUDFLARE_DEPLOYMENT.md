# Cloudflare Pages Deployment Guide

## Project Configuration

### Build Settings

- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Node.js version**: `18` (or latest LTS)

### Environment Variables

#### Required for Strapi Integration

```
STRAPI_URL=https://your-strapi-instance.railway.app/api
STRAPI_API_TOKEN=your-api-token-here
```

**Important**: Ensure there are no extra characters in the STRAPI_URL (previous deployment had an extra 'v' character)

#### Optional Environment Variables

```
NODE_ENV=production
```

## Repository Setup

### GitHub Integration

1. Repository: `https://github.com/christag/portfolio-site.git`
2. Branch: `main`
3. Auto-deploy: Enabled

## Custom Domain Configuration

### DNS Settings

1. **Primary Domain**: `www.christagliaferro.com`
2. **Redirect**: `christagliaferro.com` → `www.christagliaferro.com`

### SSL Configuration

- **SSL/TLS**: Full (strict)
- **Always Use HTTPS**: Enabled
- **HSTS**: Enabled with preload

## Performance Optimization

### Caching Headers (via `_headers`)

- Static assets: 1 year cache
- HTML files: 1 hour with revalidation
- Security headers: Enabled

### CDN Settings

- **Minification**: Auto (CSS, JS, HTML)
- **Brotli Compression**: Enabled
- **HTTP/2**: Enabled

## Deployment Pipeline

### Automatic Builds

1. Push to `main` branch triggers deployment
2. Pull requests create preview deployments
3. Build notifications via GitHub status checks

### Webhook Integration (Strapi)

- **Webhook URL**: Provided by Cloudflare Pages
- **Events**: Content create, update, delete
- **Authentication**: Bearer token

## Testing Checklist

- [ ] Build completes successfully
- [ ] All pages render correctly
- [ ] Custom domain resolves with SSL
- [ ] Redirects work as expected
- [ ] Performance scores (Lighthouse)
- [ ] Strapi content fetching (if available)
- [ ] Fallback to local content works

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

2. **Content Loading Issues**
   - Verify STRAPI_URL format (no trailing slashes or extra characters)
   - Check API token permissions
   - Confirm fallback content is available

3. **Domain Issues**
   - Verify DNS propagation
   - Check SSL certificate status
   - Review redirect configurations

## Monitoring

### Performance Metrics

- Core Web Vitals
- Build times
- Cache hit rates
- Error rates

### Alerts

- Failed deployments
- Performance degradation
- SSL certificate expiration
