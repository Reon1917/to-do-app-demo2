# Bookmark Manager

A modern web application for managing and sharing bookmarks, built with Next.js, TypeScript, Supabase, and Tailwind CSS.

## Features

- User authentication (Email/Password and Google OAuth)
- Bookmark management
- Collection organization
- Public/Private sharing
- Responsive design
- Real-time updates

## Tech Stack

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Authentication)
- **Deployment**: Vercel

## Prerequisites

Before you deploy, make sure you have:

1. A Supabase account and project
2. A Vercel account
3. The following environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment Instructions

1. Push your code to GitHub
2. Log in to Vercel
3. Click "Import Project"
4. Select your GitHub repository
5. Configure the project:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
6. Add Environment Variables:
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. Click "Deploy"

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with the required environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```

## Database Schema

### Tables

1. `bookmarks`
   - id: uuid (primary key)
   - user_id: uuid (foreign key)
   - title: text
   - url: text
   - category: text (nullable)
   - created_at: timestamp

2. `collections`
   - id: uuid (primary key)
   - user_id: uuid (foreign key)
   - name: text
   - is_public: boolean
   - created_at: timestamp

3. `bookmark_collections`
   - id: uuid (primary key)
   - collection_id: uuid (foreign key)
   - bookmark_id: uuid (foreign key)
   - created_at: timestamp

## Security

- Row Level Security (RLS) policies are implemented in Supabase
- Authentication is handled by Supabase Auth
- Environment variables are properly configured
- OAuth redirects are properly set up

## Post-Deployment Checklist

1. Test user authentication (both email/password and Google OAuth)
2. Verify bookmark creation and management
3. Test collection creation and sharing
4. Check responsive design on different devices
5. Verify environment variables are properly set
6. Test real-time updates
7. Verify database permissions and RLS policies

## Support

For issues or questions, please open a GitHub issue in the repository.
