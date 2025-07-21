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

  // Get services content with fallback strategy
  async getServicesContent() {
    const isStrapiAvailable = await this.checkStrapiAvailability();

    if (isStrapiAvailable) {
      try {
        console.log('Fetching services from Strapi...');
        const services = await strapiAPI.getServices();

        if (services && services.length > 0) {
          console.log(
            `Successfully fetched ${services.length} services from Strapi`
          );
          return {
            services,
            usingFallback: false,
          };
        } else {
          console.warn(
            'No services available from Strapi, using fallback services'
          );
        }
      } catch (error) {
        console.error(
          'Failed to fetch services from Strapi, using fallback services:',
          error
        );
      }
    }

    // Fallback to sample services
    console.log('Using fallback services...');
    const fallbackServices = [
      {
        id: 1,
        documentId: 'fallback-1',
        title: 'Virtual CIO & IT Strategy Leadership',
        description:
          'I will act as your on-demand Chief Information Officer, helping you plan and execute a technology strategy that fuels your business growth. Get executive-level IT guidance without the full-time cost.',
        category: 'Leadership',
        featureHighlights: [
          '12+ Years IT Leadership Experience',
          'Strategic Technology Roadmaps',
          'IT Budget Planning & Cost Reduction',
          'Vendor Management & Negotiations',
        ],
        tiers: [
          {
            name: 'Basic',
            priceLow: 500,
            priceHigh: 500,
            deliverables: [
              'Current IT setup review',
              'Prioritized action plan',
              'Cost reduction recommendations',
              'Technology roadmap',
            ],
          },
          {
            name: 'Standard',
            priceLow: 1500,
            priceHigh: 1500,
            deliverables: [
              'Monthly strategy calls',
              'IT budget planning',
              'Ongoing technology advice',
              'Project alignment guidance',
            ],
          },
          {
            name: 'Premium',
            priceLow: 3000,
            priceHigh: 3000,
            deliverables: [
              'Leadership team integration',
              'Complete IT initiative oversight',
              'Enterprise-grade strategic planning',
              'Vendor & project management',
            ],
          },
        ],
        contactMethod: 'email',
        isPinned: true,
        slug: 'virtual-cio-strategy',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        publishedAt: '2025-01-01',
      },
      {
        id: 2,
        documentId: 'fallback-2',
        title: 'On-Demand IT Support & Troubleshooting',
        description:
          'I will fix your computer issues and tech glitches on an as-needed basis. Quick, reliable support means less downtime for your business, which directly saves you money and frustration.',
        category: 'Support',
        featureHighlights: [
          'Remote & On-Site Support',
          'Virus & Malware Removal',
          'Network Troubleshooting',
          'Quick Response Times',
        ],
        tiers: [
          {
            name: 'Basic',
            priceLow: 100,
            priceHigh: 100,
            deliverables: [
              'Single issue diagnosis & resolution',
              'Remote or in-person support',
              'Malware removal',
              'Basic troubleshooting',
            ],
          },
          {
            name: 'Standard',
            priceLow: 300,
            priceHigh: 300,
            deliverables: [
              '4 hours of support time',
              'Multiple device servicing',
              'Computer tune-ups',
              'Equipment setup',
            ],
          },
          {
            name: 'Premium',
            priceLow: 1000,
            priceHigh: 1000,
            deliverables: [
              'Unlimited monthly support',
              'Priority response times',
              'Proactive maintenance',
              'System health monitoring',
            ],
          },
        ],
        contactMethod: 'phone',
        isPinned: false,
        slug: 'it-support-troubleshooting',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        publishedAt: '2025-01-01',
      },
      {
        id: 3,
        documentId: 'fallback-3',
        title: 'Workflow Automation & AI Integration Solutions',
        description:
          'I will streamline your business processes by automating repetitive tasks and integrating AI tools, so you and your team can save time and reduce errors.',
        category: 'Automation',
        featureHighlights: [
          'Custom AI Chatbot Development',
          'Process Automation Design',
          'Zapier/Integromat Integration',
          '50% Task Time Reduction',
        ],
        tiers: [
          {
            name: 'Basic',
            priceLow: 300,
            priceHigh: 300,
            deliverables: [
              'Single-task automation',
              'Simple workflow setup',
              'Basic integration',
              'Documentation',
            ],
          },
          {
            name: 'Standard',
            priceLow: 1000,
            priceHigh: 1500,
            deliverables: [
              'Multi-step automation',
              'AI tool integration',
              'Custom workflows',
              'Training & support',
            ],
          },
          {
            name: 'Premium',
            priceLow: 3000,
            priceHigh: 5000,
            deliverables: [
              'Enterprise automation suite',
              'Custom AI chatbot',
              'Full process overhaul',
              'Ongoing optimization',
            ],
          },
        ],
        contactMethod: 'email',
        isPinned: true,
        slug: 'workflow-automation-ai',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        publishedAt: '2025-01-01',
      },
    ];

    return {
      services: fallbackServices,
      usingFallback: true,
    };
  }
}

// Export singleton instance
export const contentManager = ContentManager.getInstance();
