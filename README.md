# CV Builder

A full-featured CV management application built with Next.js 15 (App Router) and React 19. Users can create and manage CVs, profiles, skills, and languages. Admins have a dedicated panel for managing employees, departments, positions, skills, languages, and projects. The app supports internationalization (English and Polish) and dark/light theme switching.

## Features

- **Authentication** — login, signup, and session-based authorization
- **Role-based access** — Employee and Admin roles with route protection
- **Employee directory** — searchable, sortable, paginated employee list
- **Profile management** — update personal info, avatar, skills, and languages
- **CV builder** — create, edit, preview, and export CVs to PDF
- **Admin panel** — full CRUD for departments, positions, skills, languages, projects, and employees
- **Internationalization** — English and Polish
- **Theming** — light, dark, and system themes

## Tech Stack

### Dependencies

| Package                                                      | Purpose                                               |
| ------------------------------------------------------------ | ----------------------------------------------------- |
| **Next.js**                                                  | React framework with App Router                       |
| **React / React DOM**                                        | UI library                                            |
| **TypeScript**                                               | Type safety                                           |
| **iron-session**                                             | Encrypted cookie-based sessions                       |
| **GraphQL / graphql-request**                                | GraphQL client for API communication                  |
| **TanStack React Query**                                     | Server-state management and caching                   |
| **Axios**                                                    | HTTP client                                           |
| **React Hook Form / @hookform/resolvers**                    | Form state management and validation                  |
| **Zod**                                                      | Schema validation                                     |
| **Radix UI**                                                 | Accessible UI primitives (dialog, select, tabs, etc.) |
| **Tailwind CSS / tailwind-merge / class-variance-authority** | Utility-first styling                                 |
| **next-intl**                                                | Internationalization                                  |
| **next-themes**                                              | Theme switching (light, dark, system)                 |
| **@react-pdf/renderer**                                      | PDF generation                                        |
| **Lucide React**                                             | Icon library                                          |
| **Sonner**                                                   | Toast notifications                                   |

### Dev Dependencies

| Package                                                                            | Purpose                                        |
| ---------------------------------------------------------------------------------- | ---------------------------------------------- |
| **Jest / jest-environment-jsdom**                                                  | Unit test runner                               |
| **Testing Library (React, jest-dom, user-event)**                                  | Component testing utilities                    |
| **Playwright**                                                                     | End-to-end testing                             |
| **ESLint / eslint-config-next / eslint-config-prettier**                           | Linting                                        |
| **Prettier / prettier-plugin-tailwindcss / @trivago/prettier-plugin-sort-imports** | Code formatting                                |
| **Husky / lint-staged**                                                            | Git hooks for linting and formatting on commit |
| **GraphQL Codegen**                                                                | Automatic GraphQL type generation              |

## Prerequisites

- **Node.js** >= 22 (tested with v22.14.0)
- **npm** (or yarn / pnpm)
- **cv-node** backend running at `http://localhost:3001` (or configure via `GRAPHQL_URL`)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and edit as needed:

```bash
cp .env.example .env.local
```

| Variable         | Description                                                         | Default                             |
| ---------------- | ------------------------------------------------------------------- | ----------------------------------- |
| `SESSION_SECRET` | Secret for iron-session encryption (must be at least 32 characters) | —                                   |
| `GRAPHQL_URL`    | cv-node GraphQL endpoint                                            | `http://localhost:3001/api/graphql` |

### 3. Start the backend

Make sure the **cv-node** backend is running on port 3001 (see its own README for setup).

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production

```bash
npm run build
npm start
```

## Running Unit Tests

Unit tests use **Jest** and **React Testing Library**.

```bash
# Run all unit tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage
```

Coverage is collected from `src/**/*.{ts,tsx}`, excluding generated files and page wrappers. The threshold is **80% line coverage**.

### Coverage Results

| Metric     | Coverage |
| ---------- | -------- |
| Statements | 96.46%   |
| Branches   | 93.32%   |
| Lines      | 96.46%   |
| Functions  | 71.66%   |

**84 test suites, 578 tests — all passing.**

## Running E2E Tests

End-to-end tests use **Playwright** and require both the app and the backend to be running.

```bash
# Run all E2E tests (headless)
npm run e2e

# Run with browser visible
npm run e2e:headed

# Run with Playwright UI
npm run e2e:ui
```

### E2E Test Structure

#### `auth.spec.ts` — Authentication

- **Login page**
    - renders the login form
    - shows validation errors for empty fields
    - shows validation error for invalid email
    - shows validation error for short password
    - shows error for wrong credentials
    - logs in as employee and redirects to `/employees`
    - logs in as admin and redirects to `/admin/employees`
    - has link to signup page
- **Signup page**
    - renders the signup form
    - shows validation for weak password
    - shows error when passwords do not match
    - shows error for already taken email
    - has link to login page
- **Logout**
    - employee can log out
- **Route protection**
    - unauthenticated user is redirected to login
    - unauthenticated user cannot access admin routes
    - employee cannot access admin routes

#### `admin-crud.spec.ts` — Admin Panel

- **Admin navigation**
    - can navigate to all admin pages via sidebar
- **Departments CRUD** — displays list, create, edit, delete
- **Positions CRUD** — displays list, create, edit, delete
- **Skills CRUD** — displays list, create, delete
- **Languages CRUD** — displays list, create, delete
- **Projects CRUD** — displays list, create, delete
- **Employee management**
    - displays employee list with Create User button
    - shows employees in the table
    - can search employees
    - can open create user modal
    - can create a new employee
    - shows error for duplicate email
- **Admin CVs** — can view CVs list as admin
- **Admin Settings** — can access admin settings

#### `user-profile.spec.ts` — User Features

- **Employee list** — displays page, shows data, can search
- **Profile page** — displays profile form, shows member since info
- **User Skills page** — displays page, shows add skill button
- **User Languages page** — displays page, shows add language button
- **Settings page** — displays settings, can switch to dark/light theme
- **Sidebar navigation** — can navigate to all user pages

#### `cv-management.spec.ts` — CV Management

- displays the CV list page
- shows empty state when no CVs exist
- can create a new CV
- can search CVs by name

## Other Scripts

| Command                 | Description                          |
| ----------------------- | ------------------------------------ |
| `npm run lint`          | Run ESLint                           |
| `npm run format`        | Format code with Prettier            |
| `npm run format:check`  | Check formatting without writing     |
| `npm run codegen`       | Generate GraphQL types               |
| `npm run codegen:watch` | Generate GraphQL types in watch mode |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── [locale]/(auth)/    # Public auth pages (login, signup, etc.)
│   ├── [locale]/(user)/    # Protected user pages (employees, profile, cvs, skills, languages)
│   ├── [locale]/admin/     # Admin-only pages (CRUD for all entities)
│   └── api/                # API routes (auth, graphql proxy)
├── components/
│   ├── features/           # Domain-specific components
│   ├── layout/             # Sidebars, headers
│   ├── shared/             # Reusable UI components (DataTable, Pagination, etc.)
│   └── ui/                 # Radix-based primitives
├── lib/
│   ├── auth/               # Session config, permissions
│   ├── constants/          # Roles, routes
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions
├── types/                  # TypeScript type definitions
└── __tests__/              # Unit tests (mirrors src/ structure)
e2e/                        # Playwright E2E tests
messages/                   # i18n translation files (en.json, pl.json)
```
