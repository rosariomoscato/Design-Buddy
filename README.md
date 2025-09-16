# Design Buddy - AI Interior Design Application

Transform your living spaces with AI-powered interior design. Design Buddy allows users to upload photos of their rooms and apply professional design styles using Google's advanced Gemini AI technology.

## 🎨 Features

### AI-Powered Design Generation
- **🤖 Google Gemini Integration**: Advanced AI image generation using Google's Gemini 2.0 Flash
- **📸 Room Photo Upload**: Drag-and-drop interface for uploading room images
- **🏠 Multiple Room Types**: Living Room, Kitchen, Bedroom, Bathroom, Home Office, Dining Room, Nursery, Outdoor
- **🎨 8 Design Styles**: Modern, Coastal, Professional, Tropical, Vintage, Industrial, Neoclassical, Tribal
- **💾 Download Results**: High-quality generated designs ready for download

### User Experience
- **🔐 Google OAuth Authentication**: Secure sign-in with Google accounts
- **💳 Credit System**: 30 free credits per user for design generation
- **📱 Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- **🌙 Dark/Light/System Themes**: Consistent theming across all pages
- **⚡ Real-time Generation**: Live loading states with progress indicators

### Technical Excellence
- **🚀 Next.js 15**: Latest App Router with React 19 and TypeScript
- **🗃️ PostgreSQL Database**: Drizzle ORM with robust schema design
- **🎨 shadcn/ui Components**: Professional UI with Tailwind CSS
- **⚡ Performance Optimized**: Turbopack development server
- **🔄 Transaction Safety**: Atomic credit operations with rollback support

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom theme configuration
- **Components**: shadcn/ui with consistent design tokens
- **State Management**: React hooks with server actions
- **Theming**: next-themes with dark/light/system support

### Backend Stack
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with Google OAuth
- **AI Integration**: Google Gemini SDK for image generation
- **API Routes**: Next.js API routes with proper error handling
- **File Handling**: Base64 image processing with validation
- **Credit System**: Transaction-based credit management

### Key Technical Features

#### Database Schema
```sql
-- Users table with authentication and credits
user (id, email, name, image, credits, createdAt)

-- Credit usage tracking with transaction safety
creditUsage (id, userId, amount, description, createdAt)

-- Session management for authentication
session (id, userId, expiresAt)
```

#### AI Integration
- **Model**: Google Gemini 2.0 Flash Experimental
- **Processing**: Base64 image encoding/decoding
- **Error Handling**: Geographical restrictions, quota management
- **Fallback**: Credit refund on generation failures
- **Validation**: Image size, format, and content validation

#### Credit System
- **Initial Balance**: 30 credits per new user
- **Cost**: 1 credit per design generation
- **Transactions**: Atomic operations with rollback
- **History**: Complete usage tracking and analytics
- **Refunds**: Automatic refunds on failed generations

## 🚀 Quick Start

### Prerequisites
- **Node.js**: Version 18.0 or higher
- **PostgreSQL**: Local or cloud-hosted database
- **Google Cloud Account**: For OAuth credentials and Gemini API

### Environment Setup

1. **Clone the repository**
```bash
git clone https://github.com/rosariomoscato/Design-Buddy.git
cd Design-Buddy
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp env.example .env
```

4. **Set up your `.env` file**
```env
# Database Connection
POSTGRES_URL="postgresql://username:password@localhost:5432/design_buddy"

# Authentication - Better Auth
BETTER_AUTH_SECRET="your-32-character-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google OAuth Credentials
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google AI API
GOOGLE_GENAI_API_KEY="your-google-genai-api-key"
```

### Database Setup

1. **Generate database schema**
```bash
npm run db:generate
```

2. **Run migrations**
```bash
npm run db:migrate
```

### Start Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📂 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── credits/             # Credit management
│   │   └── generate-design/     # AI design generation
│   ├── dashboard/               # Design studio (main app)
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/                  # React Components
│   ├── auth/                   # Authentication components
│   ├── site-header.tsx         # Application header
│   ├── site-footer.tsx         # Application footer
│   └── ui/                     # shadcn/ui components
├── lib/                         # Core Utilities
│   ├── auth.ts                 # Better Auth configuration
│   ├── auth-client.ts          # Client auth utilities
│   ├── credit-service.ts       # Credit management system
│   ├── db.ts                   # Database connection
│   └── schema.ts               # Database schema
└── drizzle/                     # Database migrations
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck   # Run TypeScript type checking

# Database Operations
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:dev       # Push schema for development
npm run db:reset     # Reset database (drop all tables)
```

## 🎨 User Flow

### 1. **Landing Page** (`/`)
- Hero section with app introduction
- Feature showcase and room types
- Design styles demonstration
- Call-to-action for getting started

### 2. **Authentication**
- Google OAuth sign-in
- Automatic user account creation
- Initial 30 credit allocation

### 3. **Design Studio** (`/dashboard`)
- **Image Upload**: Drag-and-drop or click to upload room photos
- **Room Selection**: Choose from 8 different room types
- **Style Selection**: Pick from 8 professional design styles
- **Credit Display**: Real-time credit balance
- **Generation**: AI-powered design transformation
- **Results**: View and download generated designs

### 4. **User Management**
- Profile management
- Credit usage history
- Session management

## 🌍 Theme System

The application features a comprehensive theming system:

### Theme Options
- **Light Mode**: Clean, bright interface
- **Dark Mode**: Easy-on-the-eyes dark theme
- **System Mode**: Respects user's system preference

### Design Tokens
- **Semantic Colors**: `bg-primary`, `text-primary`, `bg-muted`, etc.
- **Consistent Tokens**: All components use standardized colors
- **Automatic Adaptation**: Seamless theme switching
- **Persistent Storage**: Theme preference saved locally

## 🛡️ Error Handling

### AI Generation Errors
- **Geographical Restrictions**: User-friendly messaging with credit refunds
- **API Quota Limits**: Graceful degradation with clear communication
- **Invalid Images**: Validation before processing
- **Network Issues**: Retry mechanisms and timeout handling

### Credit System Errors
- **Insufficient Credits**: Prevents generation with upgrade prompts
- **Transaction Failures**: Automatic rollback and user notification
- **Race Conditions**: Atomic operations prevent double-spending

### Authentication Errors
- **OAuth Failures**: Clear error messages and retry options
- **Session Expiry**: Automatic re-authentication
- **Invalid Tokens**: Secure handling with redirect to login

## 🚀 Deployment

### Vercel (Recommended)
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add all required environment variables
3. **Database**: Use Vercel Postgres or external PostgreSQL
4. **Deploy**: Automatic deployment on every push to main branch

### Environment Variables Required
```env
POSTGRES_URL                    # Production database URL
BETTER_AUTH_SECRET              # Secure random secret
NEXT_PUBLIC_APP_URL             # Production domain
GOOGLE_CLIENT_ID               # Google OAuth client ID
GOOGLE_CLIENT_SECRET           # Google OAuth client secret
GOOGLE_GENAI_API_KEY           # Google Gemini API key
```

## 🔮 Future Enhancements

### Planned Features
- **Multiple AI Models**: Support for different AI providers
- **Batch Processing**: Generate multiple designs at once
- **Style Customization**: Create custom design styles
- **User Galleries**: Save and organize generated designs
- **Collaboration**: Share designs with friends and family
- **Mobile App**: React Native companion app

### Technical Improvements
- **Caching Layer**: Redis for improved performance
- **CDN Integration**: Faster image delivery
- **Advanced Analytics**: User behavior insights
- **A/B Testing**: Feature optimization
- **Progressive Web App**: Offline functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI**: For the powerful image generation capabilities
- **shadcn/ui**: For the beautiful and accessible component library
- **Vercel**: For hosting and deployment platform
- **Better Auth**: For the robust authentication solution

---

**Built with ❤️ using modern web technologies**

[![GitHub stars](https://img.shields.io/github/stars/rosariomoscato/Design-Buddy?style=social)](https://github.com/rosariomoscato/Design-Buddy)
[![GitHub forks](https://img.shields.io/github/forks/rosariomoscato/Design-Buddy?style=social)](https://github.com/rosariomoscato/Design-Buddy)

**Visit the live application**: [Design Buddy](https://design-buddy.vercel.app)