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
  tags: string[];
  featured: boolean;
  draft: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    openGraph: {
      title: string;
      description: string;
      type: string;
      image?: string;
    };
    twitter: {
      card: string;
      title: string;
      description: string;
      image?: string;
    };
  };
  hero: {
    title: string;
    subtitle: string;
    animation: string;
    background: string;
  };
  profile: {
    name: string;
    title: string;
    location: string;
    status: string;
    personality: Record<string, string>;
  };
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
    portfolio?: string;
  };
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
