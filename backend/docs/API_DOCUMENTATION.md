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

URL : http://localhost:5000/api/v1/auth/register
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "password123",
  "role": "ADMIN"
}
```

**Response:** Returns user object + JWT token

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
---

### Login
`POST /auth/login`

```json
{
  "email": "rahul@example.com",
  "password": "password123"
}
```

**Response:** Returns user object + JWT token
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
---

### Get Current User
`GET /auth/me`

**Requires Auth**

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

---

## Task Routes

> All task routes require authentication

### Get All Tasks
`GET /tasks?page=1&limit=10&status=PENDING`

**Query Params:** `page`, `limit`, `status` (optional)

---

### Get Task by ID
`GET /tasks/:id`

---

### Create Task (ADMIN ONLY)
`POST /tasks`

```json
{
  "title": "Complete API Documentation",
  "description": "Write docs for the API",
  "status": "PENDING",
  "priority": "HIGH"
}
```

---

### Update Task (ADMIN ONLY)
`PUT /tasks/:id`

```json
{
  "title": "Updated Title",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM"
}
```

---

### Delete Task (ADMIN ONLY)
`DELETE /tasks/:id`

---

## Health Check
`GET /health` (No auth required)

---

## Response Format

**Success:**
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "...",
  "error": "ERROR_CODE"
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

---

**Last Updated:** January 2026
