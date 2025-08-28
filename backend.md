# Backend App House

## Overview
This is the backend for the App House project, built with Node.js, Express, and Prisma. It provides a RESTful API for managing users, tasks, notes, cars, families, recipes, health data, and more.

## API Conventions
- **Base URL:** `/api/<resource>` (e.g., `/api/tasks`, `/api/note`)
- **Response Format:**
  - Success: `{ data: ... }` (single object or array)
  - Error: `{ error: ... }`
- **Authentication:** Most endpoints require a Bearer token (JWT).

## Main Resources
- `/api/users` - User management
- `/api/tasks` - Task management
- `/api/note` - Note management
- `/api/car` - Car management
- `/api/families` - Family management
- `/api/recipe` - Recipe management
- `/api/goal` - Goal management
- `/api/health` - Health data

## Setup
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment:**
   - Copy `.env.example` to `.env` and fill in required values (DB, JWT, etc).
3. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```
4. **Start server:**
   ```bash
   npm start
   ```

## Testing
- **Run all tests:**
  ```bash
  npm test -- --coverage
  ```
- **Test API routes:**
  ```bash
  ./test_api.sh
  ```

## Documentation
- **Swagger docs:** See `docs/swagger/` for OpenAPI specs for all resources.
- **Response format:** All endpoints return `{ data: ... }` for success and `{ error: ... }` for errors.

## Contribution
- Follow code style in `.copilot-instructions`.
- Add/maintain tests for all changes.
- Keep swagger docs up to date.

---
For questions or issues, open a GitHub issue or contact the maintainer.

# Backend API Documentation

This document provides an overview of all available API endpoints in the backend application along with TypeScript interfaces for frontend development.

## TypeScript Interfaces

### Common Types

```typescript
interface BaseModel {
  id: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  createdBy?: string;
}

interface User extends BaseModel {
  name: string;
  email: string;
  role: 'ADMIN' | 'FAMILY_HEAD' | 'FAMILY_MEMBER';
  familyId?: string;
}
```

### Task Related

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

### Family Related

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

### Vehicle Related

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

### Recipe Related

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

### Goal Related

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

### Note Related

```typescript
interface Note extends BaseModel {
  title: string;
  content: string;
  tags?: string[];
  isPinned: boolean;
  userId: string;
}
```

### API Response Types

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### Error Types

```typescript
interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
  path: string;
}
```

## Base URL
All API endpoints are prefixed with `/api`.

## TypeScript Setup

1. Install required dependencies:
```bash
npm install axios @tanstack/react-query react-hook-form @hookform/resolvers yup @types/react @types/node typescript
```

2. Create an API client utility:

```typescript
// src/lib/api.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;
```

3. Example API service usage:

```typescript
// src/services/taskService.ts
import api from '../lib/api';
import { Task } from '../types';

export const getTasks = async (): Promise<Task[]> => {
  return api.get('/tasks');
};

export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  return api.post('/tasks', taskData);
};

// Similar functions for update, delete, etc.
```

4. Example React Hook:

```typescript
// src/hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as taskService from '../services/taskService';

export const useTasks = () => {
  const queryClient = useQueryClient();
  
  const { data: tasks, isLoading, error } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: taskService.getTasks,
  });

  const createTask = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask,
  };
};
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
  - Required fields: `name`, `email`, `password`
- `POST /api/auth/login` - Login user
  - Required fields: `email`, `password`
- `GET /api/auth/me` - Get current user's profile

### Users
- `GET /api/users` - Get all users (protected)
- `POST /api/users` - Create a new user (public)

### Tasks
- `GET /api/tasks` - Get all tasks for the current user
- `GET /api/tasks/:id` - Get a specific task by ID
- `POST /api/tasks` - Create a new task
  - Required fields: `title`
  - Optional fields: `description`, `dueDate`, `priority`, `repeatFrequency`, `categoryId`
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Notes
- `GET /api/note` - Get all notes for the current user
- `GET /api/note/:id` - Get a specific note by ID
- `POST /api/note` - Create a new note
- `PUT /api/note/:id` - Update a note
- `DELETE /api/note/:id` - Delete a note

### Family
- `POST /api/families` - Create a new family
  - Required fields: `name`
- `GET /api/families/members` - Get all family members
- `DELETE /api/families/members/:userId` - Remove a family member
- `POST /api/families/invite` - Invite user to family
  - Required fields: `email`

### Cars
- `GET /api/car` - Get all cars
- `GET /api/car/:id` - Get a specific car by ID
- `POST /api/car` - Add a new car
- `PUT /api/car/:id` - Update a car
- `DELETE /api/car/:id` - Delete a car

### Car Location History
- `GET /api/car-location-history` - Get all car location history
- `GET /api/car-location-history/:id` - Get specific location history
- `POST /api/car-location-history` - Add new location history
- `PUT /api/car-location-history/:id` - Update location history
- `DELETE /api/car-location-history/:id` - Delete location history

### Recipes
- `GET /api/recipe` - Get all recipes
- `GET /api/recipe/:id` - Get a specific recipe
- `POST /api/recipe` - Create a new recipe
- `PUT /api/recipe/:id` - Update a recipe
- `DELETE /api/recipe/:id` - Delete a recipe

### Goals
- `GET /api/goal` - Get all goals
- `GET /api/goal/:id` - Get a specific goal
- `POST /api/goal` - Create a new goal
- `PUT /api/goal/:id` - Update a goal
- `DELETE /api/goal/:id` - Delete a goal

### Health Check
- `GET /api/health` - Check API health status

## Error Responses

Common error status codes:
- `400` - Bad Request: Invalid request data
- `401` - Unauthorized: Authentication required
- `403` - Forbidden: Not enough permissions
- `404` - Not Found: Resource not found
- `500` - Internal Server Error: Something went wrong on the server

## Development

To run the development server:
```bash
npm install
npm run dev
```

## Production

To start the production server:
```bash
npm start
```
