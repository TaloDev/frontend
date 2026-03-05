# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Useful Commands

```bash
npm test                         # Run all Vitest unit tests (runs with TZ=UTC)
npm test -- <pattern>            # Run specific test file(s) matching pattern

npm run lint -- --type-check     # Run linter and tsc simultaneously
```

### Directory Structure

```
src/
├── api/              # SWR hooks and API functions (91 files)
├── components/       # Reusable UI components
├── constants/        # App constants (routes, nav, user types)
├── entities/         # TypeScript types and Zod schemas (29 domain models)
├── modals/           # Modal dialog components
├── pages/            # Page components (39 pages)
├── services/         # Business logic (AuthService)
├── state/            # Recoil atoms (8 state files)
├── styles/           # CSS files
├── utils/            # Utilities and custom hooks
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

### Authorization

- Route-level checks with `canViewPage()` in Router
- Action-level checks with `canPerformAction()` throughout components
- Based on user type (ADMIN, OWNER, DEV, DEMO)
