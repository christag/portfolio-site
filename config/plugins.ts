export default ({
  env,
}: {
  env: (key: string, defaultValue?: string) => string;
}) => ({
  // Upload provider configuration for Cloudflare R2
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        credentials: {
          accessKeyId: env('CLOUDFLARE_R2_ACCESS_KEY_ID'),
          secretAccessKey: env('CLOUDFLARE_R2_SECRET_ACCESS_KEY'),
        },
        region: env('CLOUDFLARE_R2_REGION', 'auto'), // R2 uses 'auto' as region
        params: {
          Bucket: env('CLOUDFLARE_R2_BUCKET'),
        },
        // Cloudflare R2 endpoint configuration
        endpoint: env('CLOUDFLARE_R2_ENDPOINT'), // Format: https://ACCOUNT_ID.r2.cloudflarestorage.com
        s3ForcePathStyle: true, // Required for R2 compatibility
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
