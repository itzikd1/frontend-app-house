# Backend App House

## Overview
This is a Node.js backend application using Express, Prisma, and Swagger for API documentation. It provides RESTful endpoints for resources such as users, cars, families, tasks, notes, recipes, and more. The project is designed for easy extension and clear API documentation for frontend and backend developers.

## Architecture
- **server.js**: Main entry point. Sets up Express, middleware, routes, and Swagger docs.
- **routes/**: Each resource (e.g., car, users) has its own route file. Routes map HTTP methods to controller functions and apply authentication.
- **controllers/**: Handle request logic, call service functions, process input, handle errors, and send JSON responses.
- **lib/services/**: Business logic and database access (via Prisma). Services validate input and perform queries.
- **docs/swagger/**: Swagger files for each resource describe API endpoints, request/response schemas, and parameters.

## Adding a New Route
1. **Create a Service**: Add business logic in `lib/services/[resource]Service.js`.
2. **Create a Controller**: Add controller functions in `controllers/[resource].js` that call your service.
3. **Create a Route**: Add a new route file in `routes/[resource].js`. Use Express Router to map endpoints to controller functions and apply authentication.
4. **Register the Route**: Import and mount your route in `server.js` (e.g., `app.use('/api/[resource]', [resource]Route);`).
5. **Document the API**: Add a Swagger file in `docs/swagger/[resource].js` describing endpoints, parameters, and schemas.
6. **Test Your Route**: Add tests in `controllers/__tests__/` and/or `routes/__tests__/`.

## API Documentation (for Frontend)
- All endpoints are under `/api/[resource]`.
- Standard REST methods: GET, POST, PUT, DELETE.
- Authentication required for most endpoints.
- Interactive Swagger docs available (when not in production).
- Request/response schemas are defined in Swagger files (see `#/components/schemas/[Resource]`).

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in required values (DB, JWT, etc).
3. Run database migrations (if needed):
   ```bash
   npx prisma migrate deploy
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Access Swagger docs at `/api-docs` (development only).

## Testing
- Tests are located in `controllers/__tests__/`, `lib/services/__tests__/`, and `routes/__tests__/`.
- Run tests with:
   ```bash
   npm test
   ```
- Test API routes:
   ```bash
   ./test_api.sh
   ```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Error Responses
Common error status codes:
- `400` - Bad Request: Invalid request data
- `401` - Unauthorized: Authentication required
- `403` - Forbidden: Not enough permissions
- `404` - Not Found: Resource not found
- `500` - Internal Server Error: Something went wrong on the server

## API Response Format
All endpoints return `{ data: ... }` for success and `{ error: ... }` for errors.

### TypeScript Response Types
```typescript
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
  path: string;
}
```

## Main Interfaces (Resource Schemas)
Below are examples of the main data interfaces for each resource:

### Common Types
```typescript
interface BaseModel {
  id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  createdBy?: string;
}
```

### User
```typescript
interface User extends BaseModel {
  name: string;
  email: string;
  role: 'ADMIN' | 'FAMILY_HEAD' | 'FAMILY_MEMBER';
  familyId?: string;
}
```

### Task
```typescript
interface Task extends BaseModel {
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string; // ISO date string
  priority: 'Low' | 'Medium' | 'High';
  repeatFrequency?: string;
  categoryId?: string;
  userId: string;
}

interface Category extends BaseModel {
  name: string;
  color?: string;
  icon?: string;
}
```

### Family
```typescript
interface Family extends BaseModel {
  name: string;
  members: User[];
  createdById: string;
}

interface FamilyInvite {
  id: string;
  email: string;
  familyId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  expiresAt: string; // ISO date string
  createdById: string;
}
```

### Vehicle
```typescript
interface Car extends BaseModel {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  userId: string;
  currentLocation?: Location;
}

interface CarLocationHistory extends BaseModel {
  carId: string;
  location: Location;
  timestamp: string; // ISO date string
}

interface Location {
  lat: number;
  lng: number;
  address?: string;
  timestamp: string; // ISO date string
}
```

### Recipe
```typescript
interface Recipe extends BaseModel {
  title: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime?: number; // in minutes
  cookTime?: number; // in minutes
  servings?: number;
  tags?: string[];
  createdById: string;
}

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}
```

### Goal
```typescript
interface Goal extends BaseModel {
  title: string;
  description?: string;
  targetDate?: string; // ISO date string
  completed: boolean;
  progress: number; // 0-100
  category?: string;
  userId: string;
}
```

### Note
```typescript
interface Note extends BaseModel {
  title: string;
  content: string;
  tags?: string[];
  isPinned: boolean;
  userId: string;
}
```







## Existing Routes & Interfaces

Below is a summary of all available API routes, their endpoints, and the standard response object format. Each resource returns data in a consistent structure, making it easy for frontend and backend developers to integrate and extend.

### Routes & Endpoints

#### Auth (`/api/auth`)
- POST `/register` — Register a new user
- POST `/login` — Login and receive a token
- GET `/me` — Get current user info (authenticated)

#### Car (`/api/car`)
- GET `/` — Get all cars (authenticated)
- GET `/:id` — Get car by ID (authenticated)
- POST `/` — Create a new car (authenticated)
- PUT `/:id` — Update car by ID (authenticated)
- DELETE `/:id` — Delete car by ID (authenticated)

#### Car Location History (`/api/car-location-history`)
- GET `/` — Get all car location history (authenticated)
- GET `/:id` — Get car location history by ID (authenticated)
- POST `/` — Create a new car location history (authenticated)
- PUT `/:id` — Update car location history by ID (authenticated)
- DELETE `/:id` — Delete car location history by ID (authenticated)

#### Families (`/api/families`)
- POST `/` — Create a family (authenticated)
- GET `/members` — Get family members (authenticated)
- DELETE `/members/:userId` — Remove a family member (authenticated)
- POST `/invite` — Invite user to family (authenticated)

#### Goal (`/api/goal`)
- GET `/` — Get all goals (authenticated)
- GET `/:id` — Get goal by ID (authenticated)
- POST `/` — Create a new goal (authenticated)
- PUT `/:id` — Update goal by ID (authenticated)
- DELETE `/:id` — Delete goal by ID (authenticated)

#### Health (`/api/health`)
- GET `/` — Health check endpoint

#### Note (`/api/note`)
- GET `/` — Get all notes (authenticated)
- GET `/:id` — Get note by ID (authenticated)
- POST `/` — Create a new note (authenticated)
- PUT `/:id` — Update note by ID (authenticated)
- DELETE `/:id` — Delete note by ID (authenticated)

#### Recipe (`/api/recipe`)
- GET `/` — Get all recipes (authenticated)
- GET `/:id` — Get recipe by ID (authenticated)
- POST `/` — Create a new recipe (authenticated)
- PUT `/:id` — Update recipe by ID (authenticated)
- DELETE `/:id` — Delete recipe by ID (authenticated)

#### Tasks (`/api/tasks`)
- GET `/` — Get all tasks (authenticated)
- GET `/:id` — Get task by ID (authenticated)
- POST `/` — Create a new task (authenticated)
- PUT `/:id` — Update task by ID (authenticated)
- DELETE `/:id` — Delete task by ID (authenticated)

#### Users (`/api/users`)
- GET `/` — Get all users (authenticated)
- POST `/` — Create a new user

---

### Standard Response Object
All API responses follow this structure:
```json
{
  "data": {
    "success": true | false,
    "error": "Error message if any",
    // Resource(s) data
    "car": { ... },
    "cars": [ ... ],
    "user": { ... },
    "users": [ ... ],
    // ...other resources
  }
}
```
- For successful requests, `success` is `true` and the resource(s) are included.
- For errors, `success` is `false` and `error` contains the message.

---

