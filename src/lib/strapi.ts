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
  primaryImage?: any;
  gallery?: any[];
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

class StrapiAPI {
  private baseURL: string;
  private apiToken?: string;

  /** Simple in-memory cache: key -> { expiry: epochMs, data: any, etag?: string } */
  private cache: Map<string, { expiry: number; data: any; etag?: string }> =
    new Map();

  /** Persistent cache for build-time data */
  private buildCache: Map<
    string,
    { expiry: number; data: any; etag?: string }
  > = new Map();

  /**
   * Default cache TTL in milliseconds. Can be overridden with env STRAPI_CACHE_TTL_MS.
   * For build-time fetches this avoids repetitive calls; at runtime it keeps data
   * reasonably fresh while limiting requests.
   */
  private cacheTTL: number =
    Number(import.meta.env.STRAPI_CACHE_TTL_MS) || 5 * 60 * 1000; // 5 minutes

  /** Extended cache TTL for build-time operations (longer for static generation) */
  private buildCacheTTL: number =
    Number(import.meta.env.BUILD_CACHE_TTL_MS) || 60 * 60 * 1000; // 1 hour

  /** Whether to use build-time caching */
  private enableBuildCache: boolean =
    import.meta.env.ENABLE_BUILD_CACHE !== 'false';

  constructor() {
    // Use environment variables with fallbacks
    this.baseURL = import.meta.env.STRAPI_URL || 'http://localhost:1337';
    this.apiToken = import.meta.env.STRAPI_API_TOKEN;

    // Initialize persistent cache if in build environment
    if (
      this.enableBuildCache &&
      typeof process !== 'undefined' &&
      process.env.NODE_ENV === 'production'
    ) {
      this.initializePersistentCache();
    }
  }

  /**
   * Initialize persistent cache for build-time optimization
   */
  private async initializePersistentCache(): Promise<void> {
    try {
      // In a real implementation, you might load from file system or Redis
      // For now, we'll use the in-memory cache with longer TTL for build
      console.log('🏗️ Build-time cache initialized');
    } catch (error) {
      console.warn('Failed to initialize persistent cache:', error);
    }
  }

  /**
   * Generate cache key with query parameters for better cache granularity
   */
  private generateCacheKey(endpoint: string, options?: RequestInit): string {
    const url = new URL(`${this.baseURL}/api${endpoint}`);
    const params = url.searchParams.toString();
    const method = options?.method || 'GET';
    return `${method}:${endpoint}${params ? '?' + params : ''}`;
  }

  /**
   * Check if we're in build context for extended caching
   */
  private isBuildContext(): boolean {
    return (
      (this.enableBuildCache &&
        typeof process !== 'undefined' &&
        process.env.NODE_ENV === 'production') ||
      (typeof import.meta.env !== 'undefined' && import.meta.env.BUILD)
    );
  }

  /**
   * Get appropriate cache and TTL based on context
   */
  private getCacheConfig(): { cache: Map<string, any>; ttl: number } {
    if (this.isBuildContext()) {
      return { cache: this.buildCache, ttl: this.buildCacheTTL };
    }
    return { cache: this.cache, ttl: this.cacheTTL };
  }

  private async fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const isGet = !options.method || options.method === 'GET';
    const cacheKey = this.generateCacheKey(endpoint, options);
    const { cache, ttl } = this.getCacheConfig();

    // Check cache for GET requests
    if (isGet) {
      const cached = cache.get(cacheKey);
      if (cached && cached.expiry > Date.now()) {
        console.log(`🎯 Cache hit for: ${cacheKey}`);
        return cached.data as T;
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

    // Add conditional request headers if we have cached ETag
    if (isGet) {
      const cached = cache.get(cacheKey);
      if (cached?.etag) {
        headers['If-None-Match'] = cached.etag;
      }
    }

    try {
      console.log(`🌐 Fetching: ${url}`);
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 304 Not Modified responses
      if (response.status === 304) {
        const cached = cache.get(cacheKey);
        if (cached) {
          console.log(
            `♻️ Content not modified, using cached data for: ${cacheKey}`
          );
          // Extend cache expiry
          cached.expiry = Date.now() + ttl;
          return cached.data as T;
        }
      }

      if (!response.ok) {
        throw new Error(
          `Strapi API error: ${response.status} ${response.statusText}`
        );
      }

      const json = (await response.json()) as T;

      // Store in cache if eligible
      if (isGet) {
        const etag = response.headers.get('ETag');
        const newExpiry = Date.now() + ttl;
        cache.set(cacheKey, {
          expiry: newExpiry,
          data: json,
          etag: etag || undefined,
        });

        console.log(`💾 Cached response for: ${cacheKey} (TTL: ${ttl}ms)`);
      }

      return json;
    } catch (error) {
      console.error(`Failed to fetch from Strapi API: ${url}`, error);

      // Return stale cache if available during errors
      if (isGet) {
        const cached = cache.get(cacheKey);
        if (cached) {
          console.warn(`⚠️ Using stale cache due to fetch error: ${cacheKey}`);
          return cached.data as T;
        }
      }

      throw error;
    }
  }

  /**
   * Invalidate cache for specific endpoints or patterns
   */
  public invalidateCache(pattern?: string): void {
    const { cache } = this.getCacheConfig();

    if (!pattern) {
      // Clear all cache
      cache.clear();
      console.log('🗑️ All cache cleared');
      return;
    }

    // Clear cache entries matching pattern
    const keysToDelete: string[] = [];
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => cache.delete(key));
    console.log(
      `🗑️ Cleared ${keysToDelete.length} cache entries matching: ${pattern}`
    );
  }

  /**
   * Preload critical data during build time
   */
  public async preloadCriticalData(): Promise<void> {
    if (!this.isBuildContext()) return;

    console.log('🚀 Preloading critical data for build...');

    try {
      // Preload data that's needed across multiple pages
      await Promise.allSettled([
        this.getAuthorProfile(),
        this.getSiteSettings(),
        this.getServices(),
        this.getPortfolioItems(),
        this.getFeaturedBioArticle(),
      ]);

      console.log('✅ Critical data preloaded successfully');
    } catch (error) {
      console.warn('⚠️ Some critical data failed to preload:', error);
    }
  }

  /**
   * Get cache statistics for monitoring
   */
  public getCacheStats(): { size: number; hitRate?: number } {
    const { cache } = this.getCacheConfig();
    return {
      size: cache.size,
      // In a real implementation, you'd track hit/miss rates
    };
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
