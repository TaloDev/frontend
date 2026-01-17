# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Talo is a self-hostable game dev dashboard. This is the frontend React application that provides a web interface for managing players, leaderboards, events, stats, game saves, and other game backend features. The frontend communicates with the Talo backend API.

## Development Commands

### Running the application
```bash
npm run dev              # Start dev server on http://localhost:8080
npm run dev:e2e          # Start dev server in e2e mode for Cypress tests
npm run build            # Build for production (runs tsc + vite build)
```

### Testing
```bash
npm test                 # Run all Vitest unit tests (runs with TZ=UTC)
npm test -- <pattern>    # Run specific test file(s) matching pattern
npm run test:e2e         # Start dev server and open Cypress for e2e tests
npm run cypress:open     # Open Cypress (dev server must be running)
```

### Code Quality
```bash
npm run lint             # Run ESLint on src/**/*.{js,jsx,ts,tsx}
```

### Testing Notes
- Unit tests use Vitest with jsdom environment
- Test files are co-located with source in `__tests__/` directories
- E2E tests are in `cypress/e2e/pages/` and use Cypress
- Coverage excludes `src/api/`, `src/entities/`, `src/constants/`, and `src/utils/canViewPage.ts`
- Tests must run with `TZ=UTC` for consistent date handling

## Architecture Overview

### Tech Stack
- React 18 with TypeScript
- Vite for build tooling
- React Router v6 for routing
- Recoil for global state management
- Axios for HTTP requests
- SWR for data fetching and caching
- Zod for runtime validation
- Tailwind CSS v4 for styling
- Recharts for charts
- React Hook Form for forms

### Directory Structure

```
src/
├── api/              # SWR hooks and API functions (91 files)
├── components/       # Reusable UI components
│   ├── billing/
│   ├── charts/
│   ├── events/
│   ├── saves/
│   ├── tables/
│   ├── toast/
│   └── toggles/
├── constants/        # App constants (routes, nav, user types)
├── entities/         # TypeScript types and Zod schemas (29 domain models)
├── modals/           # Modal dialog components
├── pages/            # Page components (39 pages)
├── services/         # Business logic (AuthService)
├── state/            # Recoil atoms (8 state files)
├── styles/           # CSS files
├── utils/            # Utilities and custom hooks
│   ├── group-rules/
│   └── validation/
├── App.tsx           # Main app component (handles auth and routing)
├── Router.tsx        # Route definitions with lazy loading
└── index.tsx         # App entry point
```

### Routing
- Routes are defined in [Router.tsx](src/Router.tsx) using React Router v6
- Route paths are constants in [src/constants/routes.ts](src/constants/routes.ts)
- All pages use lazy loading via `React.lazy()` for code splitting
- Routes are split into unauthenticated (login, register) and authenticated sections
- Permission checks use `canViewPage()` utility before rendering routes
- Many routes only render when an `activeGame` is selected

### State Management
- Global state uses Recoil with atoms in [src/state/](src/state/)
- Key atoms:
  - `userState` - Current authenticated user
  - `activeGameState` - Currently selected game (persisted to localStorage)
  - `gamesState` - User's games list
  - `organisationState` - Organization data
  - `devDataState` - Dev data inclusion flag
- State consumed via `useRecoilValue()`, `useRecoilState()`, `useSetRecoilState()`

### API Layer
- Base Axios instance configured in [src/api/api.ts](src/api/api.ts)
- Request interceptor adds Bearer token and dev data header
- Response interceptor handles 401s with automatic token refresh
- Base URL from `VITE_API_URL` environment variable

**Data fetching patterns:**

1. **SWR hooks** (23 hooks): Pattern is `use{Entity}(game, params)` returning `{ data, loading, error }`
   - Examples: `useEvents`, `useLeaderboards`, `useStats`
   - Uses `makeValidatedGetRequest()` for Zod validation
   - Automatic caching, revalidation, and deduplication

2. **Mutation functions** (68 functions): Named after action (e.g., `createLeaderboard`, `updatePlayer`)
   - Uses `makeValidatedRequest()` wrapper for Zod validation
   - Returns validated, typed responses

### Component Patterns
- Functional components with TypeScript
- Composition over inheritance
- Context for cross-cutting concerns (EventsContext, ToastProvider)
- Form handling with React Hook Form
- Tables use composable system: `Table` > `TableHeader`/`TableBody` > `TableCell`

### Key Utilities and Hooks
Located in [src/utils/](src/utils/):

- `useTimePeriod` - Date range calculation from period strings ('1d', '7d', '30d', 'w', 'm', 'y')
- `useTimePeriodAndDates` - Combined time period and date management
- `useLocalStorage` - localStorage with React state sync
- `usePlayer` - Extract player from URL params
- `useSortedItems` - Client-side sorting
- `useSearch` - Client-side search filtering
- `useNodeGraph` - Graph visualization for save data (using @xyflow/react)
- `buildError` - Normalize error objects
- `canPerformAction` / `canViewPage` - Permission checking
- `getEventColour` - Consistent color assignment for events

## Important Patterns

### Authentication
- Managed by [AuthService](src/services/AuthService.ts) singleton
- Token-based with automatic refresh on 401 responses
- Token stored in memory (not localStorage for security)
- Login redirects handled via `useIntendedRoute` hook

### Authorization
- Route-level checks with `canViewPage()` in Router
- Action-level checks with `canPerformAction()` throughout components
- Based on user type (ADMIN, OWNER, DEV, DEMO)

### Validation
- Zod schemas defined alongside entities in [src/entities/](src/entities/)
- `makeValidatedRequest()` and `makeValidatedGetRequest()` wrappers ensure type safety
- Validation errors logged and sent to Sentry

### Error Handling
- Centralized error normalization via `buildError()`
- API errors show user-friendly messages via toast notifications
- Sentry integration for error tracking

### Date Handling
- All API dates must be UTC
- Use `convertDateToUTC()` when sending dates to API
- Tests run with `TZ=UTC` to ensure consistency

### Active Game Context
- Most features require an active game to be selected
- Active game stored in Recoil state and persisted to localStorage
- Routes conditionally render based on `activeGame` availability

## Environment Variables

Required environment variables (set via `.env` files):
- `VITE_API_URL` - Backend API base URL (e.g., `http://localhost:3000`)

## Node Version

This project requires Node.js 24.x (see package.json engines).

## Git Workflow

Main branch for PRs: `develop`
