# Comfyatlas AI

A Pinterest-style image sharing platform built with Next.js, Supabase, and Cloudinary.

## Features

- 🔐 User authentication (sign up, login, logout)
- 📌 Create and share pins (images)
- 📋 Organize pins into boards
- 🔍 Search functionality
- 👤 User profiles
- 📱 Responsive design
- 🖼️ Image upload with Cloudinary
- 💾 PostgreSQL database with Supabase

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Image Storage**: Cloudinary
- **Deployment**: Vercel

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- A Supabase account
- A Cloudinary account
- Git installed

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to Project Settings > API
3. Copy your project URL and anon key
4. Go to SQL Editor and run the schema from `lib/supabase/schema.sql`

### 4. Set Up Cloudinary

1. Go to [cloudinary.com](https://cloudinary.com) and create an account
2. Go to Settings > Upload
3. Create an upload preset named "comfyatlas" (or change the name in the code)
4. Set it to "Unsigned"
5. Copy your Cloud Name, API Key, and API Secret

### 5. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add the environment variables in Vercel project settings
4. Deploy!

## Project Structure

```
comfyatlas-pinterest/
├── app/
│   ├── boards/          # Board pages
│   ├── create/          # Create pin page
│   ├── explore/         # Search/explore page
│   ├── login/           # Login page
│   ├── pin/             # Pin detail pages
│   ├── profile/         # User profile pages
│   ├── signup/          # Sign up page
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   ├── Header.tsx       # Navigation header
│   └── SavePinButton.tsx # Save pin to board button
├── lib/
│   └── supabase/
│       ├── client.ts    # Supabase client (browser)
│       ├── server.ts    # Supabase client (server)
│       └── schema.sql   # Database schema
├── types/
│   └── database.ts      # TypeScript types
└── .env.local           # Environment variables
```

## Database Schema

The application uses the following tables:

- **profiles**: User profiles (extends Supabase auth.users)
- **pins**: Image pins created by users
- **boards**: Collections to organize pins
- **board_pins**: Many-to-many relationship between boards and pins

## Features Roadmap

- [ ] Follow/unfollow users
- [ ] Like/comment on pins
- [ ] Notifications
- [ ] Advanced search filters
- [ ] Pin recommendations
- [ ] Mobile app
- [ ] Payment integration for premium features

## License

MIT
