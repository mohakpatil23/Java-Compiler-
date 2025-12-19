# Java Compiler Web Application

## Overview

This is a fullstack web application that provides an online Java compiler and code execution environment. Users can write Java code in a browser-based editor and execute it remotely, with results displayed in real-time. The application is built with a React frontend and Express backend, utilizing a modern tech stack with TypeScript, Tailwind CSS, and shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite

**Design System**
The application uses a custom design system inspired by Linear and Vercel, emphasizing minimalism and functionality. Key design decisions include:
- Typography based on Inter font family
- Consistent spacing primitives using Tailwind units (2, 4, 6, 8, 12, 16, 24)
- Component-based architecture with reusable UI elements
- Custom color system with CSS variables for theming support
- Hover and active elevation effects for interactive elements

**Component Structure**
- Comprehensive shadcn/ui component library including buttons, cards, dialogs, forms, and more
- Custom styling with "New York" variant of shadcn components
- Path aliases configured for clean imports (`@/components`, `@/lib`, etc.)

### Backend Architecture

**Technology Stack**
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ESM modules
- **Build Tool**: esbuild for production bundling
- **Development**: tsx for TypeScript execution

**API Design**
The backend follows a RESTful API pattern with the following endpoints:
- `GET /api/health` - Health check endpoint
- `POST /api/compile` - Java code compilation and execution endpoint

**Code Execution Flow**
1. Receive Java source code from frontend
2. Create temporary directory for compilation
3. Extract class name from code using regex
4. Write code to temporary `.java` file
5. Execute `javac` compiler in isolated directory
6. Run compiled class with `java` command
7. Capture stdout/stderr output
8. Clean up temporary files
9. Return execution results to frontend

**Security Considerations**
- 10-second timeout on compilation/execution to prevent resource exhaustion
- Isolated temporary directories per request using UUIDs
- File system cleanup after execution

### Data Storage

**Current Implementation**
- In-memory storage using JavaScript Map for user data
- Simple storage interface (`IStorage`) with methods for user CRUD operations
- No persistent database currently configured

**Database Schema Preparation**
The application includes Drizzle ORM configuration for PostgreSQL:
- Schema defined in `shared/schema.ts` with users table
- Migration support configured but not actively used
- Zod validation schemas derived from Drizzle schema

**Design Decision**: The application uses in-memory storage for simplicity, but is architected to easily swap in PostgreSQL through the storage interface abstraction.

### Build and Deployment

**Development Mode**
- Vite dev server with HMR (Hot Module Replacement)
- Vite middleware integrated into Express
- Development-only plugins for error overlay and debugging

**Production Build**
- Client: Vite builds static assets to `dist/public`
- Server: esbuild bundles server code to single CJS file
- Dependency bundling with allowlist strategy to reduce cold start times
- Static file serving from Express

**Build Optimization**
Certain dependencies are bundled with the server (allowlist includes drizzle-orm, express libraries, etc.) to reduce the number of file system calls and improve cold start performance.

### Authentication & Session Management

**Prepared Infrastructure**
- Express session middleware configured (connect-pg-simple for session store)
- User schema includes username/password fields
- No active authentication flow implemented

**Design Decision**: Authentication infrastructure is prepared but not actively used in the current Java compiler feature set.

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React DOM, TanStack Query for data fetching
- **UI Framework**: Radix UI primitives (20+ component packages)
- **Styling**: Tailwind CSS, class-variance-authority for component variants, clsx for conditional classes
- **Form Handling**: React Hook Form with Zod resolvers for validation
- **Icons**: Lucide React
- **Date Handling**: date-fns

### Development Tools
- **TypeScript**: Type checking across fullstack application
- **Vite**: Frontend build tool and dev server
- **esbuild**: Server-side bundling for production
- **tsx**: TypeScript execution for development
- **Drizzle Kit**: Database migration tool

### Backend Services
- **Express.js**: Web server framework
- **Drizzle ORM**: Database ORM (configured for PostgreSQL)
- **pg**: PostgreSQL client library

### Replit-Specific Plugins
- `@replit/vite-plugin-runtime-error-modal`: Development error overlay
- `@replit/vite-plugin-cartographer`: Code mapping tool
- `@replit/vite-plugin-dev-banner`: Development banner

### Java Runtime
- Requires Java JDK installed on the system
- Uses `javac` compiler and `java` runtime executables
- Executes commands via Node.js `child_process.exec`