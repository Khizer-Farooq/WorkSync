# WorkSync Backend

WorkSync is a NestJS backend for managing departments, employees, projects, tasks, task comments, work shifts, and dashboard metrics. It uses PostgreSQL through Sequelize, JWT bearer authentication, role-based authorization, migrations, and seed data for local development.

## Tech Stack

- Node.js and NestJS 11
- TypeScript
- PostgreSQL
- Sequelize and sequelize-typescript
- JWT authentication
- bcrypt password hashing
- class-validator and class-transformer
- Jest for tests

## Main Features

- Admin login and JWT-based authentication
- Admin-only employee and department management
- Project creation, updates, archiving, member assignment, and member removal
- Task creation, filtering, updates, assignment, and status tracking
- Task comments with employee assignment checks
- Employee clock-in and clock-out tracking
- Weekly worked-hours summaries
- Dashboard metrics for completed tasks, active projects, weekly hours, and recent activity
- Global success and error response formatting

## Project Structure

```text
backend/
  src/
    common/
      decorators/       # Current user and roles decorators
      filters/          # Global HTTP exception response filter
      guards/           # JWT and role guards
      interceptors/     # Global success response wrapper
      middleware/       # Request logger
      enums/            # User role and project status enums
    database/
      migrations/       # Sequelize database migrations
      seeders/          # Local development seed data
    modules/
      auth/             # Login and current-user endpoints
      users/            # Employees and user lookups
      departments/      # Department CRUD reads/create
      projects/         # Projects and project members
      tasks/            # Tasks, statuses, assignments
      task-comments/    # Task comments
      shifts/           # Clock-in, clock-out, shift reports
      dashboard/        # Dashboard metrics and activity logging
    app.module.ts       # Root Nest module
    main.ts             # App bootstrap, global pipes, filters, prefix
```

## Environment Variables

Create `backend/.env` with the following values:

PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=worksync
JWT_SECRET=replace_with_a_long_secret
JWT_EXPIRES_IN=1d

`main.ts` applies the global API prefix `api`, so the default local base URL is:

http://localhost:5000/api

The API enables CORS for `http://localhost:3000` with credentials.

## Installation

cd backend
npm install

## Database Setup

Run migrations:

```bash
npm run migrate
```

Run seeders:

```bash
npm run seed
```

Undo the latest migration:

```bash
npm run migrate:undo
```

Undo all seeders:

```bash
npm run seed:undo
```

## Seed Data

The seeders create sample departments, task statuses, users, projects, project members, tasks, task assignments, comments, shifts, and activities.

Local seed login examples:

```text
Admin:
email: taimoor@gmail.com
password: taimoor12

Employees:
email: ali@test.com
email: ahmed@test.com
email: sara@test.com
password: 123456
```

Change these credentials before using the project outside local development.

## Running the App

Development:

```bash
npm run start:dev
```

Production build:

```bash
npm run build
npm run start:prod
```

Regular start:

```bash
npm run start
```

## Available Scripts

```text
npm run build              Compile the NestJS project
npm run start              Start the app
npm run start:dev          Start in watch mode
npm run start:debug        Start in debug watch mode
npm run start:prod         Run compiled dist/main.js
npm run lint               Run ESLint with autofix
npm run format             Format TypeScript files with Prettier
npm run test               Run unit tests
npm run test:watch         Run tests in watch mode
npm run test:cov           Run tests with coverage
npm run test:e2e           Run e2e tests
npm run migration:create   Generate a Sequelize migration
npm run migrate            Run Sequelize migrations
npm run migrate:undo       Undo the latest migration
npm run seed:create        Generate a Sequelize seeder
npm run seed               Run all seeders
npm run seed:undo          Undo all seeders
```

## Authentication

Most endpoints require a JWT bearer token:

```http
Authorization: Bearer <accessToken>
```

Get a token with:

```http
POST /api/auth/login
```

Roles:

- `ADMIN` can manage departments, employees, projects, task assignment, and view global reports.
- `EMPLOYEE` can view assigned projects/tasks, comment on assigned tasks, and manage their own shifts.

## Response Format

Successful responses are wrapped by the global response interceptor:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {}
}
```

Some services provide a custom `message`. The response body `statusCode` is currently hard-coded to `200` for successful responses, even when the HTTP status is Nest's default status for the method.

Errors are formatted by the global exception filter:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation or error message",
  "path": "/api/example",
  "timestamp": "2026-05-22T00:00:00.000Z"
}
```

## Core Domain Models

- `Department`: employee grouping.
- `User`: admin or employee account, optionally linked to a department.
- `Project`: created by an admin, assigned to employee members, and tracked by status.
- `ProjectMember`: join table between projects and users.
- `Task`: belongs to a project, has a status, creator, due date, and assigned users.
- `TaskStatus`: seeded statuses such as `TODO`, `IN_PROGRESS`, and `COMPLETED`.
- `TaskAssignment`: join table between tasks and assigned users.
- `TaskComment`: comments on tasks by authenticated users.
- `Shift`: employee work sessions with clock-in and clock-out times.
- `Activity`: audit-style events used by the dashboard.

## Notes for Development

- Validation uses `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true`.
- Unknown request body fields are rejected.
- Pagination defaults to `page=1` and `limit=10` where supported.
- Sorting defaults to `createdAt DESC` where supported.
- Date filters for tasks and shifts are applied only when both `fromDate` and `toDate` are provided.
- Sequelize `synchronize` is disabled; use migrations to update the database schema.

