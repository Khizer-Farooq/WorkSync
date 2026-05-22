# API Documentation

This document describes the WorkSync backend API implemented in the NestJS project under `backend/`.

## Base URL

```text
http://localhost:5000/api
```

The application sets a global `api` prefix in `main.ts`.

## Authentication

Protected endpoints require a JWT bearer token:

```http
Authorization: Bearer <accessToken>
```

Roles used by the API:

```text
ADMIN
EMPLOYEE
```

## Global Response Format

Successful responses are wrapped like this:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {}
}
```

If a service returns `{ "message": "...", "data": ... }`, that message and data are used in the wrapper.

Error responses are wrapped like this:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "path": "/api/path",
  "timestamp": "2026-05-22T00:00:00.000Z"
}
```

Common auth errors:

- `401 Authorization header is missing`
- `401 Invalid authorization format`
- `401 Invalid or expired token`
- `403 You do not have permission`

## Route Summary

| Method | Route | Auth | Roles | Description |
| --- | --- | --- | --- | --- |
| POST | `/auth/login` | No | Public | Login and receive JWT |
| GET | `/auth/me` | Yes | Any | Return current JWT user |
| POST | `/users/employees` | Yes | ADMIN | Create employee |
| GET | `/users/employees` | Yes | ADMIN | List employees |
| GET | `/users/:id` | Yes | Any | Get user by ID |
| POST | `/departments` | Yes | ADMIN | Create department |
| GET | `/departments` | Yes | ADMIN | List departments |
| GET | `/departments/:id` | Yes | ADMIN | Get department by ID |
| POST | `/projects` | Yes | ADMIN | Create project |
| GET | `/projects` | Yes | Any | List projects |
| GET | `/projects/:id` | Yes | Any | Get project by ID |
| PATCH | `/projects/:id` | Yes | ADMIN | Update project |
| PATCH | `/projects/:id/archive` | Yes | ADMIN | Archive project |
| POST | `/projects/:id/members` | Yes | ADMIN | Assign project members |
| DELETE | `/projects/:projectId/members/:userId` | Yes | ADMIN | Remove project member |
| GET | `/tasks/statuses` | Yes | Any | List task statuses |
| POST | `/tasks` | Yes | ADMIN | Create task |
| GET | `/tasks` | Yes | Any | List tasks |
| GET | `/tasks/:id` | Yes | Any | Get task by ID |
| PATCH | `/tasks/:id` | Yes | Any | Update task |
| POST | `/tasks/:id/assign` | Yes | ADMIN | Assign users to task |
| POST | `/tasks/:taskId/comments` | Yes | Any | Add task comment |
| GET | `/tasks/:taskId/comments` | Yes | Any | List task comments |
| POST | `/shifts/clock-in` | Yes | EMPLOYEE | Clock in |
| POST | `/shifts/clock-out` | Yes | EMPLOYEE | Clock out |
| GET | `/shifts/active` | Yes | EMPLOYEE | Get active shift |
| GET | `/shifts/weekly-hours` | Yes | Any | Get weekly worked hours |
| GET | `/shifts` | Yes | Any | List shifts |
| GET | `/shifts/:id` | Yes | Any | Get shift by ID |
| GET | `/dashboard` | Yes | Any | Get dashboard metrics |

## Common Models

### User

```json
{
  "id": 1,
  "name": "Ali",
  "email": "ali@test.com",
  "departmentId": 1,
  "role": "EMPLOYEE",
  "isActive": true,
  "department": {
    "id": 1,
    "name": "Engineering"
  },
  "createdAt": "2026-05-22T00:00:00.000Z",
  "updatedAt": "2026-05-22T00:00:00.000Z"
}
```

### Department

```json
{
  "id": 1,
  "name": "Engineering",
  "createdAt": "2026-05-22T00:00:00.000Z",
  "updatedAt": "2026-05-22T00:00:00.000Z"
}
```

### Project

```json
{
  "id": 1,
  "createdBy": 15,
  "title": "Website Redesign",
  "description": "Refresh dashboard and employee views",
  "status": "ACTIVE",
  "deadline": "2026-06-30",
  "createdAt": "2026-05-22T00:00:00.000Z",
  "updatedAt": "2026-05-22T00:00:00.000Z"
}
```

Project statuses:

```text
ACTIVE
ARCHIVED
COMPLETED
```

### Task

```json
{
  "id": 1,
  "projectId": 1,
  "statusId": 1,
  "createdBy": 15,
  "title": "Create wireframes",
  "description": "Prepare first dashboard wireframes",
  "dueDate": "2026-06-10",
  "createdAt": "2026-05-22T00:00:00.000Z",
  "updatedAt": "2026-05-22T00:00:00.000Z"
}
```

Seeded task statuses:

```text
1 TODO
2 IN_PROGRESS
3 COMPLETED
```

### Shift

```json
{
  "id": 1,
  "userId": 2,
  "clockIn": "2026-05-22T09:00:00.000Z",
  "clockOut": "2026-05-22T17:00:00.000Z",
  "shiftType": "REGULAR",
  "totalHours": 8,
  "createdAt": "2026-05-22T09:00:00.000Z",
  "updatedAt": "2026-05-22T17:00:00.000Z"
}
```

## Auth Endpoints

### Login

```http
POST /auth/login
```

Auth: Public

Body:

```json
{
  "email": "taimoor@gmail.com",
  "password": "taimoor12"
}
```

Validation:

- `email`: required, valid email
- `password`: required string

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt.token.here",
    "user": {
      "id": 15,
      "name": "Taimoor",
      "email": "taimoor@gmail.com",
      "role": "ADMIN",
      "department": null
    }
  }
}
```

Common errors:

- `401 Invalid email or password`
- `403 Your account is inactive`

### Current User

```http
GET /auth/me
```

Auth: Bearer token

Body: None

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {
    "id": 15,
    "email": "taimoor@gmail.com",
    "role": "ADMIN"
  }
}
```

## Users Endpoints

### Create Employee

```http
POST /users/employees
```

Auth: Bearer token, `ADMIN`

Body:

```json
{
  "name": "New Employee",
  "email": "new.employee@example.com",
  "password": "secret123",
  "departmentId": 1
}
```

Validation:

- `name`: required string
- `email`: required valid email
- `password`: required string, minimum 6 characters
- `departmentId`: optional integer

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {
    "id": 20,
    "name": "New Employee",
    "email": "new.employee@example.com",
    "departmentId": 1,
    "role": "EMPLOYEE",
    "isActive": true,
    "createdAt": "2026-05-22T00:00:00.000Z",
    "updatedAt": "2026-05-22T00:00:00.000Z"
  }
}
```

Common errors:

- `409 Email already exists`
- `404 Department not found`

### List Employees

```http
GET /users/employees
```

Auth: Bearer token, `ADMIN`

Body: None

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": [
    {
      "id": 2,
      "name": "Ali",
      "email": "ali@test.com",
      "departmentId": 1,
      "role": "EMPLOYEE",
      "isActive": true,
      "department": {
        "id": 1,
        "name": "Engineering"
      },
      "createdAt": "2026-05-22T00:00:00.000Z",
      "updatedAt": "2026-05-22T00:00:00.000Z"
    }
  ]
}
```

### Get User By ID

```http
GET /users/:id
```

Auth: Bearer token

Path params:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | number | Yes | User ID |

Body: None

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {
    "id": 2,
    "name": "Ali",
    "email": "ali@test.com",
    "departmentId": 1,
    "role": "EMPLOYEE",
    "isActive": true,
    "department": {
      "id": 1,
      "name": "Engineering"
    },
    "createdAt": "2026-05-22T00:00:00.000Z",
    "updatedAt": "2026-05-22T00:00:00.000Z"
  }
}
```

Common errors:

- `404 User not found`

## Departments Endpoints

### Create Department

```http
POST /departments
```

Auth: Bearer token, `ADMIN`

Body:

```json
{
  "name": "Engineering"
}
```

Validation:

- `name`: required string, maximum 100 characters

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {
    "id": 1,
    "name": "Engineering",
    "createdAt": "2026-05-22T00:00:00.000Z",
    "updatedAt": "2026-05-22T00:00:00.000Z"
  }
}
```

Common errors:

- `409 Department already exists`

### List Departments

```http
GET /departments
```

Auth: Bearer token, `ADMIN`

Body: None

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": [
    {
      "id": 1,
      "name": "Engineering",
      "createdAt": "2026-05-22T00:00:00.000Z",
      "updatedAt": "2026-05-22T00:00:00.000Z"
    }
  ]
}
```

### Get Department By ID

```http
GET /departments/:id
```

Auth: Bearer token, `ADMIN`

Path params:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | number | Yes | Department ID |

Body: None

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {
    "id": 1,
    "name": "Engineering",
    "createdAt": "2026-05-22T00:00:00.000Z",
    "updatedAt": "2026-05-22T00:00:00.000Z"
  }
}
```

Common errors:

- `404 Department not found`

## Projects Endpoints

### Create Project

```http
POST /projects
```

Auth: Bearer token, `ADMIN`

Body:

```json
{
  "title": "Website Redesign",
  "description": "Refresh dashboard and employee views",
  "deadline": "2026-06-30",
  "memberIds": [2, 3]
}
```

Validation:

- `title`: required string, maximum 150 characters
- `description`: optional string
- `deadline`: optional ISO date string
- `memberIds`: optional array of employee user IDs

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Project created successfully",
  "data": {
    "id": 1,
    "createdBy": 15,
    "title": "Website Redesign",
    "description": "Refresh dashboard and employee views",
    "status": "ACTIVE",
    "deadline": "2026-06-30",
    "createdAt": "2026-05-22T00:00:00.000Z",
    "updatedAt": "2026-05-22T00:00:00.000Z"
  }
}
```

Common errors:

- `400 One or more employees are invalid`

### List Projects

```http
GET /projects
```

Auth: Bearer token

Query params:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `page` | number | No | Page number, default `1` |
| `limit` | number | No | Items per page, default `10` |
| `status` | string | No | `ACTIVE`, `ARCHIVED`, or `COMPLETED` |
| `sortBy` | string | No | Sort column, default `createdAt` |
| `sortOrder` | string | No | `ASC` or `DESC`, default `DESC` |

Employees only receive projects where they are members. Admins receive all projects.

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Projects fetched successfully",
  "data": {
    "projects": [
      {
        "id": 1,
        "createdBy": 15,
        "title": "Website Redesign",
        "description": "Refresh dashboard and employee views",
        "status": "ACTIVE",
        "deadline": "2026-06-30",
        "members": [
          {
            "id": 2,
            "name": "Ali",
            "email": "ali@test.com",
            "role": "EMPLOYEE"
          }
        ],
        "creator": {
          "id": 15,
          "name": "Taimoor",
          "email": "taimoor@gmail.com"
        },
        "createdAt": "2026-05-22T00:00:00.000Z",
        "updatedAt": "2026-05-22T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

### Get Project By ID

```http
GET /projects/:id
```

Auth: Bearer token

Path params:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | number | Yes | Project ID |

Employees can only access projects where they are members.

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Project fetched successfully",
  "data": {
    "id": 1,
    "createdBy": 15,
    "title": "Website Redesign",
    "description": "Refresh dashboard and employee views",
    "status": "ACTIVE",
    "deadline": "2026-06-30",
    "members": [
      {
        "id": 2,
        "name": "Ali",
        "email": "ali@test.com",
        "role": "EMPLOYEE"
      }
    ],
    "creator": {
      "id": 15,
      "name": "Taimoor",
      "email": "taimoor@gmail.com"
    },
    "createdAt": "2026-05-22T00:00:00.000Z",
    "updatedAt": "2026-05-22T00:00:00.000Z"
  }
}
```

Common errors:

- `404 Project not found`
- `403 You are not a member of this project`

### Update Project

```http
PATCH /projects/:id
```

Auth: Bearer token, `ADMIN`

Path params:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | number | Yes | Project ID |

Body:

```json
{
  "title": "Website Redesign Phase 2",
  "description": "Updated scope",
  "status": "COMPLETED",
  "deadline": "2026-07-15"
}
```

All body fields are optional.

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Project updated successfully",
  "data": {
    "id": 1,
    "createdBy": 15,
    "title": "Website Redesign Phase 2",
    "description": "Updated scope",
    "status": "COMPLETED",
    "deadline": "2026-07-15",
    "createdAt": "2026-05-22T00:00:00.000Z",
    "updatedAt": "2026-05-22T00:00:00.000Z"
  }
}
```

Common errors:

- `404 Project not found`

### Archive Project

```http
PATCH /projects/:id/archive
```

Auth: Bearer token, `ADMIN`

Path params:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | number | Yes | Project ID |

Body: None

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Project archived successfully",
  "data": {
    "id": 1,
    "createdBy": 15,
    "title": "Website Redesign",
    "description": "Refresh dashboard and employee views",
    "status": "ARCHIVED",
    "deadline": "2026-06-30",
    "createdAt": "2026-05-22T00:00:00.000Z",
    "updatedAt": "2026-05-22T00:00:00.000Z"
  }
}
```

Common errors:

- `404 Project not found`

### Assign Project Members

```http
POST /projects/:id/members
```

Auth: Bearer token, `ADMIN`

Path params:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | number | Yes | Project ID |

Body:

```json
{
  "memberIds": [2, 3]
}
```

Validation:

- `memberIds`: required non-empty array of employee user IDs

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Members assigned successfully",
  "data": null
}
```

Common errors:

- `404 Project not found`
- `400 One or more employees are invalid`

### Remove Project Member

```http
DELETE /projects/:projectId/members/:userId
```

Auth: Bearer token, `ADMIN`

Path params:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `projectId` | number | Yes | Project ID |
| `userId` | number | Yes | User ID to remove |

Body: None

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Project member removed successfully",
  "data": null
}
```

Common errors:

- `404 Project not found`
- `404 Project member not found`

## Tasks Endpoints

### List Task Statuses

```http
GET /tasks/statuses
```

Auth: Bearer token

Body: None

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Task statuses fetched successfully",
  "data": [
    {
      "id": 1,
      "name": "TODO",
      "createdAt": "2026-05-22T00:00:00.000Z",
      "updatedAt": "2026-05-22T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "IN_PROGRESS",
      "createdAt": "2026-05-22T00:00:00.000Z",
      "updatedAt": "2026-05-22T00:00:00.000Z"
    },
    {
      "id": 3,
      "name": "COMPLETED",
      "createdAt": "2026-05-22T00:00:00.000Z",
      "updatedAt": "2026-05-22T00:00:00.000Z"
    }
  ]
}
```

### Create Task

```http
POST /tasks
```

Auth: Bearer token, `ADMIN`

Body:

```json
{
  "projectId": 1,
  "title": "Create wireframes",
  "description": "Prepare first dashboard wireframes",
  "dueDate": "2026-06-10",
  "assignedUserIds": [2, 3]
}
```

Validation:

- `projectId`: required integer
- `title`: required string, maximum 150 characters
- `description`: optional string
- `dueDate`: optional ISO date string
- `assignedUserIds`: optional array of employee user IDs

New tasks are created with the `TODO` status.

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "projectId": 1,
    "statusId": 1,
    "createdBy": 15,
    "title": "Create wireframes",
    "description": "Prepare first dashboard wireframes",
    "dueDate": "2026-06-10",
    "createdAt": "2026-05-22T00:00:00.000Z",
    "updatedAt": "2026-05-22T00:00:00.000Z"
  }
}
```

Common errors:

- `404 Project not found`
- `400 Default TODO status not found`
- `400 One or more assigned users are invalid`

### List Tasks

```http
GET /tasks
```

Auth: Bearer token

Query params:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `page` | number | No | Page number, default `1` |
| `limit` | number | No | Items per page, default `10` |
| `projectId` | number | No | Filter by project |
| `statusId` | number | No | Filter by task status |
| `assignedUserId` | number | No | Admin-only filter by assigned user |
| `fromDate` | date | No | Due-date range start |
| `toDate` | date | No | Due-date range end |
| `sortBy` | string | No | Sort column, default `createdAt` |
| `sortOrder` | string | No | `ASC` or `DESC`, default `DESC` |

Employees only receive tasks assigned to them. Date filtering is applied only when both `fromDate` and `toDate` are present.

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Tasks fetched successfully",
  "data": {
    "tasks": [
      {
        "id": 1,
        "projectId": 1,
        "statusId": 1,
        "createdBy": 15,
        "title": "Create wireframes",
        "description": "Prepare first dashboard wireframes",
        "dueDate": "2026-06-10",
        "project": {
          "id": 1,
          "title": "Website Redesign",
          "status": "ACTIVE"
        },
        "status": {
          "id": 1,
          "name": "TODO"
        },
        "creator": {
          "id": 15,
          "name": "Taimoor",
          "email": "taimoor@gmail.com"
        },
        "assignedUsers": [
          {
            "id": 2,
            "name": "Ali",
            "email": "ali@test.com"
          }
        ],
        "createdAt": "2026-05-22T00:00:00.000Z",
        "updatedAt": "2026-05-22T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

### Get Task By ID

```http
GET /tasks/:id
```

Auth: Bearer token

Path params:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | number | Yes | Task ID |

Employees can only access tasks assigned to them.

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Task fetched successfully",
  "data": {
    "id": 1,
    "projectId": 1,
    "statusId": 1,
    "createdBy": 15,
    "title": "Create wireframes",
    "description": "Prepare first dashboard wireframes",
    "dueDate": "2026-06-10",
    "project": {
      "id": 1,
      "title": "Website Redesign",
      "status": "ACTIVE"
    },
    "status": {
      "id": 1,
      "name": "TODO"
    },
    "creator": {
      "id": 15,
      "name": "Taimoor",
      "email": "taimoor@gmail.com"
    },
    "assignedUsers": [
      {
        "id": 2,
        "name": "Ali",
        "email": "ali@test.com"
      }
    ],
    "createdAt": "2026-05-22T00:00:00.000Z",
    "updatedAt": "2026-05-22T00:00:00.000Z"
  }
}
```

Common errors:

- `404 Task not found`
- `403 You are not assigned to this task`

### Update Task

```http
PATCH /tasks/:id
```

Auth: Bearer token

Path params:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | number | Yes | Task ID |

Body:

```json
{
  "title": "Create final wireframes",
  "description": "Update dashboard wireframes after review",
  "statusId": 2,
  "dueDate": "2026-06-12"
}
```

All body fields are optional.

Employees can update only tasks assigned to them. If `statusId` is provided, it must reference an existing task status.

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Task updated successfully",
  "data": {
    "id": 1,
    "projectId": 1,
    "statusId": 2,
    "createdBy": 15,
    "title": "Create final wireframes",
    "description": "Update dashboard wireframes after review",
    "dueDate": "2026-06-12",
    "createdAt": "2026-05-22T00:00:00.000Z",
    "updatedAt": "2026-05-22T00:00:00.000Z"
  }
}
```

Common errors:

- `404 Task not found`
- `403 You are not assigned to this task`
- `400 Invalid task status`

### Assign Users To Task

```http
POST /tasks/:id/assign
```

Auth: Bearer token, `ADMIN`

Path params:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | number | Yes | Task ID |

Body:

```json
{
  "userIds": [2, 3]
}
```

Validation:

- `userIds`: required non-empty array of employee user IDs

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users assigned to task successfully",
  "data": null
}
```

Common errors:

- `404 Task not found`
- `400 One or more assigned users are invalid`

## Task Comment Endpoints

### Add Task Comment

```http
POST /tasks/:taskId/comments
```

Auth: Bearer token

Path params:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `taskId` | number | Yes | Task ID |

Body:

```json
{
  "comment": "I have started working on this task."
}
```

Validation:

- `comment`: required string

Employees can comment only on tasks assigned to them. Admins can comment on any task.

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Comment added successfully",
  "data": {
    "id": 1,
    "taskId": 1,
    "userId": 2,
    "comment": "I have started working on this task.",
    "createdAt": "2026-05-22T00:00:00.000Z",
    "updatedAt": "2026-05-22T00:00:00.000Z"
  }
}
```

Common errors:

- `404 Task not found`
- `403 You are not assigned to this task`

### List Task Comments

```http
GET /tasks/:taskId/comments
```

Auth: Bearer token

Path params:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `taskId` | number | Yes | Task ID |

Body: None

Employees can read comments only for tasks assigned to them. Admins can read comments for any task.

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Comments fetched successfully",
  "data": [
    {
      "id": 1,
      "taskId": 1,
      "userId": 2,
      "comment": "I have started working on this task.",
      "user": {
        "id": 2,
        "name": "Ali",
        "email": "ali@test.com"
      },
      "createdAt": "2026-05-22T00:00:00.000Z",
      "updatedAt": "2026-05-22T00:00:00.000Z"
    }
  ]
}
```

Common errors:

- `404 Task not found`
- `403 You are not assigned to this task`

## Shifts Endpoints

### Clock In

```http
POST /shifts/clock-in
```

Auth: Bearer token, `EMPLOYEE`

Body: None

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Clocked in successfully",
  "data": {
    "id": 1,
    "userId": 2,
    "clockIn": "2026-05-22T09:00:00.000Z",
    "clockOut": null,
    "shiftType": "REGULAR",
    "createdAt": "2026-05-22T09:00:00.000Z",
    "updatedAt": "2026-05-22T09:00:00.000Z"
  }
}
```

Common errors:

- `400 You already have an active shift`

### Clock Out

```http
POST /shifts/clock-out
```

Auth: Bearer token, `EMPLOYEE`

Body: None

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Clocked out successfully",
  "data": {
    "shift": {
      "id": 1,
      "userId": 2,
      "clockIn": "2026-05-22T09:00:00.000Z",
      "clockOut": "2026-05-22T17:00:00.000Z",
      "shiftType": "REGULAR",
      "createdAt": "2026-05-22T09:00:00.000Z",
      "updatedAt": "2026-05-22T17:00:00.000Z"
    },
    "totalHours": 8
  }
}
```

Common errors:

- `400 No active shift found`

### Get Active Shift

```http
GET /shifts/active
```

Auth: Bearer token, `EMPLOYEE`

Body: None

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Active shift fetched successfully",
  "data": {
    "id": 1,
    "userId": 2,
    "clockIn": "2026-05-22T09:00:00.000Z",
    "clockOut": null,
    "shiftType": "REGULAR",
    "createdAt": "2026-05-22T09:00:00.000Z",
    "updatedAt": "2026-05-22T09:00:00.000Z"
  }
}
```

If the employee has no active shift, `data` is `null`.

### Get Weekly Worked Hours

```http
GET /shifts/weekly-hours
```

Auth: Bearer token

Body: None

Admins get weekly hours across all completed shifts. Employees get their own weekly hours.

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Weekly worked hours fetched successfully",
  "data": {
    "weeklyHours": 40
  }
}
```

### List Shifts

```http
GET /shifts
```

Auth: Bearer token

Query params:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `page` | number | No | Page number, default `1` |
| `limit` | number | No | Items per page, default `10` |
| `userId` | number | No | Admin-only filter by user |
| `fromDate` | date | No | Clock-in range start |
| `toDate` | date | No | Clock-in range end |
| `sortBy` | string | No | Sort column, default `createdAt` |
| `sortOrder` | string | No | `ASC` or `DESC`, default `DESC` |

Employees only receive their own shifts. Date filtering is applied only when both `fromDate` and `toDate` are present.

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Shifts fetched successfully",
  "data": {
    "shifts": [
      {
        "id": 1,
        "userId": 2,
        "clockIn": "2026-05-22T09:00:00.000Z",
        "clockOut": "2026-05-22T17:00:00.000Z",
        "shiftType": "REGULAR",
        "totalHours": 8,
        "user": {
          "id": 2,
          "name": "Ali",
          "email": "ali@test.com",
          "role": "EMPLOYEE"
        },
        "createdAt": "2026-05-22T09:00:00.000Z",
        "updatedAt": "2026-05-22T17:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

### Get Shift By ID

```http
GET /shifts/:id
```

Auth: Bearer token

Path params:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | number | Yes | Shift ID |

Employees can only access their own shifts.

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Shift fetched successfully",
  "data": {
    "id": 1,
    "userId": 2,
    "clockIn": "2026-05-22T09:00:00.000Z",
    "clockOut": "2026-05-22T17:00:00.000Z",
    "shiftType": "REGULAR",
    "totalHours": 8,
    "user": {
      "id": 2,
      "name": "Ali",
      "email": "ali@test.com",
      "role": "EMPLOYEE"
    },
    "createdAt": "2026-05-22T09:00:00.000Z",
    "updatedAt": "2026-05-22T17:00:00.000Z"
  }
}
```

Common errors:

- `404 Shift not found`
- `403 You cannot view this shift`

## Dashboard Endpoints

### Get Dashboard

```http
GET /dashboard
```

Auth: Bearer token

Body: None

Admins receive global counts and recent activity. Employees receive counts and activity scoped to their own assigned work where the service applies role filtering.

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Dashboard fetched successfully",
  "data": {
    "completedTasks": 4,
    "activeProjects": 2,
    "weeklyWorkedHours": 32.5,
    "recentActivity": [
      {
        "id": 1,
        "userId": 2,
        "action": "TASK_UPDATED",
        "entityType": "TASK",
        "entityId": 1,
        "metadata": {
          "title": "Create final wireframes",
          "statusId": 2
        },
        "user": {
          "id": 2,
          "name": "Ali",
          "email": "ali@test.com",
          "role": "EMPLOYEE"
        },
        "createdAt": "2026-05-22T00:00:00.000Z",
        "updatedAt": "2026-05-22T00:00:00.000Z"
      }
    ]
  }
}
```

## Validation Notes

The app uses a global validation pipe with:

```text
whitelist: true
forbidNonWhitelisted: true
transform: true
```

That means unsupported body fields are rejected and primitive query/path values may be transformed when possible.

## Pagination Response Shape

List endpoints that paginate return:

```json
{
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

Paginated endpoints:

- `GET /projects`
- `GET /tasks`
- `GET /shifts`

