# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
npm run lint             # Run Oxlint on src/**/*.{js,jsx,ts,tsx}
```

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

### Data fetching

1. **SWR hooks** (23 hooks): Pattern is `use{Entity}(game, params)` returning `{ data, loading, error }`
   - Examples: `useEvents`, `useLeaderboards`, `useStats`
   - Uses `makeValidatedGetRequest()` for Zod validation
   - Automatic caching, revalidation, and deduplication

2. **Mutation functions** (68 functions): Named after action (e.g., `createLeaderboard`, `updatePlayer`)
   - Uses `makeValidatedRequest()` wrapper for Zod validation
   - Returns validated, typed responses

### Authorization

- Route-level checks with `canViewPage()` in Router
- Action-level checks with `canPerformAction()` throughout components
- Based on user type (ADMIN, OWNER, DEV, DEMO)

## Git Workflow

Main branch for PRs: `develop`
