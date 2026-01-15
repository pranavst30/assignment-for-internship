# API Documentation - REST API with JWT & RBAC

**Base URL:** `http://localhost:5000/api/v1`

---

## Authentication

All protected routes require:
```
Authorization: Bearer <jwt_token>
```

| Role | Permissions |
|------|-------------|
| `USER` | View tasks only |
| `ADMIN` | Full CRUD access |

---

## Auth Routes

### Register User
`POST /auth/register`

**URL:** `http://localhost:5000/api/v1/auth/register`

**Request:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "password123",
  "role": "ADMIN"
}
```

**Response:** Returns user object + JWT token

```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "user": {
            "id": "6968a0767113996701afd189",
            "name": "Rahul Sharma",
            "email": "rahul@example.com",
            "role": "ADMIN",
            "createdAt": "2026-01-15T08:08:22.441Z"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTY4YTA3NjcxMTM5OTY3MDFhZmQxODkiLCJpYXQiOjE3Njg0NjQ1MDIsImV4cCI6MTc2ODU1MDkwMn0.8BDM6MSHYhDfBdO5d2c0jwS79HKTImvJBdiaE7y3jjA"
    }
}
```

---

### Login
`POST /auth/login`

**Request:**
```json
{
  "email": "rahul@example.com",
  "password": "password123"
}
```

**Response:** Returns user object + JWT token

```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": "6968a0767113996701afd189",
            "name": "Rahul Sharma",
            "email": "rahul@example.com",
            "role": "ADMIN"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTY4YTA3NjcxMTM5OTY3MDFhZmQxODkiLCJpYXQiOjE3Njg0NjQ1ODksImV4cCI6MTc2ODU1MDk4OX0.tjXOl6JKr7h39UhMmfT8d0oB2Pm6tozgDT66mn2brZo"
    }
}
```

---

### Get Current User
`GET /auth/me`

**Requires Auth**

**Response:**
```json
{
    "success": true,
    "data": {
        "user": {
            "id": "6968a0767113996701afd189",
            "name": "Rahul Sharma",
            "email": "rahul@example.com",
            "role": "ADMIN",
            "createdAt": "2026-01-15T08:08:22.441Z"
        }
    }
}
```

---

## Task Routes

> All task routes require authentication

### Get All Tasks
`GET /tasks?page=1&limit=10&status=PENDING`




**Response:**
```json
{
    "success": true,
    "message": "Tasks retrieved successfully",
    "data": {
        "tasks": [
            {
                "_id": "6968aca11ab007b8db72efbc",
                "title": "Complete API Documentation",
                "description": "Write docs for the API",
                "status": "PENDING",
                "priority": "HIGH",
                "createdBy": {
                    "_id": "6968a0767113996701afd189",
                    "name": "Rahul Sharma",
                    "email": "rahul@example.com"
                },
                "createdAt": "2026-01-15T09:00:17.586Z",
                "updatedAt": "2026-01-15T09:00:17.586Z",
                "id": "6968aca11ab007b8db72efbc"
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalItems": 1,
            "itemsPerPage": 10,
            "hasNextPage": false,
            "hasPrevPage": false
        }
    }
}
```

---

### Get Task by ID
`GET /tasks/:id`

**Response:**
```json
{
    "success": true,
    "message": "Tasks retrieved successfully",
    "data": {
        "tasks": [
            {
                "_id": "6968a49bae691488596d72b2",
                "title": "Complete API Documentation",
                "description": "Write docs for the API",
                "status": "PENDING",
                "priority": "HIGH",
                "createdBy": {
                    "_id": "6968a0767113996701afd189",
                    "name": "Rahul Sharma",
                    "email": "rahul@example.com"
                },
                "createdAt": "2026-01-15T08:26:03.009Z",
                "updatedAt": "2026-01-15T08:28:39.969Z",
                "id": "6968a49bae691488596d72b2"
            }
        ],
        "pagination": {
            "currentPage": 1,
            "totalPages": 1,
            "totalItems": 1,
            "itemsPerPage": 10,
            "hasNextPage": false,
            "hasPrevPage": false
        }
    }
}
```

---

### Create Task (ADMIN ONLY)
`POST /tasks`

**URL:** `http://localhost:5000/api/v1/tasks`

**Request:**
```json
{
  "title": "Complete API Documentation",
  "description": "Write docs for the API",
  "status": "PENDING",
  "priority": "HIGH"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Task created successfully",
    "data": {
        "task": {
            "title": "Complete API Documentation",
            "description": "Write docs for the API",
            "status": "PENDING",
            "priority": "HIGH",
            "createdBy": {
                "_id": "6968a0767113996701afd189",
                "name": "Rahul Sharma",
                "email": "rahul@example.com"
            },
            "_id": "6968a49bae691488596d72b2",
            "createdAt": "2026-01-15T08:26:03.009Z",
            "updatedAt": "2026-01-15T08:26:03.009Z",
            "id": "6968a49bae691488596d72b2"
        }
    }
}
```

---

### Update Task (ADMIN ONLY)
`PUT /tasks/:id`

**Request:**
```json
{
  "title": "Updated Title",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Task updated successfully",
    "data": {
        "task": {
            "_id": "6968a49bae691488596d72b2",
            "title": "Complete API Documentation",
            "description": "Write docs for the API",
            "status": "PENDING",
            "priority": "HIGH",
            "createdBy": {
                "_id": "6968a0767113996701afd189",
                "name": "Rahul Sharma",
                "email": "rahul@example.com"
            },
            "createdAt": "2026-01-15T08:26:03.009Z",
            "updatedAt": "2026-01-15T08:28:39.969Z",
            "id": "6968a49bae691488596d72b2"
        }
    }
}
```

---

### Delete Task (ADMIN ONLY)
`DELETE /tasks/:id`

**Response:**
```json
{
    "success": true,
    "message": "Task deleted successfully",
    "data": null
}
```

---

## Health Check
`GET /health` (No auth required)

**Response:**
```json
{
    "success": true,
    "message": "Server is running",
    "timestamp": "2026-01-15T08:34:16.376Z",
    "environment": "development"
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |

---

## Error Codes

| Code | Description |
|------|-------------|
| `EMAIL_EXISTS` | Email already registered |
| `INVALID_CREDENTIALS` | Wrong email/password |
| `UNAUTHORIZED` | Missing/invalid token |
| `TOKEN_EXPIRED` | JWT expired |
| `FORBIDDEN` | Insufficient permissions |
| `TASK_NOT_FOUND` | Task doesn't exist |
