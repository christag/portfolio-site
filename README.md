# Chris's Portfolio & Technology Consulting Website

A cutting-edge portfolio and business website featuring **Apple Liquid Glass design principles**, built with Astro 5 and Strapi 5, optimized for performance, accessibility, and modern user experience.

## 🌟 Design Philosophy

### ✨ Glassmorphism (Liquid Glass) Principles

Our design implements **authentic glassmorphism** with breakthrough techniques:

- **🔍 TRUE TRANSPARENCY**: 15-25% opacity (not 85-95%) for genuine glass effects
- **🌫️ STRONG BLUR**: 20px backdrop-filter blur with 180% saturation for frosted glass
- **🎨 ADAPTIVE TINTING**: Dynamic color overlays that respond to background content
- **📐 SPATIAL DEPTH**: Proper layering hierarchy with soft shadows and inner highlights
- **🚫 NO SOLID BACKGROUNDS**: Glass materials exclusively - authentic material design

### 🎯 Aesthetic Fusion

**Punk-meets-Professional**: Controlled collision of brutalist minimalism and expressive punk-art energy:

- **70% Monochrome Base**: Clean, professional foundation with glassmorphism
- **30% Strategic Accents**: Electric pops for maximum impact and brand personality
- **Deliberate Misalignment**: Print-style, asymmetric layouts with spatial awareness
- **Expressive Micro-interactions**: Glitch effects, motion blur, punk-inspired animations

## 🚀 Features

- **⚡ Ultra-Fast Performance**: Astro 5 with 40% faster loading and 90% less JavaScript
- **🪟 Advanced Glassmorphism**: Authentic Apple Liquid Glass implementation with true transparency
- **🎨 Dynamic Content**: Strapi 5 CMS with tiered pricing, filtering, and real-time updates
- **♿ Accessibility First**: WCAG 2.2 AA compliant with comprehensive testing
- **🔍 SEO Optimized**: Dynamic metadata, structured data, and Core Web Vitals optimization
- **🌐 Production Ready**: Deployed on Cloudflare Pages with Railway Strapi backend
- **🔄 Modern Workflow**: GitHub Actions CI/CD with Taskmaster AI-powered project management
- **📱 Responsive Design**: Mobile-first with glassmorphism effects across all devices
- **🔐 Enterprise Security**: Railway security hardening and comprehensive backup strategies
- **📞 Integrated Booking**: All contact flows direct to https://booking.christagliaferro.com
- **🛡️ Graceful Degradation**: Sample services shown when CMS is unavailable
- **🎯 Professional Error Handling**: Custom branded 404 and portfolio coming soon pages

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Astro 5](https://astro.build/) - Modern static site generator with islands architecture
- **Language**: TypeScript for type safety and developer experience
- **Styling**: Modern CSS with Tailwind CSS + Glassmorphism utilities
- **Animations**: GSAP/Framer Motion with accessibility-first approach
- **PWA**: Service workers, offline support, and installability
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) with global CDN

### Backend & CMS

- **CMS**: [Strapi 5](https://strapi.io/) - Headless CMS with advanced content modeling
- **Database**: PostgreSQL with automated backups
- **Hosting**: [Railway](https://railway.app/) for Strapi backend
- **API**: REST endpoints with proper error handling and fallbacks

### Infrastructure & DevOps

- **Frontend Hosting**: Cloudflare Pages with automatic deployments
- **Backend Hosting**: Railway with PostgreSQL database
- **CI/CD**: GitHub Actions with Lighthouse CI integration
- **Monitoring**: Railway metrics with performance alerting
- **Security**: Railway security, SSL/TLS, environment variable management

### Development Tools

- **Code Quality**: ESLint + Prettier + Husky with custom rules
- **Project Management**: Taskmaster AI with complexity analysis
- **Testing**: Playwright for E2E, Jest for unit tests
- **Performance**: Lighthouse CI, Core Web Vitals monitoring

## 📋 Prerequisites

- **Node.js 18+** ([Download here](https://nodejs.org/))
- **Git** configured with your GitHub account
- **Railway Account** for Strapi CMS hosting
- **Cloudflare Account** for Pages deployment
- **Strapi 5** knowledge for content management

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/christag/portfolio-site.git
cd portfolio-site

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Add your Railway Strapi URL to .env

# Start development server
npm run dev
```

### 2. Environment Configuration

Create `.env` file in the `website` directory:

```bash
# Strapi CMS Configuration
STRAPI_URL=https://your-railway-strapi-url.up.railway.app
STRAPI_API_TOKEN=your-strapi-api-token (optional)
```

### 3. Development Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:4321
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier
npm run format:check # Check if code is formatted

# Testing
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run lighthouse   # Run Lighthouse audit

# Taskmaster (Project Management)
npm run task-master  # Access task management CLI
```

## 🏗️ Project Structure

```text
/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # GitHub Actions CI/CD pipeline
│       └── lighthouse.yml      # Performance monitoring
├── .taskmaster/
│   ├── tasks/
│   │   └── tasks.json          # AI-managed project tasks
│   ├── reports/
│   │   └── complexity-report.json
│   └── docs/                   # Project documentation
├── public/
│   ├── favicon.svg             # Site favicon
│   ├── robots.txt              # Search engine guidelines
│   ├── email-icon.svg          # Contact icons
│   ├── linkedin-icon.svg
│   ├── phone-icon.svg
│   └── web-icon.svg
├── src/
│   ├── components/
│   │   ├── demo/
│   │   │   └── AnimationDemo.astro
│   │   ├── footer/
│   │   │   └── Footer.astro    # Glassmorphism footer
│   │   ├── grids/
│   │   │   ├── AsymmetricGrid.astro
│   │   │   ├── MasonryGrid.astro
│   │   │   └── ResponsiveGrid.astro
│   │   ├── navigation/
│   │   │   └── Navigation.astro # Glassmorphism navigation
│   │   ├── utils/
│   │   │   └── performance.js   # Performance utilities
│   │   ├── DynamicBackground.astro # Animated background
│   │   ├── SEO.astro           # Dynamic SEO component
│   │   ├── ServiceCard.astro   # Service display component
│   │   └── Welcome.astro       # Homepage component
│   ├── layouts/
│   │   └── Layout.astro        # Base layout with glassmorphism
│   ├── lib/
│   │   ├── strapi.ts           # Strapi API integration
│   │   └── content.ts          # Content management utilities
│   ├── pages/
│   │   ├── index.astro         # Homepage with booking integration
│   │   ├── 404.astro           # Custom branded 404 page
│   │   ├── portfolio.astro     # Coming soon page
│   │   ├── services.astro      # Services with CMS fallback
│   │   ├── services/
│   │   │   └── [slug].astro    # Dynamic service pages
│   │   ├── i-am.astro          # About page
│   │   └── grid-test.astro     # Grid system demo
│   ├── styles/
│   │   ├── animations.css      # Animation utilities
│   │   ├── base.scss           # Base styles
│   │   ├── components.scss     # Component styles
│   │   ├── global.css          # Global styles
│   │   ├── utilities.scss      # Utility classes
│   │   └── variables.scss      # CSS variables for glassmorphism
│   └── types/
│       └── global.d.ts         # TypeScript definitions
├── website-cms/                # Strapi 5 CMS (Railway deployment)
│   ├── src/
│   │   ├── api/
│   │   │   ├── bio-article/    # Bio content type
│   │   │   ├── profile/        # Author profile
│   │   │   └── settings/       # Site settings
│   │   └── components/         # Shared components
│   ├── config/                 # Strapi configuration
│   └── database/               # Database migrations
├── astro.config.mjs            # Astro 5 configuration
├── tailwind.config.mjs         # Tailwind with glassmorphism utilities
├── eslint.config.js            # ESLint configuration
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## 🎯 Recent Major Updates

### ✅ **Service Content Type Added** (December 2024)

- **Complete API Structure**: Service collection type with controllers, routes, and services
- **Pricing Tiers**: Component-based tiered pricing with deliverables
- **Feature Highlights**: JSON array for service features
- **Contact Methods**: Enumeration for email, calendar, phone, or custom links
- **SEO Integration**: Reusable SEO component for service pages

### ✅ **Mobile CSS Fix** (December 2024)

- **SCSS Import Issue**: Fixed mobile browsers failing to load styles
- **Proper Imports**: Moved SCSS imports to Astro component head
- **Cross-Browser**: Now works on all mobile browsers including iOS Safari

### ✅ **Dynamic Background Enhancements** (December 2024)

- **Smaller Particles**: Reduced all particle sizes by 50% for subtler effect
- **Less Blur**: Decreased blur from 5px to 1px for sharper definition
- **Horizontal Glitch Lines**: Added randomized glitch lines appearing every 1-8 seconds
- **True Randomization**: JavaScript-powered dynamic positioning and timing
- **Performance**: Optimized animations with proper cleanup

### ✅ **Strapi 5 CMS Integration** (Production Ready)

- **Railway Deployment**: Fully configured Strapi 5 backend on Railway
- **Content Types**: Bio articles, author profile, site settings, and services
- **API Endpoints**: REST API with proper error handling
- **Database**: PostgreSQL with automated backups
- **Environment Variables**: Secure configuration management

### ✅ **Contact Flow Integration**

- **Booking System**: All contact buttons → https://booking.christagliaferro.com
- **Unified Experience**: Homepage, services, navigation, and 404 page
- **External Links**: Proper `target="_blank"` and security attributes
- **Professional Flow**: Seamless transition to booking system

### ✅ **Error Handling & Fallbacks**

- **Custom 404 Page**: Branded error page with glassmorphism design
- **Portfolio Coming Soon**: Professional placeholder for portfolio section
- **CMS Fallback**: Sample services displayed when CMS is unavailable
- **Graceful Degradation**: Site remains functional during CMS downtime

### ✅ **Production Deployment**

- **Cloudflare Pages**: Frontend deployed with global CDN
- **Railway Backend**: Strapi CMS with PostgreSQL database
- **Environment Variables**: Production configuration for CMS connection
- **Performance Optimization**: Fast loading with proper caching

### ✅ **Strapi Technical Fixes**

- **Content Type Registration**: Fixed missing index.js files
- **API Identifier Alignment**: Corrected controller/route/service references
- **Lifecycle Hooks**: Removed invalid hooks, implemented proper patterns
- **TypeScript to JavaScript**: Resolved compilation issues
- **Schema Validation**: Fixed plural name conflicts with Strapi built-ins

## 🎯 Project Management with Taskmaster AI

This project uses **Taskmaster AI** for sophisticated project management:

### 📊 Current Status

- **Total Tasks**: 15 major tasks with 120+ detailed subtasks
- **Completion**: Tasks 1-3 ✅ | Task 4 (Services) ✅ | Task 5 (CMS) ✅
- **Current Focus**: Task 6 (Portfolio Enhancement) and Task 7 (Performance)
- **Production Status**: ✅ Live and functional with CMS integration

### 🧠 AI-Powered Features

- **Complexity Analysis**: Research-backed task difficulty assessment
- **Dependency Management**: Automated critical path optimization
- **Progress Tracking**: Real-time status updates with detailed logging
- **Risk Assessment**: Early identification of potential blockers

### 📋 Completed Major Milestones

#### ✅ **Critical Infrastructure (Completed)**

1. **Task 1**: Project Setup & Development Environment ✅
2. **Task 2**: Core Layout & Glassmorphism Implementation ✅
3. **Task 3**: Bio Page with Dynamic Content ✅
4. **Task 4**: Services Page with CMS Integration ✅
5. **Task 5**: Strapi 5 CMS Deployment on Railway ✅

#### 🔄 **Current Focus (In Progress)**

6. **Task 6**: Portfolio Section Enhancement
7. **Task 7**: Performance Optimization & Monitoring
8. **Task 8**: Advanced Error Handling & Accessibility

#### 📋 **Upcoming Features**

9. **Task 9**: PWA Implementation
10. **Task 10**: Advanced Analytics Integration
11. **Task 11**: SEO Enhancement & Schema Markup
12. **Task 12**: Advanced Animations & Micro-interactions

## 🪟 Glassmorphism Implementation Guide

### ✅ **BREAKTHROUGH PRINCIPLES** (Implemented)

**Critical Success Factors**:

- **Very Low Opacity**: 15-25% (not 85-95%) for true transparency
- **Strong Blur Effects**: 20px backdrop-filter blur with 180% saturation
- **CSS Targeting**: `html[data-theme='dark']` with `!important` for specificity
- **No Solid Backgrounds**: Glass materials exclusively

**Implementation Pattern**:

```css
/* ✅ Correct Glassmorphism */
.glass-panel {
  background: rgba(0, 0, 0, 0.15); /* 15% opacity */
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* ❌ Avoid: High opacity creates opaque panels */
.not-glass {
  background: rgba(0, 0, 0, 0.85); /* 85% opacity - opaque! */
}
```

### 🎨 **Design System Integration**

**Navigation & Footer**:

- 15% opacity black background with 20px blur
- Mobile menu: 25% opacity for text readability
- Proper layering hierarchy with content visibility

**Components**:

- Cards and containers: 15-25% opacity, 24px radius
- Buttons: 16-20px blur with adaptive tinting
- All elements use glass materials exclusively

## 🚀 Deployment

### Production Environment

**Frontend (Cloudflare Pages)**:

- **URL**: https://www.christagliaferro.com
- **CDN**: Global Cloudflare network
- **SSL**: Automatic HTTPS with modern TLS
- **Build**: Automatic deployment from GitHub main branch

**Backend (Railway)**:

- **Strapi CMS**: https://your-railway-domain.up.railway.app
- **Database**: PostgreSQL with automated backups
- **Environment**: Production-optimized configuration
- **Security**: Environment variable management

### Environment Variables Setup

#### Cloudflare Pages Environment Variables

Set these in your Cloudflare Pages dashboard:

```bash
STRAPI_URL=https://your-railway-strapi-url.up.railway.app
STRAPI_API_TOKEN=your-optional-api-token
```

#### Railway Environment Variables

Configure in Railway dashboard:

```bash
DATABASE_URL=postgresql://user:pass@host:port/db
NODE_ENV=production
STATIC_SITE_WEBHOOK_URL=https://your-cloudflare-pages-webhook
```

### Deployment Pipeline

**Automated Process**:

1. ✅ **Code Push**: Push to main branch triggers deployment
2. ✅ **Quality Checks**: ESLint, TypeScript, and build validation
3. ✅ **Build Process**: Astro static site generation
4. ✅ **CMS Health Check**: Verify Strapi connectivity
5. ✅ **Performance Audit**: Lighthouse CI validation
6. ✅ **Global Deployment**: Cloudflare Pages worldwide distribution

### CMS Content Management

**Strapi Admin Panel**:

- Access: https://your-railway-url.up.railway.app/admin
- Content Types: Bio Articles, Profile, Settings
- Media Management: File uploads and organization
- User Management: Admin access control

## 🔧 Configuration

### CMS Integration

**Content Types**:

- **Profile** (`/api/profile`): Author information and bio
- **Settings** (`/api/settings`): Site-wide configuration
- **Bio Articles** (`/api/bio-articles`): Dynamic content pieces

**API Endpoints**:

- Health Check: `GET /api/profile`
- All Services: `GET /api/services` (when implemented)
- Site Settings: `GET /api/settings`

### Error Handling Strategy

**CMS Unavailable**:

- Services page shows sample services with clear notice
- Health check determines CMS availability
- Graceful fallback maintains site functionality

**404 Errors**:

- Custom branded 404 page with glassmorphism design
- Clear navigation options and contact information
- Professional error messaging

### Contact Flow Integration

**All Contact Points**:

- Homepage "Let's Talk" button
- Navigation contact links (desktop & mobile)
- Services page CTAs
- Individual service page buttons
- 404 page contact link

**External Link Configuration**:

- Target: `https://booking.christagliaferro.com`
- Security: `target="_blank" rel="noopener noreferrer"`
- Consistent user experience across all touchpoints

## 👥 Development Workflow

### Feature Development with Taskmaster

```bash
# 1. Check current task status
npm run task-master next

# 2. Create feature branch
git checkout -b feature/new-component

# 3. Work on complexity-optimized subtasks
# Follow dependency order from Taskmaster analysis

# 4. Update task progress
npm run task-master update-subtask --id=6.3 --progress="Completed portfolio grid layout"

# 5. Mark subtask complete
npm run task-master set-status --id=6.3 --status=done

# 6. Push and create PR
git push origin feature/new-component
```

### Code Quality Standards

- **Glassmorphism Guidelines**: Follow breakthrough principles for all glass effects
- **Accessibility**: WCAG 2.2 AA compliance with glass effect considerations
- **Performance**: Core Web Vitals optimization with glassmorphism
- **TypeScript**: Strict typing for component props and Strapi responses
- **Testing**: E2E tests for glassmorphism rendering and interactions
- **CMS Integration**: Proper error handling and fallback strategies

## 🎯 Performance Metrics

### Current Targets

- **Lighthouse Score**: 95+ across all categories
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **PWA Score**: 100% compliance

### Production Performance

- **Cloudflare CDN**: Global edge caching for static assets
- **Railway Performance**: Optimized Strapi backend response times
- **Image Optimization**: WebP/AVIF formats with lazy loading
- **Code Splitting**: Astro 5 islands architecture minimizes JavaScript

### Glassmorphism Performance

- **GPU Acceleration**: All blur effects use hardware acceleration
- **Fallback Strategy**: Graceful degradation for unsupported browsers
- **Motion Preferences**: Respect `prefers-reduced-motion` settings
- **Memory Usage**: Optimized for mobile devices

## ♿ Accessibility with Glassmorphism

### Glass Effect Considerations

- **Contrast Ratios**: Blur effects maintain sufficient text contrast
- **Focus States**: High-contrast focus indicators on glass elements
- **Screen Readers**: Proper ARIA labels and semantic markup
- **Motion Sensitivity**: Glassmorphism respects motion preferences
- **Color Independence**: No reliance on glass effects for information

### Error Page Accessibility

- **Custom 404**: Accessible navigation and clear error messaging
- **Coming Soon**: Professional placeholder with proper headings
- **Contact Integration**: Accessible booking flow with proper labels

## 🔍 SEO Features

### Dynamic Content Optimization

- **Strapi Integration**: Automatic meta tag generation from CMS
- **Structured Data**: Schema.org markup for services and portfolio
- **Performance SEO**: Fast loading improves search rankings
- **Glassmorphism SEO**: Visual effects don't impact content indexing

### Production SEO

- **Custom 404**: Proper HTTP status codes and user experience
- **Portfolio Coming Soon**: SEO-friendly placeholder content
- **Services Fallback**: Maintains SEO value during CMS downtime

## 🐛 Troubleshooting

### Production Issues

**CMS Connection Problems**:

```bash
# Check environment variables in Cloudflare Pages
# Verify Railway Strapi is running and accessible
# Test API endpoints directly: https://your-railway-url.up.railway.app/api/profile
```

**Deployment Failures**:

```bash
# Check build logs in Cloudflare Pages dashboard
# Verify environment variables are set correctly
# Test build locally: npm run build
```

### CMS Issues

**Strapi Not Starting**:

```bash
# Check Railway logs for startup errors
# Verify database connection and environment variables
# Ensure all content types have proper index.js files
```

**API Endpoint Errors**:

```bash
# Verify content type names match API calls
# Check controller/route/service file references
# Ensure database migrations are complete
```

### Glassmorphism Issues

**Glass Effects Not Rendering**:

```css
/* Check browser support */
@supports (backdrop-filter: blur(20px)) {
  .glass-element {
    backdrop-filter: blur(20px);
  }
}

/* Fallback for unsupported browsers */
@supports not (backdrop-filter: blur(20px)) {
  .glass-element {
    background: rgba(0, 0, 0, 0.8);
  }
}
```

**Performance Issues with Blur**:

- Reduce blur radius from 20px to 16px
- Limit number of simultaneous glass elements
- Use `will-change: backdrop-filter` for animated glass

## 📄 License

This project is private and proprietary. All rights reserved.

## 🙏 Acknowledgments

- **Apple Design Team**: For Liquid Glass design inspiration
- **Astro Team**: For the incredible static site generator
- **Strapi Team**: For the powerful headless CMS
- **Cloudflare**: For fast global content delivery
- **Railway**: For reliable backend hosting
- **Taskmaster AI**: For intelligent project management
- **Open Source Community**: For the tools that make this possible

---

**Built with ❤️ and 🪟 by Tags** | [Website](https://www.christagliaferro.com) | [LinkedIn](https://www.linkedin.com/in/christophertagliaferro/) | [Book a Call](https://booking.christagliaferro.com)
