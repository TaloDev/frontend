# AGENTS.md

## Useful Commands

```bash
npm test                         # Run all Vitest unit tests (runs with TZ=UTC)
npm test -- <pattern>            # Run specific test file(s) matching pattern

npm run lint -- --type-check     # Run linter and tsc simultaneously
```

### Directory Structure

```
src/
├── api/              # SWR hooks and API functions
├── components/       # Reusable UI components
├── constants/        # App constants (routes, nav, user types)
├── entities/         # TypeScript types and Zod schemas
├── modals/           # Modal dialog components
├── pages/            # Page components
├── services/         # Business logic (AuthService)
├── state/            # Recoil atoms
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
- Based on user type (ADMIN, OWNER, DEV)

### Environment Variables

**How it works:**

Runtime env vars are injected via a `<script>` in `index.html` that sets `window.__ENV__`. The app reads them through `getEnv()` in `src/utils/env.ts`, which:

1. Checks `window.__ENV__` for a substituted value
2. Falls back to `import.meta.env` for dev / CI builds
3. Detects unresolved placeholders (e.g., `"${API_URL}"`) and skips them

**Why not `import.meta.env` directly?**

Vite/Rollup inlines `import.meta.env` values at build time. For Docker images built without knowing the user's runtime env vars, this would bake empty strings into conditionals — breaking features like hCaptcha when the env var is optional.

**To add a new env var:**

1. Add it to `.env.production` with placeholder syntax:
   ```
   VITE_NEW_VAR=${NEW_VAR}
   ```
2. Add it to the `window.__ENV__` object in `index.html`
3. Use `getEnv('VITE_NEW_VAR')` in code instead of `import.meta.env.VITE_NEW_VAR`

The `Dockerfile` automatically extracts var names from `.env.production` and `entrypoint.sh` runs `envsub` on `index.html` at container startup.
