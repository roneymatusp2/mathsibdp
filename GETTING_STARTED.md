# Getting Started with IBMATHS CHOICE

This guide will help you get the IBMATHS CHOICE multi-school system up and running.

## Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)
- Git
- Supabase account
- SendGrid account (for email functionality)

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/roneymatusp2/mathsibdp.git
   cd mathsibdp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Then edit the `.env` file with your Supabase and SendGrid credentials.

4. **Set up the database**:
   
   Run the SQL setup scripts in your Supabase SQL editor:
   
   - `create_school_tables.sql`
   - `create_registration_codes.sql`

5. **Start the development server**:
   ```bash
   npm run dev
   ```
   
   This will start the development server at http://localhost:3000

## Project Structure

- `/src` - Source code
  - `/components` - React components
  - `/services` - Service classes
  - `/types` - TypeScript type definitions
  - `/utils` - Utility functions
- `/public` - Static assets
- `/.github/workflows` - CI/CD configuration

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test-email` - Test email functionality

## Deployment Options

See `DEPLOYMENT.md` for detailed deployment instructions for:

- GitHub Pages
- Netlify
- Vercel

## Adding New Schools

1. Create registration codes in the Supabase database
2. Direct school administrators to the registration page
3. The system will automatically generate credentials and send them via email

## Security Considerations

- Keep your `.env` file secure and never commit it to version control
- Regularly rotate API keys and passwords
- Limit access to the Supabase dashboard
- Ensure RLS policies are properly configured

## Troubleshooting

- **Database connection issues**: Verify your Supabase URL and key
- **Email sending failures**: Check your SendGrid API key and sender verification
- **Build errors**: Make sure all dependencies are installed

For more help, please open an issue on GitHub.
