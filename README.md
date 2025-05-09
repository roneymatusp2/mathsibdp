# IBMATHS CHOICE - Multi-School System

A comprehensive platform to help students select the appropriate IB Mathematics courses using data-driven approaches.

## Overview

The IBMATHS CHOICE is a platform that allows multiple schools to use the system in an isolated and secure manner, with the following features:

- Multi-tiered authentication (school → user type → specific user)
- Complete data isolation between schools
- Visual customization for each school
- Automated new school registration system
- Email integration for credential delivery

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
   Update with your SendGrid and Supabase credentials.

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Database Structure

The system uses Supabase with the following main tables:
- `schools`: Stores school information
- `users`: System users linked to schools
- `questionarios`: Student responses linked to schools

## Security

- Row-Level Security (RLS) policies for data isolation
- Secure password generation for different user roles
- JWT token system with school ID for authentication
- Controlled visibility based on user roles

## Email Integration

The IBMATHS CHOICE platform uses SendGrid for email delivery. This is used to send welcome emails and credentials to new schools after registration.

## Multi-School System

Each school in the IBMATHS CHOICE platform has:
- Unique access code and credentials
- Custom visual identity (colors and logo)
- Isolated data environment
- Role-based access control (admin, teacher, student)

## Development

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

This multi-school system provides a secure, isolated environment for each school while maintaining a consistent and intuitive user experience. Each school can customize its appearance while benefiting from the full functionality of the IBMATHS CHOICE platform.
