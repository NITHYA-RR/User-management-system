# User Management System - Full Stack Project

A complete full-stack User Management System with premium UI, JWT authentication, and comprehensive CRUD operations.

## 🚀 Features

### Core Functionality
- **User Registration** with comprehensive validation
- **Login System** (supports email OR phone + password)
- **JWT Authentication** (Access + Refresh tokens)
- **Admin Dashboard** with modern UI
- **Complete CRUD Operations** for users
- **Image Upload** support with validation
- **Search & Filter** functionality
- **Role-Based Access Control** (Admin/User)

### Security Features
- Password encryption using bcrypt
- JWT token-based authentication
- Input validation (frontend + backend)
- CORS and Helmet security
- Protected admin routes
- Token refresh mechanism

## 🛠️ Technology Stack

### Frontend
- React.js (with TypeScript)
- Tailwind CSS (Custom Design System)
- shadcn/ui components
- React Router for navigation
- Axios for API calls

### Backend
- Express.js (Node.js)
- bcryptjs for password hashing
- jsonwebtoken for JWT
- Multer for file uploads
- express-validator for validation
- Helmet & CORS for security

### Database
Currently using **hard-coded in-memory data** with commented MySQL queries for future implementation.

## 📁 Project Structure

```
project-root/
├── src/                      # Frontend (React)
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn components
│   │   ├── UserTable.tsx   # User listing table
│   │   └── UserModal.tsx   # User view/edit modal
│   ├── pages/              # Route pages
│   │   ├── Index.tsx       # Landing page
│   │   ├── Login.tsx       # Login page
│   │   ├── Register.tsx    # Registration page
│   │   └── Dashboard.tsx   # Admin dashboard
│   ├── services/           # API services
│   │   └── api.ts         # API calls & interceptors
│   └── index.css          # Design system & styles
├── server/                 # Backend (Express)
│   ├── config/            # Configuration
│   │   └── db.js         # In-memory database
│   ├── controllers/       # Route controllers
│   │   ├── auth.controller.js
│   │   └── user.controller.js
│   ├── middleware/        # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── upload.middleware.js
│   │   └── validation.middleware.js
│   ├── routes/           # API routes
│   │   ├── auth.routes.js
│   │   └── user.routes.js
│   ├── uploads/          # Uploaded images
│   ├── .env.example      # Environment variables template
│   ├── server.js         # Main server file
│   └── package.json      # Backend dependencies
└── README.md            # This file
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd <project-directory>
```

2. **Setup Frontend**
```bash
# Install frontend dependencies
npm install

# Start frontend development server
npm run dev
```
Frontend will run on: http://localhost:8080

3. **Setup Backend**
```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Create .env file from example
cp .env.example .env

# Start backend server
npm run dev
```
Backend will run on: http://localhost:5000

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
NODE_ENV=development
```

## 📝 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: multipart/form-data

Body:
- name (required): string (min 3 chars, alphabets only)
- email (required): string (valid email)
- phone (required): string (10-15 digits)
- password (required): string (min 6 chars with at least one number)
- address (optional): string (max 150 chars)
- state (required): string
- city (required): string
- country (required): string
- pincode (required): string (4-10 digits)
- profile_image (optional): file (jpg/png, max 2MB)

Response: {
  success: true,
  message: "User registered successfully",
  data: {
    user: { ...userDetails },
    accessToken: "...",
    refreshToken: "..."
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

Body: {
  identifier: "email@example.com" or "1234567890",
  password: "password123"
}

Response: {
  success: true,
  message: "Login successful",
  data: {
    user: { ...userDetails },
    accessToken: "...",
    refreshToken: "..."
  }
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

Body: {
  refreshToken: "..."
}

Response: {
  success: true,
  data: {
    accessToken: "...",
    refreshToken: "..."
  }
}
```

### User Management Endpoints (Admin Only)

All user endpoints require:
- Header: `Authorization: Bearer <access_token>`
- Admin role

#### Get All Users
```http
GET /users?search=optional_search_term

Response: {
  success: true,
  data: [...users],
  count: number
}
```

#### Get Single User
```http
GET /users/:id

Response: {
  success: true,
  data: { ...userDetails }
}
```

#### Update User
```http
PUT /users/:id
Content-Type: multipart/form-data

Body: (all optional)
- name, email, phone, address, state, city, country, pincode
- profile_image: file

Response: {
  success: true,
  message: "User updated successfully",
  data: { ...updatedUser }
}
```

#### Delete User
```http
DELETE /users/:id

Response: {
  success: true,
  message: "User deleted successfully"
}
```

## 👤 Default Admin Credentials

```
Email: admin@example.com
Phone: 1234567890
Password: admin123
```

## 🗄️ Database Schema (For Reference)

Currently using in-memory storage. For MySQL implementation:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(15) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255),
  address VARCHAR(150),
  state VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  country VARCHAR(50) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🎨 Design System

The application uses a premium design system with:
- **Primary Color**: Deep Indigo/Blue (#4169E1)
- **Accent Color**: Vibrant Cyan/Teal (#0D9488)
- **Gradients**: Smooth primary-to-accent gradients
- **Shadows**: Elegant soft shadows with primary color tint
- **Animations**: Smooth transitions and hover effects
- **Typography**: Modern sans-serif with clear hierarchy

All colors are defined using HSL in `src/index.css` and mapped in `tailwind.config.ts`.

## 🔒 Security Best Practices

1. **Password Security**
   - Passwords hashed with bcrypt (salt rounds: 10)
   - Never returned in API responses

2. **JWT Tokens**
   - Access tokens expire in 1 hour
   - Refresh tokens expire in 7 days
   - Automatic token refresh on 401 errors

3. **Input Validation**
   - Frontend validation with HTML5 patterns
   - Backend validation with express-validator
   - File upload restrictions (type, size)

4. **API Security**
   - CORS enabled for frontend domain
   - Helmet.js for security headers
   - Protected routes with JWT middleware
   - Role-based access control

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Backend Deployment
```bash
cd server
npm start
# Deploy to Node.js hosting service (Heroku, Railway, etc.)
```

### Environment Setup
- Update CORS origin in `server/server.js`
- Set production environment variables
- Configure file upload path for production
- Implement actual database (MySQL recommended)

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Landing     │  │   Login      │  │   Register   │  │
│  │   Page       │  │    Page      │  │     Page     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │          │
│         └──────────────────┼──────────────────┘          │
│                            │                             │
│                   ┌────────▼────────┐                    │
│                   │   Dashboard     │                    │
│                   │  (Admin Only)   │                    │
│                   └────────┬────────┘                    │
│                            │                             │
└────────────────────────────┼─────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Service   │
                    │  (axios + JWT)  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────────────────────┐
                    │     Express Server              │
                    │  ┌──────────────────────────┐  │
                    │  │  Authentication Layer    │  │
                    │  │  - JWT Verification      │  │
                    │  │  - Token Refresh         │  │
                    │  └──────────┬───────────────┘  │
                    │             │                   │
                    │  ┌──────────▼───────────────┐  │
                    │  │    Route Handlers        │  │
                    │  │  - Auth Routes           │  │
                    │  │  - User Routes (Admin)   │  │
                    │  └──────────┬───────────────┘  │
                    │             │                   │
                    │  ┌──────────▼───────────────┐  │
                    │  │    Middleware            │  │
                    │  │  - Validation            │  │
                    │  │  - File Upload           │  │
                    │  │  - Error Handling        │  │
                    │  └──────────┬───────────────┘  │
                    │             │                   │
                    │  ┌──────────▼───────────────┐  │
                    │  │   In-Memory Database     │  │
                    │  │  (Hard-coded users)      │  │
                    │  │  + Commented MySQL       │  │
                    │  └──────────────────────────┘  │
                    └─────────────────────────────────┘
```

## 🔄 Data Flow

### Registration Flow
1. User fills registration form
2. Frontend validates input
3. API call with FormData (including image)
4. Backend validates data
5. Password hashed with bcrypt
6. User saved to database
7. JWT tokens generated
8. Response with user data + tokens

### Login Flow
1. User enters email/phone + password
2. Backend finds user by identifier
3. Password verified with bcrypt
4. JWT tokens generated
5. User data + tokens returned
6. Tokens stored in localStorage
7. Redirect to dashboard

### Protected Routes Flow
1. API request includes JWT token
2. Auth middleware verifies token
3. If expired, auto-refresh attempted
4. If refresh fails, redirect to login
5. If valid, request proceeds

## 🎯 Key Features Implementation

### Search & Filter
- Real-time search across name, email, phone, state, city
- Backend support for query parameters
- Frontend debouncing for performance

### Image Upload
- Local storage in `/uploads` directory
- Size limit: 2MB
- Format validation: JPG, JPEG, PNG
- Old image deletion on update

### Role-Based Access
- Admin can access dashboard
- Admin can CRUD all users
- Regular users cannot access admin routes
- Role checked in JWT token

## 🐛 Known Limitations

1. **In-Memory Database**: Data resets on server restart
2. **Local File Storage**: Images stored locally (not production-ready)
3. **No Email Verification**: Email verification not implemented
4. **No Password Reset**: Password reset functionality not included
5. **Limited Pagination**: No pagination on user list

## 🔮 Future Enhancements

- [ ] Implement actual MySQL database
- [ ] Add pagination and sorting
- [ ] Email verification system
- [ ] Password reset functionality
- [ ] Cloud storage for images (AWS S3)
- [ ] Rate limiting for APIs
- [ ] User activity logs
- [ ] Export users to CSV
- [ ] Advanced filtering options
- [ ] Docker containerization
- [ ] Unit and integration tests
- [ ] CI/CD pipeline

## 📞 Support

For issues or questions, please open an issue in the repository.

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using React, Express, and modern web technologies**
