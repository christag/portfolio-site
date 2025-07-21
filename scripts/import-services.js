#!/usr/bin/env node

/**
 * Import Services to Strapi
 *
 * This script takes the fallback services from content.ts and creates them in Strapi
 * Usage: node scripts/import-services.js
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Your existing fallback services (from content.ts)
const services = [
  {
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
  },
  {
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
  },
  {
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
  },
];

async function createService(service) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_API_TOKEN
          ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        data: service,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Created service: "${service.title}"`);
      return result;
    } else {
      const errorText = await response.text();
      console.error(`❌ Failed to create service "${service.title}":`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      return null;
    }
  } catch (error) {
    console.error(
      `💥 Network error creating "${service.title}":`,
      error.message
    );
    return null;
  }
}

async function importServices() {
  console.log(`🚀 Importing ${services.length} services to Strapi...`);
  console.log(`📡 Strapi URL: ${STRAPI_URL}`);
  console.log(`🔑 API Token: ${STRAPI_API_TOKEN ? 'SET' : 'NOT SET'}`);

  if (!STRAPI_API_TOKEN) {
    console.warn(
      '⚠️  No API token provided. This may fail if authentication is required.'
    );
  }

  const results = [];
  for (const service of services) {
    console.log(`\n📝 Creating: ${service.title}...`);
    const result = await createService(service);
    results.push(result);

    // Add a small delay to be nice to the API
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const successful = results.filter((r) => r !== null).length;
  const failed = results.length - successful;

  console.log(`\n📊 Import Summary:`);
  console.log(`   ✅ Successful: ${successful}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📋 Total: ${results.length}`);

  if (failed > 0) {
    console.log(`\n🔧 If services failed to create, check:`);
    console.log(`   - Strapi is running and accessible`);
    console.log(`   - API token has write permissions to services`);
    console.log(
      `   - Services content model exists and matches the data structure`
    );
  }
}

// Run the import
importServices().catch((error) => {
  console.error('💥 Import failed:', error);
  process.exit(1);
});
