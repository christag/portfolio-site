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

interface StrapiArticle {
  id: number;
  documentId: string;
  title: string;
  description: string;
  content: string;
  publishDate: string;
  author: string;
  tags: string;
  featured: boolean;
  draft: boolean;
  heroTitle: string;
  heroSubtitle: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  profileName: string;
  profileTitle: string;
  profileLocation: string;
  profileStatus: string;
  socialLinkedin?: string;
  socialEmail?: string;
  socialPortfolio?: string;
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

  // Get all bio articles
  async getBioArticles(): Promise<StrapiArticle[]> {
    const response = await this.fetchAPI<StrapiResponse<StrapiArticle[]>>(
      '/bio-articles?populate=*&sort=publishDate:desc'
    );
    return response.data;
  }

  // Get a specific bio article by ID
  async getBioArticle(id: string): Promise<StrapiArticle | null> {
    try {
      const response = await this.fetchAPI<StrapiResponse<StrapiArticle>>(
        `/bio-articles/${id}?populate=*`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch bio article ${id}:`, error);
      return null;
    }
  }

  // Get the featured bio article (for the main I Am page)
  async getFeaturedBioArticle(): Promise<StrapiArticle | null> {
    try {
      const response = await this.fetchAPI<StrapiResponse<StrapiArticle[]>>(
        '/bio-articles?filters[featured][$eq]=true&filters[draft][$eq]=false&populate=*&sort=publishDate:desc&pagination[limit]=1'
      );
      return response.data[0] || null;
    } catch (error) {
      console.error('Failed to fetch featured bio article:', error);
      return null;
    }
  }

  // Health check for Strapi connection
  async healthCheck(): Promise<boolean> {
    try {
      await this.fetchAPI('/bio-articles?pagination[limit]=1');
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
export type { StrapiArticle, StrapiResponse };
