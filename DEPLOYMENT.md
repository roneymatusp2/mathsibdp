# Deployment Guide for IBMATHS CHOICE

This document outlines various deployment options for the IBMATHS CHOICE multi-school system.

## Deploying to GitHub

### Using the Provided Scripts

1. For Windows users:
   ```
   deploy-to-github.bat
   ```

2. For Mac/Linux users:
   ```bash
   chmod +x deploy-to-github.sh
   ./deploy-to-github.sh
   ```

### Manual Deployment

1. Initialize Git repository:
   ```bash
   git init
   ```

2. Add all files:
   ```bash
   git add .
   ```

3. Create initial commit:
   ```bash
   git commit -m "Initial version"
   ```

4. Add remote repository:
   ```bash
   git remote add origin https://github.com/roneymatusp2/mathsibdp.git
   ```

5. Push to GitHub:
   ```bash
   git push -f origin master:main
   ```

## Deploying to Netlify

### Option 1: Using Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize Netlify site:
   ```bash
   netlify init
   ```

4. Deploy to Netlify:
   ```bash
   netlify deploy --prod
   ```

### Option 2: Netlify Continuous Deployment

1. Push your code to GitHub
2. Log in to Netlify (https://app.netlify.com/)
3. Click "New site from Git"
4. Select your GitHub repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

## Deploying to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

## Environment Variables

For any deployment, ensure you set the following environment variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_KEY`: Your Supabase public key
- `VITE_SENDGRID_API_KEY`: Your SendGrid API key
- `VITE_EMAIL_FROM`: The sender email address

## Database Setup

1. Run the Supabase setup scripts in this order:
   - `create_school_tables.sql`
   - `create_registration_codes.sql`

2. Check the Row Level Security (RLS) policies to ensure they are properly set up for data isolation.

## Production Considerations

1. Enable HTTPS for all production deployments
2. Set up a custom domain if needed
3. Configure CORS in Supabase to allow only your application's domain
4. Regularly back up your database
5. Monitor for unauthorized access attempts
