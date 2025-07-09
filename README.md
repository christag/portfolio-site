# Chris's Portfolio & Technology Consulting Website

A high-performance portfolio and business website built with Astro, featuring modern development practices, automated CI/CD, and optimized for accessibility and SEO.

## 🚀 Features

- **⚡ Ultra-Fast Performance**: Built with Astro for 40% faster loading and 90% less JavaScript
- **🔍 SEO Optimized**: Automatic sitemap generation, meta tags, and search engine friendly
- **♿ Accessibility First**: WCAG compliant design with comprehensive accessibility testing
- **🛡️ Quality Assured**: ESLint, Prettier, and automated testing in CI/CD pipeline
- **🌍 Global CDN**: Deployed on Cloudflare Pages for worldwide performance
- **🔄 Modern Workflow**: GitHub Actions CI/CD with preview deployments
- **📱 Responsive Design**: Mobile-first approach with modern CSS techniques

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/) - Static site generator with modern architecture
- **Language**: TypeScript for type safety and better developer experience
- **Styling**: CSS with modern features and responsive design
- **Code Quality**: ESLint + Prettier + Husky for automated code formatting
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Hosting**: Cloudflare Pages with global CDN and automatic HTTPS
- **Version Control**: Git with branch protection and pull request workflows

## 📋 Prerequisites

Before setting up this project, ensure you have:

- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **Git** configured with your GitHub account
- **GitHub account** with repository access
- **Cloudflare account** (free tier sufficient)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/christag/portfolio-site.git
cd portfolio-site

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Development Commands

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

# Git Hooks
npm run prepare      # Set up Husky git hooks (runs automatically)
```

## 🏗️ Project Structure

```text
/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD pipeline
├── public/
│   ├── favicon.svg             # Site favicon
│   ├── robots.txt              # Search engine guidelines
│   └── ...                     # Static assets
├── src/
│   ├── components/
│   │   └── SEO.astro           # Reusable SEO component
│   ├── layouts/
│   │   └── Layout.astro        # Base page layout
│   └── pages/
│       ├── index.astro         # Homepage
│       └── 404.astro           # Custom 404 page
├── astro.config.mjs            # Astro configuration
├── eslint.config.js            # ESLint configuration (flat config)
├── .prettierrc.cjs             # Prettier configuration
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## 🔧 Configuration

### Environment Setup

1. **Update Site URL**: Edit `astro.config.mjs` and replace `christagliaferro.com` with your actual domain
2. **SEO Configuration**: Update default titles and descriptions in `src/components/SEO.astro`
3. **Branding**: Customize colors, fonts, and content to match your brand

### Cloudflare Pages Setup

1. **Connect Repository**: Link your GitHub repository to Cloudflare Pages
2. **Build Settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (leave empty)
3. **Custom Domain**: Configure your domain in Cloudflare Pages dashboard

## 🚀 Deployment

### Automatic Deployment

Every push to `main` branch automatically:

1. ✅ **Runs quality checks** (ESLint, Prettier)
2. ✅ **Builds the site** (Astro static generation)
3. ✅ **Deploys to Cloudflare Pages** (global CDN)
4. ✅ **Updates live website** (zero downtime)

### Preview Deployments

Every pull request automatically creates a preview deployment:

1. 🔍 **Isolated environment** for testing changes
2. 🔗 **Unique preview URL** shared in PR comments
3. ✅ **Same build process** as production
4. 🧹 **Automatic cleanup** when PR is merged/closed

## 👥 Development Workflow

### Creating Features

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make your changes
# ... edit files ...

# 3. Commit changes (triggers pre-commit hooks)
git add .
git commit -m "feat: add new feature"

# 4. Push and create PR
git push origin feature/new-feature
# Create pull request on GitHub

# 5. Review preview deployment
# Check preview URL in PR comments

# 6. Merge when ready
# Automatic deployment to production
```

### Code Quality Standards

- **ESLint**: Enforces code quality and accessibility rules
- **Prettier**: Maintains consistent code formatting
- **Husky**: Prevents commits with quality issues
- **TypeScript**: Provides type safety and better IDE support
- **Branch Protection**: Requires PR reviews and passing checks

## 🎯 Performance Optimizations

This website is optimized for exceptional performance:

- **Static Generation**: Pre-built HTML for instant loading
- **Minimal JavaScript**: Only essential JS shipped to browsers
- **Image Optimization**: Automatic image compression and modern formats
- **Global CDN**: Content served from edge locations worldwide
- **Lighthouse Score**: Consistently achieves 95+ scores across all metrics

## ♿ Accessibility Features

Accessibility is a core value, implemented through:

- **Semantic HTML**: Proper heading hierarchy and landmark elements
- **ARIA Labels**: Screen reader support for interactive elements
- **Color Contrast**: WCAG AA compliant color combinations
- **Keyboard Navigation**: Full functionality without mouse
- **Focus Management**: Clear focus indicators and logical tab order
- **Alt Text**: Descriptive alternative text for all images

## 🔍 SEO Features

Optimized for search engine visibility:

- **Meta Tags**: Comprehensive Open Graph and Twitter Card support
- **Structured Data**: Schema.org markup for rich snippets
- **Sitemap**: Automatically generated XML sitemap
- **Robots.txt**: Search engine crawling guidelines
- **Canonical URLs**: Prevents duplicate content issues
- **Performance**: Fast loading times improve search rankings

## 🤝 Contributing

### For Team Members

1. **Clone and setup** the repository (see Quick Start)
2. **Create feature branches** for all changes
3. **Follow code quality standards** (enforced by tools)
4. **Write descriptive commit messages** using conventional commits
5. **Test thoroughly** using preview deployments
6. **Request reviews** before merging to main

### Code Style

- Use **TypeScript** for type safety
- Follow **ESLint rules** (automatically enforced)
- Use **Prettier formatting** (automatically applied)
- Write **semantic HTML** with accessibility in mind
- Include **alt text** for images
- Test **keyboard navigation** for interactive elements

## 🐛 Troubleshooting

### Common Issues

**Build Failures**:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**ESLint Errors**:

```bash
# Auto-fix most issues
npm run lint:fix

# Check remaining issues
npm run lint
```

**Preview Deployment Issues**:

- Check GitHub Actions logs for build errors
- Verify all environment variables are set
- Ensure branch is pushed to GitHub

### Getting Help

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check Astro docs for framework questions
- **Contact**: Reach out via the contact form on the website

## 📄 License

This project is private and proprietary. All rights reserved.

## 🙏 Acknowledgments

- **Astro Team**: For the amazing static site generator
- **Cloudflare**: For reliable hosting and global CDN
- **GitHub**: For version control and CI/CD platform
- **Open Source Community**: For the tools and libraries that make this possible

---

**Built with ❤️ by Tags** | [Website](https://www.christagliaferro.com) | [LinkedIn](https://www.linkedin.com/in/christophertagliaferro/)
