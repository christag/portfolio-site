# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context & Transition Notes

### Current Situation (as of 2025-08-03)

- **Previous Development**: Project was developed using Claude API via Cursor
- **Task Management**: Initially set up with Taskmaster, but frequent direction changes have made the current PRD and task list potentially outdated
- **Visual Issues**: Multiple unresolved visual/UI bugs exist in the current implementation
- **New Capabilities**: Claude Code now has Playwright access for visual testing and debugging
- **Goal**: Reassess project state, fix existing bugs, and create a realistic plan to finish the project

### Key Transition Points

1. **Visual Testing**: Use Playwright to check rendered pages and identify visual issues
2. **CMS Audit**: Use Strapi MCP tool to verify content and structure
3. **Task Reset**: Current Taskmaster tasks may need complete revision based on actual project state
4. **Iterative Development**: With Playwright, can now test visual changes immediately

## Commands

### Development

```bash
npm run dev          # Start Astro dev server at http://localhost:4321
npm run start        # Alias for npm run dev
npm run build        # Build for production (static site generation)
npm run preview      # Preview production build locally
npm run check        # Run Astro type checking
```

### Code Quality

```bash
npm run lint         # Run ESLint across all files
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check if code needs formatting
```

### Production

```bash
npm run build:production  # Production build with NODE_ENV=production
npm run deploy:preview    # Build and preview locally before deployment
```

### CMS Integration Scripts

```bash
# Service data import (located in scripts/)
node scripts/import-services.js              # Import pre-built IT services
node scripts/import-services-csv.js [file]   # Import from CSV
node scripts/import-services-json.js [file]  # Import from JSON with full structure

# Health checks and debugging
node scripts/test-strapi-health.js           # Test CMS connectivity
node scripts/check-strapi-endpoints.js       # Verify API endpoints
node scripts/list-available-endpoints.js     # Discovery mode for CMS content types
```

## Architecture Overview

This is a **high-performance portfolio and consulting website** built with modern web technologies, featuring authentic Apple Liquid Glass design principles and a sophisticated dual-repository architecture.

### Repository Structure

- **`website/`** (this repo) - Astro 5 frontend with glassmorphism design
- **`website-cms/`** - Strapi 5 headless CMS backend (deployed on Railway)

### Core Technology Stack

- **Frontend**: Astro 5 (static site generation) + TypeScript + Tailwind CSS v4
- **Backend**: Strapi 5 CMS with PostgreSQL (Railway platform)
- **Deployment**: Cloudflare Pages (frontend) + Railway (backend)
- **Animation**: GSAP/Framer Motion with glassmorphism effects
- **Performance**: Lighthouse 95+ score target with CDN optimization

### Key Design Philosophy: Authentic Glassmorphism

This implementation breaks from typical "frosted glass" approaches with **breakthrough principles**:

- **True Transparency**: 15-25% opacity (not 85-95%) for authentic glass effects
- **Strong Blur**: 20px backdrop-filter blur with 180% saturation
- **No Solid Backgrounds**: Glass materials exclusively throughout the UI
- **Adaptive Tinting**: Dynamic color overlays responding to background content
- **Spatial Depth**: Proper layering hierarchy with soft shadows and inner highlights

### Background Animation Systems (IMPORTANT)

There are **4 distinct background systems** - be specific when discussing modifications:

1. **Primary System**: `src/components/DynamicBackground.astro` (main glassmorphism background)
2. **Services Canvas**: `src/pages/services.astro` (line ~818, canvas-based particles)
3. **Test Component**: `src/components/TestBackground.astro` (development only)
4. **Static Assets**: `src/assets/background.svg` (file-based backgrounds)

When modifying backgrounds, always specify which system to avoid confusion.

### Content Management Architecture

#### CMS Integration (Strapi 5)

- **Base URL**: Environment variable `STRAPI_URL` (defaults to localhost:1337)
- **API Pattern**: RESTful endpoints at `/api/{content-type}`
- **Authentication**: Optional API token via `STRAPI_API_TOKEN`
- **Fallback Strategy**: Sample services displayed when CMS unavailable

#### Content Types

**Single Types** (global, unique content):

- **Profile** (`/api/profile`) - Author bio, contact info, social links
- **Settings** (`/api/settings`) - Site-wide configuration, SEO defaults

**Collection Types** (multiple entries):

- **Services** (`/api/services`) - Consulting services with tiered pricing
- **Bio Articles** (`/api/bio-articles`) - Blog-style biographical content
- **Portfolio** (`/api/portfolios`) - Work samples and case studies

#### Error Handling & Fallbacks

- **CMS Unavailable**: Services page shows sample data with clear notice
- **Custom 404**: Branded error page with glassmorphism design
- **Portfolio Coming Soon**: Professional placeholder for portfolio section
- **Graceful Degradation**: Site remains functional during CMS downtime

### File Structure & Key Components

#### Core Layout & Design

- `src/layouts/Layout.astro` - Base layout with glassmorphism integration
- `src/components/DynamicBackground.astro` - Primary animated background system
- `src/components/navigation/Navigation.astro` - Glass navigation with mobile menu
- `src/components/footer/Footer.astro` - Glassmorphism footer

#### Page Architecture

- `src/pages/index.astro` - Homepage with booking system integration
- `src/pages/services.astro` - CMS-powered services with fallback data
- `src/pages/services/[slug].astro` - Dynamic service detail pages
- `src/pages/i-am.astro` - Bio page with dynamic content
- `src/pages/portfolio.astro` - Coming soon placeholder
- `src/pages/404.astro` - Custom branded error handling

#### Utility Libraries

- `src/lib/strapi.ts` - CMS API integration with caching and error handling
- `src/lib/cache.ts` - Performance optimization for API calls
- `src/lib/content.ts` - Content processing utilities
- `src/lib/webshare.ts` - Native web sharing integration
- `src/lib/viewtransitions.ts` - Smooth page transitions

#### Styling Architecture

- `src/styles/global.css` - CSS custom properties and base styles
- `src/styles/variables.scss` - SCSS variables for glassmorphism
- `src/styles/design-tokens.scss` - Design system tokens
- `src/styles/components.scss` - Component-specific styles
- `src/styles/utilities.scss` - Utility classes
- `src/styles/animations.css` - Animation definitions

### Configuration Files

#### Astro Configuration (`astro.config.mjs`)

- **Static Site Generation**: Full static build for Cloudflare Pages
- **Vite Integration**: Tailwind CSS v4 native plugin
- **Performance Optimization**: Manual chunks for vendor code and utilities
- **Environment Schema**: Typed environment variables for CMS integration
- **Prefetch Strategy**: Viewport-based prefetching for performance

#### Tailwind Configuration (`tailwind.config.mjs`)

- **Minimal Config**: CSS variables handle colors/spacing via design tokens
- **Custom Breakpoints**: From 320px (xs) to 1440px (2xl)
- **Animation Keyframes**: fade-in, slide-up, float animations
- **Content Scanning**: All Astro, TypeScript, and component files

#### TypeScript Configuration (`tsconfig.json`)

- **Astro Strict Mode**: Maximum type safety
- **Path Resolution**: `@/` alias for clean imports
- **Build Exclusions**: Dist folder excluded from compilation

### Environment Variables

#### Required for CMS Integration

```bash
STRAPI_URL=https://your-railway-strapi-url.up.railway.app  # CMS backend URL
PUBLIC_STRAPI_URL=https://your-railway-strapi-url.up.railway.app  # Client-side access
```

#### Optional Configuration

```bash
STRAPI_API_TOKEN=your-strapi-api-token      # Enhanced API access
STRAPI_CACHE_TTL_MS=300000                  # Cache duration (5 minutes default)
ENABLE_BUILD_CACHE=true                     # Enable build-time caching
```

### Contact Flow Integration

All contact touchpoints redirect to external booking system:

- **Target**: `https://booking.christagliaferro.com`
- **Security**: `target="_blank" rel="noopener noreferrer"`
- **Touchpoints**: Homepage CTA, navigation links, service pages, 404 page

### Performance Optimization

#### Build Optimization

- **Manual Chunking**: Vendor code, utilities separated for caching
- **Asset Inlining**: Small assets inlined to reduce requests
- **CSS Splitting**: Separate CSS files for better caching
- **ES2020 Target**: Modern JavaScript for supported browsers

#### Runtime Performance

- **Glassmorphism Optimization**: GPU-accelerated blur effects
- **Motion Preferences**: Respects `prefers-reduced-motion`
- **Lazy Loading**: Images and components load on demand
- **CDN Caching**: Cloudflare global edge cache

#### Core Web Vitals Targets

- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **Lighthouse Score**: 95+ across all categories

### Development Workflow

#### Local Development Setup

1. **Install Dependencies**: `npm install`
2. **Environment Setup**: Copy `.env.example` to `.env` and configure CMS URL
3. **Start Development**: `npm run dev` (automatically starts at localhost:4321)
4. **CMS Testing**: Use scripts to verify CMS connectivity and import sample data

#### Code Quality Standards

- **ESLint + Prettier**: Automated via Husky pre-commit hooks
- **TypeScript Strict**: All code must pass strict type checking
- **Accessibility**: WCAG 2.2 AA compliance required
- **Performance**: Monitor Core Web Vitals in development
- **Glassmorphism Guidelines**: Follow breakthrough transparency principles

#### Testing CMS Integration

```bash
# Health check CMS connectivity
node scripts/test-strapi-health.js

# Verify available endpoints
node scripts/list-available-endpoints.js

# Import sample services for testing
node scripts/import-services.js
```

### MCP Tools Integration (IMPORTANT)

During development and testing, Claude Code should actively use the following MCP (Model Context Protocol) tools:

- **Playwright**: For browser automation and testing user interactions
- **Strapi**: For direct CMS content management and API operations
- **Cloudflare**: For deployment previews and production builds
- **Railway**: For backend CMS deployment and database management
- **GitHub**: For version control, pull requests, and CI/CD workflows

For production builds and task management:

- **Taskmaster (MCP)**: Production builds are driven by task-focused workflows using the Taskmaster MCP tool

### Deployment Architecture

#### Frontend (Cloudflare Pages)

- **Build Command**: `npm run build`
- **Output Directory**: `dist/`
- **Environment Variables**: Set STRAPI_URL in Cloudflare Pages dashboard
- **Custom Domain**: `www.christagliaferro.com`
- **Global CDN**: Automatic worldwide distribution
- **Production URL**: `https://portfolio-site-atn.pages.dev`
- **Development URL**: `https://portfolio-site-dev.pages.dev` (dev branch)

#### Backend (Railway - separate repository)

- **CMS Platform**: Strapi 5 with PostgreSQL
- **Auto-deploy**: Connected to GitHub website-cms repository
- **Environment**: Production-optimized with secure variable management
- **Database**: PostgreSQL with automated backups

### Troubleshooting

#### Common Development Issues

**Glassmorphism not rendering**:

- Check browser support for `backdrop-filter`
- Verify CSS custom properties are loading
- Ensure proper z-index layering

**CMS connection issues**:

- Verify STRAPI_URL environment variable
- Test connectivity: `node scripts/test-strapi-health.js`
- Check Railway backend status

**Build failures**:

- Run `npm run check` for TypeScript errors
- Verify all environment variables set
- Clear node_modules and reinstall if needed

**Services not displaying**:

- Check CMS content is published (not draft)
- Verify API permissions for public read access
- Clear browser cache and restart dev server

#### Performance Issues

- **Slow glassmorphism**: Reduce blur radius or limit concurrent glass elements
- **Bundle size**: Check manual chunks configuration in astro.config.mjs
- **Memory usage**: Monitor background animation performance on mobile devices

This architecture delivers a premium portfolio experience with authentic glassmorphism design, robust CMS integration, and production-ready performance optimization.
