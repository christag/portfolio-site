import { getCollection } from 'astro:content';
import { strapiAPI, type StrapiArticle } from './strapi';

// Transform Strapi article to match our local content structure
function transformStrapiArticle(article: StrapiArticle) {
  return {
    id: article.documentId,
    slug: article.documentId,
    data: {
      title: article.title,
      description: article.description,
      publishDate: new Date(article.publishDate),
      author: article.author,
      tags: article.tags
        ? article.tags.split(',').map((tag) => tag.trim())
        : [],
      featured: article.featured,
      draft: article.draft,
      seo: {
        title: article.seoTitle,
        description: article.seoDescription,
        keywords: article.seoKeywords
          ? article.seoKeywords.split(',').map((kw) => kw.trim())
          : [],
        openGraph: {
          title: article.seoTitle,
          description: article.seoDescription,
          type: 'profile',
          image: '/og-bio.jpg',
        },
        twitter: {
          card: 'summary_large_image',
          title: article.seoTitle,
          description: article.seoDescription,
          image: '/og-bio.jpg',
        },
      },
      hero: {
        title: article.heroTitle,
        subtitle: article.heroSubtitle,
        animation: 'particle-name',
        background: 'gradient-chaos',
      },
      profile: {
        name: article.profileName,
        title: article.profileTitle,
        location: article.profileLocation,
        status: article.profileStatus,
        personality: {
          professional: 'Architect of sustainable transformations',
          'anti-corporate':
            'Challenger of inefficient systems and corporate absurdity',
          technical: 'Deep systems thinker and problem solver',
          creative: 'Design-minded approach to complex challenges',
          pragmatic: 'Results-focused with attention to detail',
        },
      },
      social: {
        linkedin: article.socialLinkedin,
        email: article.socialEmail,
        portfolio: article.socialPortfolio,
      },
    },
    body: article.content,
    render: async () => ({
      Content: () => ({
        __html: article.content,
      }),
    }),
  };
}

// Content fetching strategies
export class ContentManager {
  private static instance: ContentManager;
  private strapiAvailable: boolean | null = null;

  static getInstance(): ContentManager {
    if (!ContentManager.instance) {
      ContentManager.instance = new ContentManager();
    }
    return ContentManager.instance;
  }

  private async checkStrapiAvailability(): Promise<boolean> {
    if (this.strapiAvailable !== null) {
      return this.strapiAvailable;
    }

    try {
      this.strapiAvailable = await strapiAPI.healthCheck();
      console.log(
        `Strapi availability: ${this.strapiAvailable ? 'Available' : 'Unavailable'}`
      );
      return this.strapiAvailable;
    } catch (error) {
      console.warn(
        'Strapi health check failed, falling back to local content:',
        error
      );
      this.strapiAvailable = false;
      return false;
    }
  }

  // Get bio content with fallback strategy
  async getBioContent() {
    const isStrapiAvailable = await this.checkStrapiAvailability();

    if (isStrapiAvailable) {
      try {
        console.log('Fetching bio content from Strapi...');
        const strapiArticle = await strapiAPI.getFeaturedBioArticle();

        if (strapiArticle) {
          console.log('Successfully fetched bio content from Strapi');
          return transformStrapiArticle(strapiArticle);
        } else {
          console.warn(
            'No featured bio article found in Strapi, falling back to local content'
          );
        }
      } catch (error) {
        console.error(
          'Failed to fetch from Strapi, falling back to local content:',
          error
        );
      }
    }

    // Fallback to local content
    console.log('Using local bio content...');
    const bioEntries = await getCollection('bio');
    const bioEntry = bioEntries[0]; // Get the first (and only) bio entry

    if (!bioEntry) {
      throw new Error('No bio content found in local collection');
    }

    return bioEntry;
  }

  // Get all bio articles (for potential blog/articles page)
  async getAllBioArticles() {
    const isStrapiAvailable = await this.checkStrapiAvailability();

    if (isStrapiAvailable) {
      try {
        console.log('Fetching all bio articles from Strapi...');
        const strapiArticles = await strapiAPI.getBioArticles();
        return strapiArticles.map(transformStrapiArticle);
      } catch (error) {
        console.error(
          'Failed to fetch articles from Strapi, falling back to local content:',
          error
        );
      }
    }

    // Fallback to local content
    console.log('Using local bio articles...');
    return await getCollection('bio');
  }

  // Force refresh of Strapi availability check
  refreshStrapiStatus() {
    this.strapiAvailable = null;
  }
}

// Export singleton instance
export const contentManager = ContentManager.getInstance();
