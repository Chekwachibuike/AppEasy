# Job Tracker Application

## Overview

This is a full-stack job tracking application built for managing job applications with AI-powered analysis features. The application allows users to add, edit, delete, and analyze job applications with intelligent insights powered by OpenAI. The system has been rebuilt using Next.js for modern full-stack development.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15 with React 18 and TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack React Query for server state
- **Routing**: Next.js file-based routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Next.js with optional Turbopack support

### Backend Architecture
- **Runtime**: Next.js API Routes (Node.js)
- **Language**: TypeScript with ESM modules
- **Database**: In-memory storage with Drizzle ORM schema definitions
- **AI Integration**: OpenAI GPT-4o for job analysis
- **Validation**: Zod schemas for request/response validation
- **Development**: Integrated Next.js development server

### UI/UX Design
- **Component Library**: Radix UI primitives with custom shadcn/ui components
- **Design System**: Consistent color palette with psychology-driven colors
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: ARIA-compliant components from Radix UI

## Key Components

### Database Schema
```typescript
// Jobs table with status tracking and AI analysis fields
jobs: {
  id: serial (primary key)
  title: text (required)
  company: text (required)
  applicationLink: text (required URL)
  status: enum ('applied', 'interviewing', 'rejected', 'offer')
  appliedDate: timestamp (auto-generated)
  aiSummary: text (nullable)
  aiSkills: text array (nullable)
}
```

### API Endpoints (Next.js API Routes)
- `GET /api/jobs` - Retrieve all job applications
- `GET /api/jobs/[id]` - Retrieve specific job application
- `POST /api/jobs` - Create new job application
- `PUT /api/jobs/[id]` - Update existing job application
- `DELETE /api/jobs/[id]` - Delete job application
- `POST /api/analyze-job` - AI analysis of job descriptions

### Core Features
1. **Job Management**: Full CRUD operations for job applications
2. **Status Tracking**: Visual status indicators with color coding
3. **AI Analysis**: OpenAI-powered job description analysis
4. **Statistics Dashboard**: Application metrics and success rates
5. **Search & Filter**: Real-time job application filtering
6. **Responsive Design**: Mobile-optimized interface

## Data Flow

### Job Application Flow
1. User fills out job application form with validation
2. Form data is validated using Zod schemas
3. POST request creates new job entry in database
4. React Query invalidates cache and refetches data
5. UI updates with new job application

### AI Analysis Flow
1. User pastes job description in AI analysis form
2. Description is validated and sent to OpenAI API
3. GPT-4o analyzes job and returns summary + skills
4. Results are displayed in modal with structured format
5. User can optionally save analysis to job entry

### State Management
- **Server State**: Managed by TanStack React Query
- **Form State**: Handled by React Hook Form
- **UI State**: Local React state for modals and interactions
- **Cache Strategy**: Optimistic updates with error rollback

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: Database connection for Neon PostgreSQL
- **drizzle-orm**: Type-safe database ORM
- **openai**: Official OpenAI client library
- **express**: Web framework for Node.js
- **react-hook-form**: Performant form library
- **@tanstack/react-query**: Server state management
- **zod**: Runtime type validation
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type safety and development experience
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production builds

### AI Integration
- **OpenAI API**: GPT-4o model for job analysis
- **Structured Output**: JSON response format for consistent parsing
- **Error Handling**: Fallback responses for API failures
- **Rate Limiting**: Built-in OpenAI client rate limiting

## Deployment Strategy

### Environment Setup
- **Development**: Local development with hot reload via Vite
- **Production**: Optimized builds with static asset serving
- **Database**: PostgreSQL (Neon) with connection pooling
- **Environment Variables**: Secure API key management

### Build Process
1. **Next.js Build**: Optimized production build with static generation
2. **API Routes**: Server-side functions bundled with the application
3. **Static Assets**: Served from Next.js built-in static file serving
4. **Database Schema**: Drizzle ORM schema definitions for type safety

### Replit Configuration
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Port Configuration**: Next.js development server on port 3000
- **Auto-scaling**: Configured for production deployment
- **Development**: Integrated Next.js development workflow

## Changelog

```
Changelog:
- June 19, 2025. Initial setup with React/Express/Vite architecture
- June 19, 2025. Complete migration to Next.js 15 full-stack framework
  * Replaced React/Vite frontend with Next.js pages
  * Converted Express API routes to Next.js API routes
  * Updated TypeScript configuration for Next.js
  * Migrated all UI components to work with Next.js
  * Preserved all functionality: job CRUD operations and AI analysis
  * Updated Tailwind CSS configuration for Next.js
  * Psychology-driven color scheme maintained
- June 19, 2025. Fixed startup and configuration issues
  * Created server/index.ts wrapper to run Next.js on port 5000
  * Fixed PostCSS configuration for ESM module compatibility
  * Resolved workflow port binding issues
  * Application now running successfully with all features working
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```