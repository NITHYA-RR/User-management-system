# API Documentation

Complete REST API documentation for the User Management System.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ /* validation errors if any */ ]
}
```

---

## Authentication Endpoints

### 1. Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Content-Type:** `multipart/form-data`

**Request Body:**
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| name | string | Yes | Min 3 chars, alphabets only | User's full name |
| email | string | Yes | Valid email format | User's email address |
| phone | string | Yes | 10-15 digits | User's phone number |
| password | string | Yes | Min 6 chars, at least 1 number | User's password |
| address | string | No | Max 150 chars | User's address |
| state | string | Yes | - | User's state |
| city | string | Yes | - | User's city |
| country | string | Yes | - | User's country |
| pincode | string | Yes | 4-10 digits | User's postal code |
| profile_image | file | No | JPG/PNG, max 2MB | User's profile picture |

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "profile_image": "/uploads/profile-123456789.jpg",
      "address": "123 Main St",
      "state": "California",
      "city": "San Francisco",
      "country": "USA",
      "pincode": "94102",
      "role": "user",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400` - Validation errors
- `409` - Email or phone already exists
- `500` - Server error

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "phone=1234567890" \
  -F "password=john123" \
  -F "state=California" \
  -F "city=San Francisco" \
  -F "country=USA" \
  -F "pincode=94102" \
  -F "profile_image=@/path/to/image.jpg"
```

---

### 2. Login

Authenticate a user and receive JWT tokens.

**Endpoint:** `POST /auth/login`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "identifier": "admin@example.com",  // Email OR phone number
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "phone": "1234567890",
      "role": "admin",
      ...
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400` - Validation errors
- `401` - Invalid credentials
- `500` - Server error

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin@example.com",
    "password": "admin123"
  }'
```

---

### 3. Refresh Token

Get a new access token using refresh token.

**Endpoint:** `POST /auth/refresh`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `401` - No refresh token provided
- `403` - Invalid refresh token
- `404` - User not found
- `500` - Server error

---

## User Management Endpoints

**All user endpoints require:**
- Valid JWT token in Authorization header
- Admin role

---

### 4. Get All Users

Retrieve list of all users with optional search.

**Endpoint:** `GET /users?search={searchTerm}`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Search across name, email, phone, state, city |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "profile_image": "/uploads/profile-123456789.jpg",
      "address": "123 Main St",
      "state": "California",
      "city": "San Francisco",
      "country": "USA",
      "pincode": "94102",
      "role": "user",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    ...
  ],
  "count": 5
}
```

**Error Responses:**
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (not admin)
- `500` - Server error

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/users?search=john" \
  -H "Authorization: Bearer <your_access_token>"
```

---

### 5. Get User by ID

Retrieve a single user's details.

**Endpoint:** `GET /users/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | User ID |

**Success Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    ...
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Forbidden (not admin)
- `404` - User not found
- `500` - Server error

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/users/1 \
  -H "Authorization: Bearer <your_access_token>"
```

---

### 6. Update User

Update user information.

**Endpoint:** `PUT /users/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**Content-Type:** `multipart/form-data`

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | User ID to update |

**Request Body (all optional):**
| Field | Type | Validation | Description |
|-------|------|------------|-------------|
| name | string | Min 3 chars, alphabets only | Updated name |
| email | string | Valid email format | Updated email |
| phone | string | 10-15 digits | Updated phone |
| address | string | Max 150 chars | Updated address |
| state | string | - | Updated state |
| city | string | - | Updated city |
| country | string | - | Updated country |
| pincode | string | 4-10 digits | Updated pincode |
| profile_image | file | JPG/PNG, max 2MB | Updated profile picture |
| password | string | Min 6 chars, at least 1 number | New password (optional) |

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "John Updated",
    ...
  }
}
```

**Error Responses:**
- `400` - Validation errors
- `401` - Unauthorized
- `403` - Forbidden (not admin)
- `404` - User not found
- `409` - Email or phone already in use
- `500` - Server error

**cURL Example:**
```bash
curl -X PUT http://localhost:5000/api/users/1 \
  -H "Authorization: Bearer <your_access_token>" \
  -F "name=John Updated" \
  -F "city=Los Angeles"
```

---

### 7. Delete User

Delete a user account.

**Endpoint:** `DELETE /users/:id`

**Headers:**
```
Authorization: Bearer <access_token>
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | integer | User ID to delete |

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Forbidden (not admin or trying to delete own account)
- `404` - User not found
- `500` - Server error

**cURL Example:**
```bash
curl -X DELETE http://localhost:5000/api/users/2 \
  -H "Authorization: Bearer <your_access_token>"
```

---

## Error Codes Reference

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data or validation errors |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Authenticated but not authorized for action |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists (duplicate email/phone) |
| 500 | Internal Server Error | Server-side error |

---

## JWT Token Structure

### Access Token Payload
```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234571490
}
```

### Token Expiry
- **Access Token**: 1 hour
- **Refresh Token**: 7 days

---

## Rate Limiting

Currently no rate limiting implemented. Recommended for production:
- Login endpoint: 5 requests per minute per IP
- Registration: 3 requests per minute per IP
- Other endpoints: 100 requests per minute per user

---

## Postman Collection

Import this into Postman for testing:

```json
{
  "info": {
    "name": "User Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "formdata",
              "formdata": [
                {"key": "name", "value": "John Doe", "type": "text"},
                {"key": "email", "value": "john@example.com", "type": "text"},
                {"key": "phone", "value": "1234567890", "type": "text"},
                {"key": "password", "value": "john123", "type": "text"},
                {"key": "state", "value": "California", "type": "text"},
                {"key": "city", "value": "San Francisco", "type": "text"},
                {"key": "country", "value": "USA", "type": "text"},
                {"key": "pincode", "value": "94102", "type": "text"}
              ]
            },
            "url": {
              "raw": "http://localhost:5000/api/auth/register",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"identifier\": \"admin@example.com\",\n  \"password\": \"admin123\"\n}"
            },
            "url": {
              "raw": "http://localhost:5000/api/auth/login",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Users",
      "item": [
        {
          "name": "Get All Users",
          "request": {
            "method": "GET",
            "header": [{"key": "Authorization", "value": "Bearer {{accessToken}}"}],
            "url": {
              "raw": "http://localhost:5000/api/users",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "users"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## MySQL Query Reference

Each operation in the codebase includes commented MySQL queries. Here's the complete reference:

### User Operations

**Get All Users:**
```sql
SELECT * FROM users ORDER BY created_at DESC;
```

**Search Users:**
```sql
SELECT * FROM users 
WHERE name LIKE ? 
   OR email LIKE ? 
   OR phone LIKE ? 
   OR state LIKE ? 
   OR city LIKE ?;
```

**Get User by ID:**
```sql
SELECT * FROM users WHERE id = ?;
```

**Get User by Email:**
```sql
SELECT * FROM users WHERE email = ?;
```

**Get User by Phone:**
```sql
SELECT * FROM users WHERE phone = ?;
```

**Get User by Email or Phone:**
```sql
SELECT * FROM users WHERE email = ? OR phone = ?;
```

**Create User:**
```sql
INSERT INTO users (
  name, email, phone, password, 
  profile_image, address, state, 
  city, country, pincode, role
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
```

**Update User:**
```sql
UPDATE users 
SET name = ?, 
    email = ?, 
    phone = ?, 
    address = ?, 
    state = ?, 
    city = ?, 
    country = ?, 
    pincode = ?, 
    profile_image = ?, 
    updated_at = NOW() 
WHERE id = ?;
```

**Delete User:**
```sql
DELETE FROM users WHERE id = ?;
```

---

## Testing

### Sample Test Data

**Admin User:**
```
Email: admin@example.com
Phone: 1234567890
Password: admin123
```

**Regular Users:**
1. John Doe - john@example.com / 9876543210 / john123
2. Jane Smith - jane@example.com / 5551234567 / jane123
3. Mike Johnson - mike@example.com / 4445556666 / mike123
4. Sarah Williams - sarah@example.com / 7778889999 / sarah123

---

**Last Updated:** 2025-11-27
