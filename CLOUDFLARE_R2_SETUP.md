# Cloudflare R2 Media Storage Setup

This guide covers setting up Cloudflare R2 as the media storage solution for Strapi v5 on Railway.

## Why Cloudflare R2?

✅ **Cost-effective**: $0.015/GB storage with **zero egress fees**  
✅ **Global CDN**: Fast delivery worldwide via Cloudflare edge network  
✅ **S3-compatible**: Easy integration with existing Strapi plugins  
✅ **Perfect for portfolios**: Optimized for public media delivery

## Prerequisites

- Cloudflare account with R2 enabled
- Strapi v5 project deployed on Railway
- Basic understanding of environment variables

## Step 1: Create Cloudflare R2 Bucket

1. **Log into Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Navigate to **R2 Object Storage**

2. **Create a New Bucket**
   - Click **"Create bucket"**
   - Choose a unique bucket name (e.g., `your-portfolio-media`)
   - Select a location close to your users
   - Click **"Create bucket"**

3. **Configure Bucket Settings**
   - Set bucket to **Public** for portfolio images
   - Configure CORS if needed for direct uploads

## Step 2: Generate R2 API Credentials

1. **Create R2 Token**
   - In Cloudflare Dashboard, go to **"My Profile" > "API Tokens"**
   - Click **"Create Token"**
   - Use **"Custom token"** template

2. **Configure Token Permissions**
   - **Zone**: Not needed for R2
   - **Account**: Your account
   - **Permissions**:
     - `Cloudflare R2:Edit` for your account
   - **Account Resources**: Include your account
   - **Client IP Address Filtering**: Optional (leave blank for Railway)

3. **Save Credentials**
   - Copy the **Token** (this is your Access Key ID)
   - Generate a **Secret Access Key** in R2 settings

## Step 3: Configure Strapi Upload Provider

The upload provider is already configured in `config/plugins.ts`:

```typescript
export default ({
  env,
}: {
  env: (key: string, defaultValue?: string) => string;
}) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        credentials: {
          accessKeyId: env('CLOUDFLARE_R2_ACCESS_KEY_ID'),
          secretAccessKey: env('CLOUDFLARE_R2_SECRET_ACCESS_KEY'),
        },
        region: env('CLOUDFLARE_R2_REGION', 'auto'),
        params: {
          Bucket: env('CLOUDFLARE_R2_BUCKET'),
        },
        endpoint: env('CLOUDFLARE_R2_ENDPOINT'),
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
```

## Step 4: Set Environment Variables

Add these environment variables to your Railway deployment:

### Required Variables

```bash
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCESS_KEY_ID=your-r2-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
CLOUDFLARE_R2_BUCKET=your-bucket-name
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_REGION=auto
```

### How to Find Your Values

- **Access Key ID**: From the R2 API token you created
- **Secret Access Key**: Generated in R2 settings
- **Bucket**: The bucket name you created
- **Endpoint**: Format is `https://ACCOUNT_ID.r2.cloudflarestorage.com`
  - Find your Account ID in Cloudflare Dashboard sidebar
- **Region**: Always use `auto` for R2

## Step 5: Configure Railway Environment Variables

1. **Go to Railway Dashboard**
   - Open your Strapi project
   - Go to **"Variables"** tab

2. **Add R2 Variables**

   ```
   CLOUDFLARE_R2_ACCESS_KEY_ID = your_actual_access_key
   CLOUDFLARE_R2_SECRET_ACCESS_KEY = your_actual_secret_key
   CLOUDFLARE_R2_BUCKET = your-bucket-name
   CLOUDFLARE_R2_ENDPOINT = https://your-account-id.r2.cloudflarestorage.com
   CLOUDFLARE_R2_REGION = auto
   ```

3. **Deploy Changes**
   - Railway will automatically redeploy with new environment variables

## Step 6: Test Media Upload

1. **Access Strapi Admin**
   - Go to your Strapi admin panel
   - Navigate to **"Media Library"**

2. **Upload Test Image**
   - Click **"Add new assets"**
   - Upload an image file
   - Verify it appears in the media library

3. **Verify R2 Storage**
   - Check your R2 bucket in Cloudflare Dashboard
   - Confirm the uploaded file appears in the bucket

## Step 7: Configure Public Access (Optional)

For public portfolio images, you may want to set up a custom domain:

1. **Custom Domain Setup**
   - In R2 bucket settings, go to **"Settings" > "Public access"**
   - Add a custom domain (e.g., `media.yourdomain.com`)
   - Configure DNS in Cloudflare

2. **Update Environment Variables**
   ```bash
   CLOUDFLARE_R2_PUBLIC_URL=https://media.yourdomain.com
   ```

## Troubleshooting

### Common Issues

1. **"Access Denied" Errors**
   - Verify API token has correct R2 permissions
   - Check that bucket name matches exactly
   - Ensure endpoint URL is correct

2. **"Bucket Not Found"**
   - Verify bucket name in environment variables
   - Check that bucket exists in the correct Cloudflare account

3. **CORS Errors**
   - Configure CORS policy in R2 bucket settings
   - Allow origins from your Strapi domain

### Debug Steps

1. **Check Railway Logs**

   ```bash
   # Look for upload-related errors in Railway deployment logs
   ```

2. **Test API Credentials**
   - Use AWS CLI or S3 tools to test R2 connection
   - Verify credentials work outside of Strapi

3. **Verify Environment Variables**
   - Check Railway dashboard for correct variable values
   - Ensure no extra spaces or hidden characters

## Performance Optimization

### Image Optimization

- Use WebP format for better compression
- Implement responsive images in frontend
- Set up lazy loading for portfolio images

### CDN Configuration

- R2 automatically uses Cloudflare's global CDN
- Images are cached at edge locations worldwide
- No additional CDN setup required

## Cost Estimation

For a typical portfolio website:

- **Storage**: ~1GB of images = $0.015/month
- **Bandwidth**: Unlimited egress = $0.00/month
- **Requests**: ~10K requests = ~$0.04/month
- **Total**: ~$0.06/month

Compare to AWS S3: ~$0.50-2.00/month with bandwidth costs.

## Security Best Practices

1. **API Token Security**
   - Use minimal required permissions
   - Rotate tokens regularly
   - Never commit tokens to version control

2. **Bucket Security**
   - Only make public what needs to be public
   - Use signed URLs for private content
   - Monitor access logs

3. **Environment Variables**
   - Use Railway's secure environment variable storage
   - Never expose credentials in client-side code

## Next Steps

After setting up R2:

1. ✅ Upload test images through Strapi admin
2. ✅ Verify images display correctly on frontend
3. ✅ Set up image optimization and responsive images
4. ✅ Configure custom domain for branded URLs
5. ✅ Monitor usage and costs in Cloudflare Dashboard

## Support

- **Cloudflare R2 Documentation**: https://developers.cloudflare.com/r2/
- **Strapi Upload Provider**: https://docs.strapi.io/dev-docs/providers
- **Railway Environment Variables**: https://docs.railway.app/deploy/variables
