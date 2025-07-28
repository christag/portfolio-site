interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface AuthorProfile {
  id: number;
  fullName: string;
  bio?: string;
  avatar?: any;
  role: string;
  location: string;
  status: string;
  socialLinks?: SocialLink[];
  contactInfo?: ContactInfo;
  timeline?: TimelineEvent[];
}

interface SiteSettings {
  id: number;
  siteTitle: string;
  siteDescription: string;
  defaultSEO?: SEOData;
  globalSocialLinks?: SocialLink[];
  globalContactInfo?: ContactInfo;
  brandColors?: any;
  logos?: any[];
  defaultImages?: any[];
  defaultHero?: HeroData;
}

interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
  displayText?: string;
}

interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  timezone?: string;
  availability?: string;
  preferredContact?: string;
}

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: any;
  twitterCard?: string;
  canonical?: string;
}

interface HeroData {
  title: string;
  subtitle?: string;
  animation?: string;
  backgroundImage?: any;
  backgroundType?: string;
  ctaText?: string;
  ctaUrl?: string;
}

interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
  period?: string;
  achievements?: any;
  media?: any[];
  isActive?: boolean;
  company?: string;
  location?: string;
}

interface BioArticle {
  id: number;
  documentId: string;
  title: string;
  description: string;
  content: string;
  publishDate: string;
  tags?: string;
  featured: boolean;
  seoOverride?: SEOData;
  heroOverride?: HeroData;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface ServiceTier {
  name: string;
  priceLow?: number;
  priceHigh?: number;
  deliverables?: string[];
}

interface Service {
  id: number;
  documentId: string;
  title: string;
  description: string;
  category?: string;
  featureHighlights?: string[];
  tiers?: ServiceTier[];
  contactMethod?: string;
  isPinned?: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface PortfolioCollaborator {
  name: string;
  role?: string;
  url?: string;
  avatar?: any;
}

interface PortfolioTestimonial {
  quote: string;
  author: string;
  authorTitle?: string;
  company?: string;
  rating?: number;
}

interface Portfolio {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  mediaType:
    | 'code'
    | 'video'
    | 'blog'
    | 'audio'
    | 'image'
    | 'design'
    | 'presentation';
  tags?: string;
  technologies?: string;
  featuredImage?: any;
  gallery?: any[];
  demoUrl?: string;
  repositoryUrl?: string;
  externalUrl?: string;
  featured: boolean;
  completed: boolean;
  startDate?: string;
  endDate?: string;
  client?: string;
  collaborators?: PortfolioCollaborator[];
  testimonials?: PortfolioTestimonial[];
  priority?: number;
  seoOverride?: SEOData;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
  totalRequests: number;
}

// Cache configuration for different content types
const CACHE_TTL = {
  PORTFOLIO: parseInt(import.meta.env.STRAPI_CACHE_TTL_MS || '600000'), // 10 minutes default
  SERVICES: parseInt(import.meta.env.STRAPI_CACHE_TTL_MS || '1800000'), // 30 minutes default
  BIO_ARTICLES: parseInt(import.meta.env.STRAPI_CACHE_TTL_MS || '900000'), // 15 minutes default
  PROFILE: parseInt(import.meta.env.STRAPI_CACHE_TTL_MS || '1200000'), // 20 minutes default
  SETTINGS: parseInt(import.meta.env.STRAPI_CACHE_TTL_MS || '3600000'), // 1 hour default
} as const;

class StrapiAPI {
  private baseURL: string;
  private apiToken?: string;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private cacheStats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    hitRate: 0,
    totalRequests: 0,
  };
  private cacheEnabled: boolean;

  constructor() {
    // Use environment variables with fallbacks
    // Use PUBLIC_ prefixed vars for client-side, regular vars for server-side
    this.baseURL =
      import.meta.env.PUBLIC_STRAPI_URL ||
      import.meta.env.STRAPI_URL ||
      'http://localhost:1337';
    this.apiToken = import.meta.env.STRAPI_API_TOKEN;
    this.cacheEnabled = import.meta.env.ENABLE_BUILD_CACHE !== 'false';

    // Initialize cache cleanup interval (run every 5 minutes)
    if (this.cacheEnabled && typeof setInterval !== 'undefined') {
      setInterval(() => this.cleanupExpiredCache(), 5 * 60 * 1000);
    }
  }

  /**
   * Generate cache key from endpoint and options
   */
  private generateCacheKey(endpoint: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const body = options?.body || '';
    return `${method}:${endpoint}:${body}`;
  }

  /**
   * Check if cache entry is expired
   */
  private isCacheEntryExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Get data from cache if available and not expired
   */
  private getCachedData<T>(key: string): T | null {
    if (!this.cacheEnabled) return null;

    const entry = this.cache.get(key);
    if (!entry) {
      this.cacheStats.misses++;
      this.cacheStats.totalRequests++;
      this.updateHitRate();
      return null;
    }

    if (this.isCacheEntryExpired(entry)) {
      this.cache.delete(key);
      this.cacheStats.misses++;
      this.cacheStats.totalRequests++;
      this.updateHitRate();
      return null;
    }

    this.cacheStats.hits++;
    this.cacheStats.totalRequests++;
    this.updateHitRate();
    console.log(`🎯 Cache HIT for: ${key}`);
    return entry.data;
  }

  /**
   * Store data in cache with TTL
   */
  private setCachedData<T>(key: string, data: T, ttl: number): void {
    if (!this.cacheEnabled) return;

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      key,
    };

    this.cache.set(key, entry);
    this.cacheStats.size = this.cache.size;
    console.log(`💾 Cached data for: ${key} (TTL: ${ttl}ms)`);
  }

  /**
   * Update cache hit rate
   */
  private updateHitRate(): void {
    this.cacheStats.hitRate =
      this.cacheStats.totalRequests > 0
        ? (this.cacheStats.hits / this.cacheStats.totalRequests) * 100
        : 0;
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupExpiredCache(): void {
    if (!this.cacheEnabled) return;

    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.cacheStats.size = this.cache.size;
      console.log(`🧹 Cleaned up ${cleanedCount} expired cache entries`);
    }
  }

  /**
   * Invalidate cache by pattern or specific key
   */
  public invalidateCache(pattern?: string): void {
    if (!this.cacheEnabled) return;

    if (!pattern) {
      // Clear all cache
      const size = this.cache.size;
      this.cache.clear();
      this.cacheStats.size = 0;
      console.log(`🗑️ Cleared all cache (${size} entries)`);
      return;
    }

    // Clear cache entries matching pattern
    let deletedCount = 0;
    for (const [key] of this.cache.entries()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        deletedCount++;
      }
    }

    this.cacheStats.size = this.cache.size;
    console.log(
      `🗑️ Invalidated ${deletedCount} cache entries matching: ${pattern}`
    );
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): CacheStats {
    return { ...this.cacheStats };
  }

  /**
   * Preload critical data for build-time optimization
   */
  public async preloadCriticalData(): Promise<void> {
    if (!this.cacheEnabled) return;

    console.log('🚀 Preloading critical data for build-time optimization...');

    try {
      await Promise.all([
        this.getPortfolioItems(),
        this.getServices(),
        this.getSiteSettings(),
        this.getAuthorProfile(),
      ]);
      console.log('✅ Critical data preloaded successfully');
    } catch (error) {
      console.warn('⚠️ Some critical data failed to preload:', error);
    }
  }

  private async fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Generate cache key
    const cacheKey = this.generateCacheKey(endpoint, options);

    // Try to get from cache first (only for GET requests)
    if (!options.method || options.method === 'GET') {
      const cachedData = this.getCachedData<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    const url = `${this.baseURL}/api${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add authorization header if token is available
    if (this.apiToken) {
      headers.Authorization = `Bearer ${this.apiToken}`;
    }

    try {
      console.log(`🌐 Fetching from API: ${endpoint}`);
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(
          `Strapi API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Cache successful GET responses with appropriate TTL
      if (!options.method || options.method === 'GET') {
        let ttl = CACHE_TTL.PORTFOLIO; // Default TTL

        // Set TTL based on endpoint
        if (endpoint.includes('/portfolios')) {
          ttl = CACHE_TTL.PORTFOLIO;
        } else if (endpoint.includes('/services')) {
          ttl = CACHE_TTL.SERVICES;
        } else if (endpoint.includes('/bio-articles')) {
          ttl = CACHE_TTL.BIO_ARTICLES;
        } else if (endpoint.includes('/profile')) {
          ttl = CACHE_TTL.PROFILE;
        } else if (endpoint.includes('/settings')) {
          ttl = CACHE_TTL.SETTINGS;
        }

        this.setCachedData(cacheKey, data, ttl);
      }

      return data;
    } catch (error) {
      console.error(`Failed to fetch from Strapi API: ${url}`, error);
      throw error;
    }
  }

  // Get Author Profile (Single Type)
  async getAuthorProfile(): Promise<AuthorProfile | null> {
    try {
      const response = await this.fetchAPI<StrapiResponse<AuthorProfile>>(
        '/profile?populate=*'
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch author profile:', error);
      return null;
    }
  }

  // Get Site Settings (Single Type)
  async getSiteSettings(): Promise<SiteSettings | null> {
    try {
      const response = await this.fetchAPI<StrapiResponse<SiteSettings>>(
        '/settings?populate=*'
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch site settings:', error);
      return null;
    }
  }

  // Get all bio articles
  async getBioArticles(): Promise<BioArticle[]> {
    const response = await this.fetchAPI<StrapiResponse<BioArticle[]>>(
      '/bio-articles?populate=*&sort=publishDate:desc'
    );
    return response.data;
  }

  // Get a specific bio article by documentId (Strapi v5 uses documentId instead of id)
  async getBioArticle(documentId: string): Promise<BioArticle | null> {
    try {
      const response = await this.fetchAPI<StrapiResponse<BioArticle>>(
        `/bio-articles/${documentId}?populate=*`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch bio article ${documentId}:`, error);
      return null;
    }
  }

  // Get the featured bio article (for the main I Am page)
  async getFeaturedBioArticle(): Promise<BioArticle | null> {
    try {
      const response = await this.fetchAPI<StrapiResponse<BioArticle[]>>(
        '/bio-articles?filters[featured][$eq]=true&populate=*&sort=publishDate:desc&pagination[limit]=1'
      );
      return response.data[0] || null;
    } catch (error) {
      console.error('Failed to fetch featured bio article:', error);
      return null;
    }
  }

  // Get merged content with automated field population
  async getMergedBioContent(): Promise<any> {
    try {
      const [authorProfile, siteSettings, featuredArticle] = await Promise.all([
        this.getAuthorProfile(),
        this.getSiteSettings(),
        this.getFeaturedBioArticle(),
      ]);

      if (!featuredArticle) {
        throw new Error('No featured bio article found');
      }

      // Merge data with override hierarchy: Article > Author > Site Settings
      const mergedData = {
        // Article-specific data
        title: featuredArticle.title,
        description: featuredArticle.description,
        content: featuredArticle.content,
        publishDate: new Date(featuredArticle.publishDate),
        tags: featuredArticle.tags
          ? featuredArticle.tags.split(',').map((tag) => tag.trim())
          : [],
        featured: featuredArticle.featured,

        // Author data (with article overrides)
        author: authorProfile?.fullName || 'Christopher Tagliaferro',

        // SEO data (Article override > Site Settings default)
        seo: {
          title:
            featuredArticle.seoOverride?.title ||
            siteSettings?.defaultSEO?.title ||
            siteSettings?.siteTitle ||
            featuredArticle.title,
          description:
            featuredArticle.seoOverride?.description ||
            siteSettings?.defaultSEO?.description ||
            siteSettings?.siteDescription ||
            featuredArticle.description,
          keywords:
            featuredArticle.seoOverride?.keywords
              ?.split(',')
              .map((kw) => kw.trim()) ||
            siteSettings?.defaultSEO?.keywords
              ?.split(',')
              .map((kw) => kw.trim()) ||
            [],
          openGraph: {
            title:
              featuredArticle.seoOverride?.ogTitle ||
              siteSettings?.defaultSEO?.ogTitle ||
              featuredArticle.title,
            description:
              featuredArticle.seoOverride?.ogDescription ||
              siteSettings?.defaultSEO?.ogDescription ||
              featuredArticle.description,
            type: 'profile',
            image:
              featuredArticle.seoOverride?.ogImage ||
              siteSettings?.defaultSEO?.ogImage ||
              '/og-bio.jpg',
          },
          twitter: {
            card:
              featuredArticle.seoOverride?.twitterCard ||
              siteSettings?.defaultSEO?.twitterCard ||
              'summary_large_image',
            title:
              featuredArticle.seoOverride?.ogTitle ||
              siteSettings?.defaultSEO?.ogTitle ||
              featuredArticle.title,
            description:
              featuredArticle.seoOverride?.ogDescription ||
              siteSettings?.defaultSEO?.ogDescription ||
              featuredArticle.description,
            image:
              featuredArticle.seoOverride?.ogImage ||
              siteSettings?.defaultSEO?.ogImage ||
              '/og-bio.jpg',
          },
        },

        // Hero data (Article override > Site Settings default)
        hero: {
          title:
            featuredArticle.heroOverride?.title ||
            siteSettings?.defaultHero?.title ||
            featuredArticle.title,
          subtitle:
            featuredArticle.heroOverride?.subtitle ||
            siteSettings?.defaultHero?.subtitle ||
            'Program Manager. Systems Thinker. Optimistic Realist.',
          animation:
            featuredArticle.heroOverride?.animation ||
            siteSettings?.defaultHero?.animation ||
            'particle-name',
          background:
            featuredArticle.heroOverride?.backgroundType ||
            siteSettings?.defaultHero?.backgroundType ||
            'gradient-chaos',
        },

        // Profile data from Author Profile
        profile: {
          name: authorProfile?.fullName || 'Christopher Tagliaferro',
          title: authorProfile?.role || 'Senior Technical Program Manager',
          location: authorProfile?.location || 'Levittown, NY',
          status: authorProfile?.status || 'Open to Opportunities',
          personality: {
            professional: 'Architect of sustainable transformations',
            'anti-corporate':
              'Challenger of inefficient systems and corporate absurdity',
            technical: 'Deep systems thinker and problem solver',
            creative: 'Design-minded approach to complex challenges',
            pragmatic: 'Results-focused with attention to detail',
          },
        },

        // Social links (Author Profile > Site Settings global)
        social: {
          linkedin:
            authorProfile?.socialLinks?.find(
              (link) => link.platform === 'LinkedIn'
            )?.url ||
            siteSettings?.globalSocialLinks?.find(
              (link) => link.platform === 'LinkedIn'
            )?.url,
          email:
            authorProfile?.contactInfo?.email ||
            siteSettings?.globalContactInfo?.email,
          portfolio:
            authorProfile?.socialLinks?.find(
              (link) => link.platform === 'Portfolio'
            )?.url ||
            siteSettings?.globalSocialLinks?.find(
              (link) => link.platform === 'Portfolio'
            )?.url,
        },
      };

      return mergedData;
    } catch (error) {
      console.error('Failed to fetch merged bio content:', error);
      throw error;
    }
  }

  // Get all services
  async getServices(): Promise<Service[]> {
    try {
      const response = (await this.fetchAPI(
        '/services?populate=*&sort=isPinned:desc,createdAt:desc'
      )) as StrapiResponse<Service[]>;
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch services:', error);
      return [];
    }
  }

  // Get single service by slug
  async getServiceBySlug(slug: string): Promise<Service | null> {
    try {
      const response = (await this.fetchAPI(
        `/services?filters[slug][$eq]=${slug}&populate=*`
      )) as StrapiResponse<Service[]>;
      return response.data?.[0] || null;
    } catch (error) {
      console.error(`Failed to fetch service with slug ${slug}:`, error);
      return null;
    }
  }

  // Get services by category
  async getServicesByCategory(category: string): Promise<Service[]> {
    try {
      const response = (await this.fetchAPI(
        `/services?filters[category][$eq]=${category}&populate=*&sort=isPinned:desc,createdAt:desc`
      )) as StrapiResponse<Service[]>;
      return response.data || [];
    } catch (error) {
      console.error(
        `Failed to fetch services for category ${category}:`,
        error
      );
      return [];
    }
  }

  // Get pinned/featured services
  async getFeaturedServices(): Promise<Service[]> {
    try {
      const response = (await this.fetchAPI(
        '/services?filters[isPinned][$eq]=true&populate=*&sort=createdAt:desc'
      )) as StrapiResponse<Service[]>;
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch featured services:', error);
      return [];
    }
  }

  // Portfolio Methods

  // Get all portfolio items
  async getPortfolioItems(): Promise<Portfolio[]> {
    try {
      const response = await this.fetchAPI<StrapiResponse<Portfolio[]>>(
        '/portfolios?populate=*&sort=priority:asc,createdAt:desc'
      );
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch portfolio items:', error);
      return [];
    }
  }

  // Get a specific portfolio item by documentId
  async getPortfolioItem(documentId: string): Promise<Portfolio | null> {
    try {
      const response = await this.fetchAPI<StrapiResponse<Portfolio>>(
        `/portfolios/${documentId}?populate=*`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch portfolio item ${documentId}:`, error);
      return null;
    }
  }

  // Get portfolio items by media type
  async getPortfolioByMediaType(mediaType: string): Promise<Portfolio[]> {
    try {
      const response = await this.fetchAPI<StrapiResponse<Portfolio[]>>(
        `/portfolios?filters[mediaType][$eq]=${mediaType}&populate=*&sort=priority:asc,createdAt:desc`
      );
      return response.data || [];
    } catch (error) {
      console.error(
        `Failed to fetch portfolio items for media type ${mediaType}:`,
        error
      );
      return [];
    }
  }

  // Get featured portfolio items
  async getFeaturedPortfolio(): Promise<Portfolio[]> {
    try {
      const response = await this.fetchAPI<StrapiResponse<Portfolio[]>>(
        '/portfolios?filters[featured][$eq]=true&populate=*&sort=priority:asc,createdAt:desc'
      );
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch featured portfolio items:', error);
      return [];
    }
  }

  // Get portfolio items by tag
  async getPortfolioByTag(tag: string): Promise<Portfolio[]> {
    try {
      const response = await this.fetchAPI<StrapiResponse<Portfolio[]>>(
        `/portfolios?filters[tags][$contains]=${encodeURIComponent(tag)}&populate=*&sort=priority:asc,createdAt:desc`
      );
      return response.data || [];
    } catch (error) {
      console.error(`Failed to fetch portfolio items for tag ${tag}:`, error);
      return [];
    }
  }

  // Health check for Strapi connection
  async healthCheck(): Promise<boolean> {
    try {
      console.log(`🔍 Testing Strapi connection to: ${this.baseURL}`);
      console.log(`🔑 API Token available: ${this.apiToken ? 'YES' : 'NO'}`);

      // Try multiple endpoints to verify connectivity
      // Start with simpler endpoints that are more likely to work
      const endpoints = [
        '/services?pagination[limit]=1', // Try the services endpoint first since that's what we need
        '/bio-articles?pagination[limit]=1', // Try bio articles since we know bio page works
        '/profile', // Finally try profile (the original check)
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`📡 Testing endpoint: ${this.baseURL}/api${endpoint}`);

          const response = await fetch(`${this.baseURL}/api${endpoint}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(this.apiToken
                ? { Authorization: `Bearer ${this.apiToken}` }
                : {}),
            },
          });

          console.log(
            `📊 Response status: ${response.status} ${response.statusText}`
          );

          if (response.ok) {
            const data = await response.json();
            console.log(
              `✅ Strapi health check passed using endpoint: ${endpoint}`
            );
            console.log(
              `📄 Sample response:`,
              JSON.stringify(data).substring(0, 200)
            );
            return true;
          } else {
            const errorText = await response.text();
            console.warn(`⚠️ Health check failed for endpoint ${endpoint}:`, {
              status: response.status,
              statusText: response.statusText,
              error: errorText.substring(0, 500),
            });
          }
        } catch (error) {
          console.warn(`❌ Network error for endpoint ${endpoint}:`, {
            message: error instanceof Error ? error.message : 'Unknown error',
            name: error instanceof Error ? error.name : 'Unknown',
          });
          // Continue to next endpoint
        }
      }

      console.error('💥 All health check endpoints failed');
      console.error('🔧 Debug info:', {
        baseURL: this.baseURL,
        hasToken: !!this.apiToken,
        tokenPrefix: this.apiToken
          ? this.apiToken.substring(0, 8) + '...'
          : 'none',
      });

      return false;
    } catch (error) {
      console.error('🚨 Strapi health check failed with error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        baseURL: this.baseURL,
      });
      return false;
    }
  }
}

// Export singleton instance
export const strapiAPI = new StrapiAPI();

// Export types for use in other files
export type {
  BioArticle,
  AuthorProfile,
  SiteSettings,
  Service,
  ServiceTier,
  Portfolio,
  PortfolioCollaborator,
  PortfolioTestimonial,
  SocialLink,
  ContactInfo,
  SEOData,
  HeroData,
  TimelineEvent,
  StrapiResponse,
};
