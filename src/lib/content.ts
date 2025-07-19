import { getCollection } from 'astro:content';
import { strapiAPI } from './strapi';

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

  // Get bio content with multi-source data fetching and fallback strategy
  async getBioContent() {
    const isStrapiAvailable = await this.checkStrapiAvailability();

    if (isStrapiAvailable) {
      try {
        console.log(
          'Fetching merged bio content from Strapi (multi-source)...'
        );
        const mergedData = await strapiAPI.getMergedBioContent();

        if (mergedData) {
          console.log('Successfully fetched merged bio content from Strapi');

          // Transform to match expected structure
          return {
            id: 'strapi-merged',
            slug: 'strapi-merged',
            data: mergedData,
            body: mergedData.content,
            render: async () => ({
              Content: () => ({
                __html: mergedData.content,
              }),
            }),
          };
        } else {
          console.warn(
            'No merged bio content available from Strapi, falling back to local content'
          );
        }
      } catch (error) {
        console.error(
          'Failed to fetch merged content from Strapi, falling back to local content:',
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
        // For now, return raw articles - can be enhanced later if needed
        return strapiArticles;
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
