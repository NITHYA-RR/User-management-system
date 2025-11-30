# Backend Server - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and update the values (especially JWT secrets!)
```

### 3. Start the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on: **http://localhost:5000**

## Default Users

The system comes with pre-configured sample users:

### Admin User
- Email: `admin@example.com`
- Phone: `1234567890`
- Password: `admin123`

### Regular Users
1. John Doe - `john@example.com` / `9876543210` / `john123`
2. Jane Smith - `jane@example.com` / `5551234567` / `jane123`
3. Mike Johnson - `mike@example.com` / `4445556666` / `mike123`
4. Sarah Williams - `sarah@example.com` / `7778889999` / `sarah123`

## API Testing

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin@example.com",
    "password": "admin123"
  }'
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| JWT_SECRET | Secret key for access tokens | (required) |
| JWT_REFRESH_SECRET | Secret key for refresh tokens | (required) |
| JWT_EXPIRE | Access token expiry | 1h |
| JWT_REFRESH_EXPIRE | Refresh token expiry | 7d |
| NODE_ENV | Environment | development |

**⚠️ IMPORTANT**: Change JWT secrets in production!

## Project Structure

```
server/
├── config/
│   └── db.js                 # In-memory database
├── controllers/
│   ├── auth.controller.js    # Authentication logic
│   └── user.controller.js    # User CRUD operations
├── middleware/
│   ├── auth.middleware.js    # JWT verification
│   ├── upload.middleware.js  # File upload handling
│   └── validation.middleware.js # Input validation
├── routes/
│   ├── auth.routes.js        # Auth endpoints
│   └── user.routes.js        # User endpoints
├── uploads/                  # Uploaded images directory
├── .env                      # Environment variables (create from .env.example)
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
├── server.js                # Main server file
└── README.md               # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### User Management (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

See **API_DOCUMENTATION.md** in the root directory for detailed API documentation.

## Notes

### In-Memory Database
- Data is stored in memory and will be lost on server restart
- Includes commented MySQL queries for future database implementation
- See `config/db.js` for database operations

### File Uploads
- Images are stored in `uploads/` directory
- Max file size: 2MB
- Allowed formats: JPG, JPEG, PNG
- Files are served as static assets at `/uploads/*`

### Security Features
- Password hashing with bcrypt
- JWT authentication
- Input validation
- CORS protection
- Helmet security headers
- File upload validation

## Common Issues

### Port Already in Use
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9
```

### Missing Dependencies
```bash
# Reinstall all dependencies
rm -rf node_modules
npm install
```

### CORS Errors
- Check that frontend is running on `http://localhost:8080`
- Update CORS origin in `server.js` if needed

## Migrating to MySQL

To switch from in-memory storage to MySQL:

1. Install MySQL client:
```bash
npm install mysql2
```

2. Uncomment MySQL configuration in `config/db.js`

3. Create database and table:
```sql
CREATE DATABASE user_management;
USE user_management;

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

4. Update environment variables:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=user_management
```

5. Replace in-memory operations with MySQL queries (already commented in code)

## Production Deployment

### Checklist
- [ ] Change JWT secrets to strong random strings
- [ ] Set NODE_ENV to 'production'
- [ ] Configure proper CORS origins
- [ ] Set up proper database (MySQL/PostgreSQL)
- [ ] Use cloud storage for images (S3/CloudFlare)
- [ ] Enable rate limiting
- [ ] Set up logging (Winston/Morgan)
- [ ] Configure SSL/HTTPS
- [ ] Set up monitoring (PM2/New Relic)
- [ ] Implement proper error tracking

### Recommended Hosting
- **Backend**: Heroku, Railway, DigitalOcean, AWS
- **Database**: AWS RDS, DigitalOcean Managed MySQL
- **Storage**: AWS S3, CloudFlare R2, DigitalOcean Spaces

## Support

For detailed API documentation, see:
- **API_DOCUMENTATION.md** - Complete API reference
- **ARCHITECTURE.md** - System architecture details
- **README.md** (root) - Main project documentation
