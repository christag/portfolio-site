# Deployment Guide - Cloudflare Pages

This guide covers the deployment setup for the Christopher Tagliaferro portfolio website using Cloudflare Pages with Strapi CMS integration.

## Architecture Overview

```
Strapi CMS (Railway) → Webhook → Cloudflare Pages → Static Site
                    ↓
               Content Updates → Automatic Rebuild
```

## Prerequisites

1. **GitHub Repository** - Code must be in a GitHub repository
2. **Cloudflare Account** - With Pages access
3. **Strapi CMS** - Running on Railway with PostgreSQL
4. **Domain** - Configured in Cloudflare (optional)

## Cloudflare Pages Setup

### 1. Connect Repository

1. Log into Cloudflare Dashboard
2. Go to **Pages** → **Create a project**
3. Connect your GitHub account
4. Select the repository: `christag/portfolio-site`
5. Configure build settings:
   - **Framework preset**: `Astro`
   - **Build command**: `npm run build:production`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (or `/website` if in monorepo)

### 2. Environment Variables

Configure these in Cloudflare Pages → Settings → Environment Variables:

#### Production Environment

```bash
NODE_ENV=production
STRAPI_URL=https://your-strapi-instance.railway.app
STRAPI_API_TOKEN=your-read-only-api-token
```

#### Preview Environment (optional)

```bash
NODE_ENV=development
STRAPI_URL=https://your-strapi-staging.railway.app
STRAPI_API_TOKEN=your-staging-api-token
```

### 3. Custom Domain (Optional)

1. Go to **Pages** → Your Project → **Custom domains**
2. Add `www.christagliaferro.com`
3. Configure DNS records as instructed
4. Enable **Always Use HTTPS**

## Strapi Webhook Configuration

### 1. Create Webhook in Strapi

1. Log into Strapi admin panel
2. Go to **Settings** → **Webhooks**
3. Click **Create new webhook**
4. Configure:
   - **Name**: `Cloudflare Pages Rebuild`
   - **URL**: `https://your-site.pages.dev/webhook`
   - **Events**: Select content events (create, update, delete, publish, unpublish)
   - **Headers** (optional):
     ```
     x-strapi-signature: your-secret-key
     ```

### 2. Deploy Hook (Alternative Method)

If you prefer using Cloudflare's deploy hooks:

1. In Cloudflare Pages → Settings → **Builds & deployments**
2. Create a **Deploy hook**
3. Use this URL in Strapi webhook instead
4. Set environment variable: `CLOUDFLARE_DEPLOY_HOOK_URL`

## Build Process

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build:production

# Preview production build
npm run preview
```

### Production Build

The build process:

1. **Content Fetching**: Attempts to fetch from Strapi, falls back to local content
2. **Static Generation**: Astro builds static HTML/CSS/JS
3. **Asset Optimization**: Images, fonts, and assets are optimized
4. **Output**: Static files in `dist/` directory

### Build Environment Variables

```bash
# Required for production builds
NODE_ENV=production
STRAPI_URL=https://your-strapi-instance.railway.app
STRAPI_API_TOKEN=your-api-token

# Optional
CLOUDFLARE_DEPLOY_HOOK_URL=https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/your-hook-id
```

## Content Management Workflow

### 1. Content Updates

1. **Edit in Strapi**: Update content in the Strapi admin panel
2. **Publish**: Click publish to make content live
3. **Webhook Trigger**: Strapi sends webhook to Cloudflare Pages
4. **Automatic Rebuild**: Site rebuilds with new content
5. **Deploy**: Updated site goes live automatically

### 2. Fallback Strategy

The site uses a hybrid content strategy:

- **Primary**: Fetch content from Strapi API during build
- **Fallback**: Use local markdown files if Strapi is unavailable
- **Resilience**: Site builds successfully even if CMS is down

## Monitoring and Troubleshooting

### Build Logs

Check build status:

1. Cloudflare Pages → Your Project → **Deployments**
2. Click on a deployment to view logs
3. Look for Strapi connection status and content fetching logs

### Common Issues

#### Build Fails - Strapi Connection

```bash
Error: Failed to fetch from Strapi API
```

**Solution**: Check STRAPI_URL and STRAPI_API_TOKEN environment variables

#### Webhook Not Triggering

1. Verify webhook URL in Strapi
2. Check Cloudflare Pages function logs
3. Ensure webhook events are properly configured

#### Content Not Updating

1. Check if webhook is being sent from Strapi
2. Verify content is published (not draft)
3. Check build logs for content fetching errors

### Performance

- **Build Time**: ~2-3 minutes
- **Cache Strategy**: 1 hour for HTML, 1 year for assets
- **CDN**: Global distribution via Cloudflare
- **Lighthouse Score**: Target 95+ for all metrics

## Security

### Headers Configuration

The `_headers` file configures:

- **Security Headers**: CSP, HSTS, X-Frame-Options
- **Cache Control**: Optimized caching strategy
- **CORS**: Configured for webhook endpoints

### API Security

- **Read-Only Token**: Strapi API token has read-only permissions
- **Webhook Signature**: Optional signature verification
- **Environment Variables**: Sensitive data in environment variables

## Backup and Recovery

### Content Backup

- **Strapi**: Railway automatic backups
- **Code**: Git repository on GitHub
- **Local Fallback**: Markdown files in repository

### Disaster Recovery

1. **Strapi Down**: Site continues with local content
2. **Cloudflare Down**: Can deploy to alternative platform
3. **GitHub Down**: Code backed up locally and in Strapi

## Maintenance

### Regular Tasks

- Monitor build success rates
- Review performance metrics
- Update dependencies monthly
- Test webhook functionality

### Updates

- **Content**: Through Strapi admin panel
- **Code**: Git push triggers automatic deployment
- **Dependencies**: Update and test in staging first
