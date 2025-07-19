// Cloudflare Pages Function for handling Strapi webhooks
// This will trigger a rebuild when content is updated in Strapi

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    // Verify the webhook is from Strapi
    const body = await request.json();

    // Log the webhook event
    console.log('Webhook received:', {
      event: body.event,
      model: body.model,
      entry: body.entry?.id,
    });

    // Verify webhook signature (if configured in Strapi)
    const signature = request.headers.get('x-strapi-signature');
    if (env.STRAPI_WEBHOOK_SECRET && signature) {
      // Implement signature verification here if needed
      // const expectedSignature = await generateSignature(body, env.STRAPI_WEBHOOK_SECRET);
      // if (signature !== expectedSignature) {
      //   return new Response('Unauthorized', { status: 401 });
      // }
    }

    // Only trigger rebuild for specific events
    const triggerEvents = [
      'entry.create',
      'entry.update',
      'entry.delete',
      'entry.publish',
      'entry.unpublish',
    ];

    if (!triggerEvents.includes(body.event)) {
      return new Response('Event ignored', { status: 200 });
    }

    // Trigger Cloudflare Pages rebuild using the deploy hook
    if (env.CLOUDFLARE_DEPLOY_HOOK_URL) {
      const deployResponse = await fetch(env.CLOUDFLARE_DEPLOY_HOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Content updated: ${body.model} ${body.entry?.id || 'unknown'}`,
          source: 'strapi-webhook',
        }),
      });

      if (!deployResponse.ok) {
        console.error('Failed to trigger deploy:', deployResponse.statusText);
        return new Response('Deploy trigger failed', { status: 500 });
      }

      console.log('Deploy triggered successfully');
    }

    return new Response('Webhook processed successfully', {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook processing failed', { status: 500 });
  }
}

// Handle OPTIONS requests for CORS
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-strapi-signature',
    },
  });
}
