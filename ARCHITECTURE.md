# System Architecture Documentation

## Overview

The User Management System is a full-stack web application following a modern client-server architecture with clear separation of concerns.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│                    (React + TypeScript)                     │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Landing   │  │    Login    │  │  Register   │       │
│  │    Page     │  │    Page     │  │    Page     │       │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │
│         │                 │                 │              │
│         └─────────────────┼─────────────────┘              │
│                           │                                │
│                  ┌────────▼────────┐                       │
│                  │   Admin Panel   │                       │
│                  │   (Dashboard)   │                       │
│                  └────────┬────────┘                       │
└───────────────────────────┼──────────────────────────────┘
                            │
                   ┌────────▼────────┐
                   │   API Service   │
                   │ (Axios + JWT)   │
                   └────────┬────────┘
                            │
┌───────────────────────────┼──────────────────────────────┐
│                  SERVER LAYER                             │
│                 (Express.js)                              │
│                           │                               │
│  ┌────────────────────────▼─────────────────────────┐   │
│  │           Middleware Stack                        │   │
│  │  ┌─────────────────────────────────────────────┐ │   │
│  │  │  CORS + Helmet (Security Headers)           │ │   │
│  │  └───────────────────┬─────────────────────────┘ │   │
│  │  ┌──────────────────▼──────────────────────────┐ │   │
│  │  │  Body Parser (JSON + URL Encoded)           │ │   │
│  │  └───────────────────┬─────────────────────────┘ │   │
│  │  ┌──────────────────▼──────────────────────────┐ │   │
│  │  │  Static Files (/uploads for images)         │ │   │
│  │  └───────────────────┬─────────────────────────┘ │   │
│  └────────────────────────┬─────────────────────────┘   │
│                           │                              │
│  ┌────────────────────────▼─────────────────────────┐   │
│  │           Route Layer                             │   │
│  │  ┌────────────────┐  ┌────────────────────────┐  │   │
│  │  │  Auth Routes   │  │    User Routes         │  │   │
│  │  │  /api/auth/*   │  │    /api/users/*        │  │   │
│  │  │  - register    │  │    - GET (all)         │  │   │
│  │  │  - login       │  │    - GET /:id          │  │   │
│  │  │  - refresh     │  │    - PUT /:id          │  │   │
│  │  │                │  │    - DELETE /:id       │  │   │
│  │  └───────┬────────┘  └────────┬───────────────┘  │   │
│  └──────────┼──────────────────────┼──────────────────┘   │
│             │                      │                      │
│  ┌──────────▼──────────────────────▼──────────────────┐   │
│  │         Controller Layer                           │   │
│  │  ┌─────────────────┐  ┌──────────────────────────┐│   │
│  │  │ Auth Controller │  │   User Controller        ││   │
│  │  │  - register()   │  │   - getAllUsers()        ││   │
│  │  │  - login()      │  │   - getUserById()        ││   │
│  │  │  - refresh()    │  │   - updateUser()         ││   │
│  │  │                 │  │   - deleteUser()         ││   │
│  │  └────────┬────────┘  └────────┬─────────────────┘│   │
│  └───────────┼──────────────────────┼──────────────────┘   │
│              │                      │                      │
│  ┌───────────▼──────────────────────▼──────────────────┐   │
│  │         Validation & Authentication                 │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  Input Validation (express-validator)       │   │   │
│  │  │  - registerValidation                       │   │   │
│  │  │  - loginValidation                          │   │   │
│  │  │  - updateValidation                         │   │   │
│  │  └────────────────┬────────────────────────────┘   │   │
│  │  ┌───────────────▼─────────────────────────────┐   │   │
│  │  │  JWT Authentication Middleware              │   │   │
│  │  │  - verifyToken()                            │   │   │
│  │  │  - isAdmin()                                │   │   │
│  │  └────────────────┬────────────────────────────┘   │   │
│  │  ┌───────────────▼─────────────────────────────┐   │   │
│  │  │  File Upload (Multer)                       │   │   │
│  │  │  - Image validation                         │   │   │
│  │  │  - Size limits (2MB)                        │   │   │
│  │  │  - Type checking                            │   │   │
│  │  └────────────────┬────────────────────────────┘   │   │
│  └───────────────────┼──────────────────────────────────┘   │
│                      │                                      │
│  ┌───────────────────▼──────────────────────────────────┐   │
│  │         Data Access Layer                            │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │  In-Memory Database (db.js)                   │  │   │
│  │  │  ┌─────────────────────────────────────────┐ │  │   │
│  │  │  │  Users Array (Hard-coded sample data)   │ │  │   │
│  │  │  │  - Admin User                            │ │  │   │
│  │  │  │  - Sample Users (4)                      │ │  │   │
│  │  │  └─────────────────────────────────────────┘ │  │   │
│  │  │  ┌─────────────────────────────────────────┐ │  │   │
│  │  │  │  Database Operations                     │ │  │   │
│  │  │  │  - getAllUsers()                         │ │  │   │
│  │  │  │  - getUserById()                         │ │  │   │
│  │  │  │  - getUserByEmail()                      │ │  │   │
│  │  │  │  - getUserByPhone()                      │ │  │   │
│  │  │  │  - getUserByEmailOrPhone()               │ │  │   │
│  │  │  │  - createUser()                          │ │  │   │
│  │  │  │  - updateUser()                          │ │  │   │
│  │  │  │  - deleteUser()                          │ │  │   │
│  │  │  │  - searchUsers()                         │ │  │   │
│  │  │  └─────────────────────────────────────────┘ │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │  Commented MySQL Queries (For Future)         │  │   │
│  │  │  - Complete SQL equivalents                   │  │   │
│  │  │  - Ready for database migration               │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                    FILE SYSTEM LAYER                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Local File Storage                                    │  │
│  │  /server/uploads/                                      │  │
│  │  - Profile images                                      │  │
│  │  - Auto-generated filenames                           │  │
│  │  - Served as static files                             │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

```
src/
├── pages/
│   ├── Index.tsx           # Landing page with feature showcase
│   ├── Login.tsx           # Login form with validation
│   ├── Register.tsx        # Registration form with image upload
│   ├── Dashboard.tsx       # Admin dashboard with user management
│   └── NotFound.tsx        # 404 error page
├── components/
│   ├── UserTable.tsx       # User listing table with search
│   ├── UserModal.tsx       # User view/edit/delete modal
│   └── ui/                 # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── table.tsx
│       └── ...
├── services/
│   └── api.ts             # API service with interceptors
├── hooks/
│   └── use-toast.ts       # Toast notification hook
└── lib/
    └── utils.ts           # Utility functions
```

### Backend Structure

```
server/
├── config/
│   └── db.js              # In-memory database & operations
├── controllers/
│   ├── auth.controller.js # Authentication logic
│   └── user.controller.js # User CRUD operations
├── middleware/
│   ├── auth.middleware.js      # JWT verification
│   ├── upload.middleware.js    # File upload handling
│   └── validation.middleware.js # Input validation
├── routes/
│   ├── auth.routes.js     # Auth endpoints
│   └── user.routes.js     # User endpoints
├── uploads/               # Uploaded images
├── .env.example          # Environment variables template
├── server.js             # Main server file
└── package.json          # Backend dependencies
```

## Data Flow Diagrams

### Registration Flow

```
┌──────────┐
│   User   │
└────┬─────┘
     │ Fills registration form
     ▼
┌────────────────┐
│  Register.tsx  │
└────┬───────────┘
     │ 1. Client-side validation (HTML5 patterns)
     │ 2. FormData creation (including image)
     ▼
┌────────────────┐
│   API Service  │
│   (axios)      │
└────┬───────────┘
     │ POST /api/auth/register
     │ Content-Type: multipart/form-data
     ▼
┌────────────────────┐
│  Express Server    │
│  ┌──────────────┐  │
│  │ Multer       │  │ 3. File upload middleware
│  │ Middleware   │  │    - Validate file type (jpg/png)
│  └──────┬───────┘  │    - Check file size (max 2MB)
│         │          │    - Save to /uploads
│  ┌──────▼───────┐  │
│  │ Validation   │  │ 4. Input validation
│  │ Middleware   │  │    - Name (min 3, alphabets)
│  └──────┬───────┘  │    - Email (valid format)
│         │          │    - Phone (10-15 digits)
│  ┌──────▼───────┐  │    - Password (min 6, 1 number)
│  │ Auth         │  │    - etc.
│  │ Controller   │  │
│  └──────┬───────┘  │
│         │          │
└─────────┼──────────┘
          │
          ▼
┌──────────────────┐
│   Database       │
│   (In-Memory)    │
└────┬─────────────┘
     │ 5. Check duplicates
     │    - Email unique?
     │    - Phone unique?
     │ 6. Hash password (bcrypt)
     │ 7. Create user record
     │ 8. Generate JWT tokens
     │    - Access token (1h)
     │    - Refresh token (7d)
     ▼
┌──────────────────┐
│   Response       │
│   {              │
│     user: {...}, │
│     tokens       │
│   }              │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│  Frontend        │
│  - Store tokens  │ 9. Save to localStorage
│  - Redirect      │ 10. Navigate to /login
└──────────────────┘
```

### Login & Authentication Flow

```
┌──────────┐
│   User   │
└────┬─────┘
     │ Enters credentials
     ▼
┌────────────────┐
│   Login.tsx    │
└────┬───────────┘
     │ Email/Phone + Password
     ▼
┌────────────────┐
│  API Service   │
└────┬───────────┘
     │ POST /api/auth/login
     ▼
┌────────────────────┐
│  Auth Controller   │
│  1. Find user      │
│  2. Verify pwd     │ bcrypt.compare()
│  3. Generate JWT   │
└────┬───────────────┘
     │ Return: { user, accessToken, refreshToken }
     ▼
┌────────────────────┐
│  Frontend          │
│  localStorage:     │
│  - accessToken     │
│  - refreshToken    │
│  - user            │
└────┬───────────────┘
     │ Navigate to /dashboard
     ▼
┌────────────────────┐
│  Dashboard.tsx     │
│  useEffect:        │
│  - Check auth      │
│  - Verify admin    │
└────┬───────────────┘
     │ Fetch users
     ▼
┌────────────────────┐
│  API Request       │
│  GET /api/users    │
│  Header: Bearer    │
│  <accessToken>     │
└────┬───────────────┘
     │
     ▼
┌────────────────────┐
│  Auth Middleware   │
│  1. Extract token  │
│  2. Verify JWT     │
│  3. Check expiry   │
│  4. Add user to    │
│     req.user       │
└────┬───────────────┘
     │ Valid token
     ▼
┌────────────────────┐
│  isAdmin           │
│  Middleware        │
│  - Check role      │
└────┬───────────────┘
     │ role === 'admin'
     ▼
┌────────────────────┐
│  User Controller   │
│  - getAllUsers()   │
└────┬───────────────┘
     │ Return users
     ▼
┌────────────────────┐
│  Dashboard         │
│  - Display table   │
│  - Enable actions  │
└────────────────────┘
```

### Token Refresh Flow

```
┌────────────────────┐
│  API Request       │
│  (any protected    │
│   endpoint)        │
└────┬───────────────┘
     │ Header: Bearer <expired_token>
     ▼
┌────────────────────┐
│  Server            │
│  JWT Verification  │
└────┬───────────────┘
     │ TokenExpiredError
     │ Status: 401
     ▼
┌────────────────────┐
│  Axios Interceptor │
│  (response error)  │
└────┬───────────────┘
     │ 1. Check if 401
     │ 2. Check if not already retrying
     │ 3. Get refreshToken from localStorage
     ▼
┌────────────────────┐
│  POST /api/auth/   │
│       refresh      │
│  { refreshToken }  │
└────┬───────────────┘
     │
     ▼
┌────────────────────┐
│  Auth Controller   │
│  1. Verify refresh │
│     token          │
│  2. Generate new   │
│     access token   │
└────┬───────────────┘
     │ { accessToken, refreshToken }
     ▼
┌────────────────────┐
│  Interceptor       │
│  1. Update token   │
│     in localStorage│
│  2. Update request │
│     header         │
│  3. Retry original │
│     request        │
└────┬───────────────┘
     │ Success
     ▼
┌────────────────────┐
│  Original Request  │
│  Succeeds          │
└────────────────────┘

     │ OR (if refresh fails)
     ▼
┌────────────────────┐
│  Logout User       │
│  1. Clear storage  │
│  2. Redirect to    │
│     /login         │
└────────────────────┘
```

### CRUD Operations Flow (Admin)

```
┌────────────────────┐
│   Dashboard        │
│   (Admin Panel)    │
└────┬───────────────┘
     │
     ├─────────────── View User ──────────────┐
     │                                        │
     │ Click "View"                           ▼
     ▼                              ┌──────────────────┐
┌────────────────────┐              │  UserModal       │
│  UserTable         │              │  - Display info  │
│  - User row        │              │  - Show badge    │
└────┬───────────────┘              │  - Created/      │
     │                               │    Updated dates │
     │                               └──────────────────┘
     │
     ├─────────────── Edit User ──────────────┐
     │                                        │
     │ Click "Edit"                           ▼
     ▼                              ┌──────────────────┐
┌────────────────────┐              │  UserModal       │
│  Selected User     │              │  (Edit Mode)     │
└────┬───────────────┘              │  ┌────────────┐  │
     │                               │  │ Form       │  │
     │                               │  │ - Inputs   │  │
     │                               │  │ - Validate │  │
     │                               │  └────┬───────┘  │
     │                               └───────┼──────────┘
     │ PUT /api/users/:id                    │
     │ (FormData + image)                    │
     ▼                                       ▼
┌────────────────────┐              ┌──────────────────┐
│  Server            │              │  Frontend        │
│  1. Verify JWT     │              │  1. Success msg  │
│  2. Check admin    │              │  2. Refresh data │
│  3. Validate input │              │  3. Close modal  │
│  4. Check dups     │              └──────────────────┘
│  5. Update record  │
│  6. Handle image   │
│     - Delete old   │
│     - Save new     │
└────┬───────────────┘
     │ Return updated user
     ▼
┌────────────────────┐
│  Dashboard         │
│  - Refresh table   │
└────────────────────┘
     │
     ├─────────────── Delete User ────────────┐
     │                                        │
     │ Click "Delete"                         ▼
     ▼                              ┌──────────────────┐
┌────────────────────┐              │  AlertDialog     │
│  Confirmation      │              │  - Confirm       │
│  Dialog            │◄─────────────┤    message       │
└────┬───────────────┘              │  - User name     │
     │ Confirm                       └──────────────────┘
     │
     │ DELETE /api/users/:id
     ▼
┌────────────────────┐
│  Server            │
│  1. Verify JWT     │
│  2. Check admin    │
│  3. Find user      │
│  4. Prevent self   │
│     deletion       │
│  5. Delete image   │
│  6. Delete record  │
└────┬───────────────┘
     │ Success
     ▼
┌────────────────────┐
│  Dashboard         │
│  1. Success toast  │
│  2. Refresh table  │
│  3. Close modal    │
└────────────────────┘
```

## Security Architecture

### Authentication & Authorization

```
┌──────────────────────────────────────────────┐
│         Security Layers                       │
├──────────────────────────────────────────────┤
│                                               │
│  1. Input Validation Layer                   │
│     ┌──────────────────────────────────┐    │
│     │  Frontend (HTML5 patterns)       │    │
│     │  - Name: [A-Za-z\s]{3,}          │    │
│     │  - Phone: [0-9]{10,15}           │    │
│     │  - Password: .{6,} + digit       │    │
│     └──────────────┬───────────────────┘    │
│                    │                         │
│     ┌──────────────▼───────────────────┐    │
│     │  Backend (express-validator)     │    │
│     │  - Sanitization                  │    │
│     │  - Type checking                 │    │
│     │  - Custom validators             │    │
│     └──────────────────────────────────┘    │
│                                               │
│  2. Password Security Layer                  │
│     ┌──────────────────────────────────┐    │
│     │  bcrypt                          │    │
│     │  - Salt rounds: 10               │    │
│     │  - Hash on registration          │    │
│     │  - Compare on login              │    │
│     │  - Never store plaintext         │    │
│     │  - Never return in response      │    │
│     └──────────────────────────────────┘    │
│                                               │
│  3. Authentication Layer (JWT)               │
│     ┌──────────────────────────────────┐    │
│     │  Access Token                    │    │
│     │  - Expires: 1 hour               │    │
│     │  - Payload: id, email, role      │    │
│     │  - Secret: JWT_SECRET            │    │
│     └──────────────┬───────────────────┘    │
│                    │                         │
│     ┌──────────────▼───────────────────┐    │
│     │  Refresh Token                   │    │
│     │  - Expires: 7 days               │    │
│     │  - Secret: JWT_REFRESH_SECRET    │    │
│     │  - Used for token renewal        │    │
│     └──────────────────────────────────┘    │
│                                               │
│  4. Authorization Layer (RBAC)               │
│     ┌──────────────────────────────────┐    │
│     │  Role-Based Access Control       │    │
│     │  ┌────────────┐  ┌────────────┐ │    │
│     │  │   Admin    │  │    User    │ │    │
│     │  │ - All CRUD │  │ - Limited  │ │    │
│     │  │ - Access   │  │ - Read own │ │    │
│     │  │   dashboard│  │   profile  │ │    │
│     │  └────────────┘  └────────────┘ │    │
│     └──────────────────────────────────┘    │
│                                               │
│  5. HTTP Security Layer                      │
│     ┌──────────────────────────────────┐    │
│     │  CORS                            │    │
│     │  - Origin: localhost:8080        │    │
│     │  - Credentials: true             │    │
│     └──────────────┬───────────────────┘    │
│                    │                         │
│     ┌──────────────▼───────────────────┐    │
│     │  Helmet.js                       │    │
│     │  - Content Security Policy       │    │
│     │  - X-Frame-Options               │    │
│     │  - X-Content-Type-Options        │    │
│     │  - Strict-Transport-Security     │    │
│     └──────────────────────────────────┘    │
│                                               │
│  6. File Upload Security                     │
│     ┌──────────────────────────────────┐    │
│     │  Multer Validation               │    │
│     │  - Type: image/jpeg, image/png   │    │
│     │  - Size: max 2MB                 │    │
│     │  - Filename: sanitized           │    │
│     │  - Path: controlled              │    │
│     └──────────────────────────────────┘    │
│                                               │
└───────────────────────────────────────────────┘
```

## Database Schema (For Future Implementation)

### ER Diagram

```
┌─────────────────────────────────────────┐
│                  users                  │
├─────────────────────────────────────────┤
│ PK  id              INT AUTO_INCREMENT  │
│     name            VARCHAR(100)        │
│ UK  email           VARCHAR(255)        │
│ UK  phone           VARCHAR(15)         │
│     password        VARCHAR(255)        │ (bcrypt hashed)
│     profile_image   VARCHAR(255)        │
│     address         VARCHAR(150)        │
│     state           VARCHAR(50)         │
│     city            VARCHAR(50)         │
│     country         VARCHAR(50)         │
│     pincode         VARCHAR(10)         │
│     role            ENUM('user','admin')│
│     created_at      TIMESTAMP           │
│     updated_at      TIMESTAMP           │
└─────────────────────────────────────────┘

Indexes:
- PRIMARY KEY (id)
- UNIQUE KEY (email)
- UNIQUE KEY (phone)
- INDEX (role)
- INDEX (created_at)
```

## Scalability Considerations

### Current Limitations & Future Solutions

```
┌──────────────────────────────────────────────────┐
│         Current State → Future State             │
├──────────────────────────────────────────────────┤
│                                                   │
│  Data Storage:                                   │
│  In-Memory Array → MySQL/PostgreSQL              │
│  - Lost on restart → Persistent                  │
│  - Limited size → Unlimited                      │
│  - No transactions → ACID compliant              │
│                                                   │
│  File Storage:                                   │
│  Local Disk → Cloud Storage (S3/CloudFlare)      │
│  - Not scalable → Distributed                    │
│  - Single server → CDN                           │
│  - No backup → Automatic backup                  │
│                                                   │
│  Authentication:                                  │
│  In-Memory Tokens → Redis Session Store          │
│  - Token blacklist → Fast invalidation           │
│  - Rate limiting → Distributed rate limit        │
│                                                   │
│  Search:                                          │
│  Array filter → Elasticsearch                    │
│  - Slow on large data → Fast full-text search    │
│  - Basic matching → Advanced queries             │
│                                                   │
│  API:                                             │
│  Single server → Load Balanced                   │
│  - Single point of failure → High availability   │
│  - Limited requests → Horizontal scaling         │
│                                                   │
└──────────────────────────────────────────────────┘
```

## Performance Optimization

### Frontend Optimizations

1. **Code Splitting**
   - React.lazy for route-based splitting
   - Dynamic imports for heavy components

2. **State Management**
   - React Query for server state
   - localStorage for auth persistence
   - Minimize re-renders

3. **Asset Optimization**
   - Image compression
   - Lazy loading
   - CDN for static assets

### Backend Optimizations

1. **Database** (Future)
   - Indexes on frequently queried fields
   - Connection pooling
   - Query optimization

2. **Caching** (Future)
   - Redis for session data
   - Cache frequent queries
   - CDN for uploaded images

3. **API**
   - Response compression
   - Pagination for large datasets
   - Rate limiting

## Deployment Architecture

### Development Environment

```
┌──────────────┐     ┌──────────────┐
│   Frontend   │     │   Backend    │
│  localhost:  │────▶│  localhost:  │
│    8080      │     │    5000      │
│              │     │              │
│  - Vite dev  │     │ - nodemon    │
│  - Hot reload│     │ - Auto reload│
└──────────────┘     └──────────────┘
```

### Production Architecture (Recommended)

```
┌────────────────────────────────────────────┐
│             CDN (CloudFlare)               │
│          Static Assets + Images           │
└──────────────┬─────────────────────────────┘
               │
┌──────────────▼─────────────────────────────┐
│          Load Balancer (Nginx)             │
└──────────────┬─────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌──────▼──────┐
│  Frontend   │  │  Frontend   │
│  Server 1   │  │  Server 2   │
│  (React)    │  │  (React)    │
└─────────────┘  └─────────────┘
       │                │
       └───────┬────────┘
               │
┌──────────────▼─────────────────────────────┐
│          API Gateway                       │
└──────────────┬─────────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌──────▼──────┐
│   Backend   │  │   Backend   │
│   Server 1  │  │   Server 2  │
│  (Express)  │  │  (Express)  │
└──────┬──────┘  └──────┬──────┘
       │                │
       └───────┬────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼──────┐  ┌──────▼──────┐
│   MySQL     │  │    Redis    │
│  (Primary)  │  │  (Sessions) │
└──────┬──────┘  └─────────────┘
       │
┌──────▼──────┐
│   MySQL     │
│  (Replica)  │
└─────────────┘
```

---

**Last Updated:** 2025-11-27
