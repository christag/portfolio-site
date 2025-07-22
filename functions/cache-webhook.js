/**
 * Cache Invalidation Webhook for Strapi Content Updates
 *
 * This Cloudflare Function handles webhook calls from Strapi
 * to invalidate relevant caches when content is updated.
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // Verify webhook authenticity
    const signature = request.headers.get('X-Strapi-Signature');
    const expectedSignature = env.STRAPI_WEBHOOK_SECRET;

    if (!signature || signature !== expectedSignature) {
      console.warn('Invalid webhook signature');
      return new Response('Unauthorized', { status: 401 });
    }

    // Parse webhook payload
    const payload = await request.json();
    const { model, entry } = payload;

    console.log(`Cache invalidation requested for model: ${model}`);

    // Determine what caches to invalidate based on content type
    const cachesToInvalidate = getCachesToInvalidate(model, entry);

    if (cachesToInvalidate.length === 0) {
      return new Response('No cache invalidation needed', { status: 200 });
    }

    // Invalidate Cloudflare cache
    const invalidationResults = await Promise.allSettled(
      cachesToInvalidate.map((cache) => invalidateCloudflareCache(cache, env))
    );

    // Log results
    const successful = invalidationResults.filter(
      (r) => r.status === 'fulfilled'
    ).length;
    const failed = invalidationResults.length - successful;

    console.log(
      `Cache invalidation completed: ${successful} successful, ${failed} failed`
    );

    // Trigger client-side cache update
    await triggerClientCacheUpdate(model, env);

    return new Response(
      JSON.stringify({
        success: true,
        model,
        caches_invalidated: cachesToInvalidate,
        results: {
          successful,
          failed,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      }
    );
  } catch (error) {
    console.error('Cache invalidation webhook failed:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

/**
 * Determine which caches to invalidate based on content type
 */
function getCachesToInvalidate(model, entry) {
  const caches = [];

  switch (model) {
    case 'portfolio':
      caches.push(
        '/portfolio',
        '/api/portfolios*',
        '/_astro/*' // In case portfolio affects bundled data
      );
      break;

    case 'service':
      caches.push(
        '/services',
        '/services/*',
        `/services/${entry?.slug || '*'}`,
        '/api/services*'
      );
      break;

    case 'bio-article':
      caches.push(
        '/i-am',
        '/api/bio-articles*',
        '/api/profile*' // Bio articles affect merged profile data
      );
      break;

    case 'profile':
      caches.push(
        '/i-am',
        '/api/profile*',
        '/' // Profile affects homepage
      );
      break;

    case 'settings':
      caches.push('/', '/portfolio', '/services', '/i-am', '/api/settings*');
      break;

    default:
      console.log(`Unknown model type: ${model}`);
  }

  return caches;
}

/**
 * Invalidate Cloudflare cache using the API
 */
async function invalidateCloudflareCache(pattern, env) {
  const zoneId = env.CLOUDFLARE_ZONE_ID;
  const apiToken = env.CLOUDFLARE_API_TOKEN;

  if (!zoneId || !apiToken) {
    console.warn('Cloudflare credentials not configured');
    return false;
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: [`https://www.christagliaferro.com${pattern}`],
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      console.log(`Cache invalidated: ${pattern}`);
      return true;
    } else {
      console.error(`Cache invalidation failed for ${pattern}:`, result.errors);
      return false;
    }
  } catch (error) {
    console.error(`Cache invalidation error for ${pattern}:`, error);
    return false;
  }
}

/**
 * Trigger client-side cache update via Server-Sent Events or WebSocket
 */
async function triggerClientCacheUpdate(model, env) {
  try {
    // In a real implementation, you might use:
    // - WebSocket connections to notify connected clients
    // - Server-Sent Events to push cache invalidation events
    // - Push notifications for mobile clients

    console.log(`Client cache update triggered for model: ${model}`);

    // For now, we'll just log the event
    // Future implementation could integrate with services like:
    // - Pusher for real-time notifications
    // - Firebase Cloud Messaging for push notifications
    // - Custom WebSocket server for live updates
  } catch (error) {
    console.error('Client cache update failed:', error);
  }
}

/**
 * Handle GET requests for webhook status/health check
 */
export async function onRequestGet(context) {
  return new Response(
    JSON.stringify({
      service: 'Cache Invalidation Webhook',
      status: 'active',
      timestamp: new Date().toISOString(),
      supported_models: [
        'portfolio',
        'service',
        'bio-article',
        'profile',
        'settings',
      ],
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    }
  );
}
