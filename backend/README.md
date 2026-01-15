# REST API with JWT Authentication

A Node.js REST API with JWT authentication and role-based access control.

## Quick Start

```bash
# Install dependencies
cd backend
npm install

# Set up environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Run server
npm run dev
```

Server runs at `http://localhost:5000`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/auth/me` | Get profile |

### Tasks
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/tasks` | USER, ADMIN | List tasks |
| GET | `/api/v1/tasks/:id` | USER, ADMIN | Get task |
| POST | `/api/v1/tasks` | ADMIN | Create task |
| PUT | `/api/v1/tasks/:id` | ADMIN | Update task |
| DELETE | `/api/v1/tasks/:id` | ADMIN | Delete task |

## Authentication

Add token to requests:
```
Authorization: Bearer <your_jwt_token>
```

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator

## Project Structure

```
backend/
├── src/
│   ├── config/       # Database config
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth, RBAC, validation
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── utils/        # Validators
├── docs/             # API documentation
└── .env              # Environment variables
```

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rest_api_db
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
```

## Frontend

A simple vanilla HTML/CSS/JS frontend is included:

```bash
cd frontend
npx serve .
```

Opens at `http://localhost:3000`

**Features:**
- Login/Register forms
- JWT token storage
- Task management dashboard
- Role-based UI (Admin sees create/edit/delete)


