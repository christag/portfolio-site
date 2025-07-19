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

class StrapiAPI {
  private baseURL: string;
  private apiToken?: string;

  constructor() {
    // Use environment variables with fallbacks
    this.baseURL = import.meta.env.STRAPI_URL || 'http://localhost:1337';
    this.apiToken = import.meta.env.STRAPI_API_TOKEN;
  }

  private async fetchAPI<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
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
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(
          `Strapi API error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch from Strapi API: ${url}`, error);
      throw error;
    }
  }

  // Get Author Profile (Single Type)
  async getAuthorProfile(): Promise<AuthorProfile | null> {
    try {
      const response = await this.fetchAPI<StrapiResponse<AuthorProfile>>(
        '/author-profile?populate=*'
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
        '/site-settings?populate=*'
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

  // Get a specific bio article by ID
  async getBioArticle(id: string): Promise<BioArticle | null> {
    try {
      const response = await this.fetchAPI<StrapiResponse<BioArticle>>(
        `/bio-articles/${id}?populate=*`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch bio article ${id}:`, error);
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

  // Health check for Strapi connection
  async healthCheck(): Promise<boolean> {
    try {
      await this.fetchAPI('/author-profile');
      return true;
    } catch (error) {
      console.error('Strapi health check failed:', error);
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
  SocialLink,
  ContactInfo,
  SEOData,
  HeroData,
  TimelineEvent,
  StrapiResponse,
};
