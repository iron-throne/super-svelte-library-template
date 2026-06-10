# @aryagg/create-super-svelte-skeleton

A CLI scaffolding tool. One command gives you a fully wired Svelte 5 starter — auth, API layer, i18n, offline support, and 20+ components — ready to run.

---

## 1. Create your project

```bash
npm create @aryagg/super-svelte-skeleton my-app
```

This copies the full template into `my-app/` and runs `npm install` automatically.

> `npm create` prepends `create-` to the package name automatically, so `@aryagg/super-svelte-skeleton` resolves to this package (`@aryagg/create-super-svelte-skeleton`).

---

## 2. Set up environment variables

Three env files are included — each loaded automatically by Vite depending on how you run the app:

| File | When it loads |
|---|---|
| `.env` | Always (base values, any mode) |
| `.env.development` | `npm run dev` only |
| `.env.production` | `npm run build` / `npm run preview` only |

Values in the mode-specific file override `.env`.

Copy the example file as your starting point:

```bash
cp .env.example .env
```

**`.env` — shared base**
```env
PUBLIC_SITE_NAME="My App"
PUBLIC_SITE_DESCRIPTION="A high-performance SvelteKit application."
PUBLIC_API_URL="https://api.myapp.com"
PUBLIC_CONFIG_ENV="local"
PUBLIC_BASE_PATH="/app"
```

**`.env.development` — local dev overrides**
```env
PUBLIC_CONFIG_ENV="local"
PUBLIC_BASE_PATH="/skeleton-local"
```

**`.env.production` — production build overrides**
```env
PUBLIC_CONFIG_ENV="production"
PUBLIC_BASE_PATH="/prod"
```

**Rules:**
- No spaces around `=` — `KEY=VALUE`, not `KEY = VALUE`
- Variables starting with `PUBLIC_` are available in the browser and server
- Variables without `PUBLIC_` are server-only
- After editing any `.env` file, stop and restart `npm run dev`

---

## 3. Configure runtime settings

Open `static/config/config.local.json` for local dev (or `config.prod.json` for production).  
The active file is picked based on `PUBLIC_CONFIG_ENV` in your `.env`.  
These files load at runtime — no rebuild needed when you change them.

```json
{
  "name": "local"
}
```

---

## 4. Run the app

```bash
cd my-app
npm run dev
```

App starts at `http://localhost:5173`.

**Other commands:**

| Command | What it does |
|---|---|
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run machine-translate` | Auto-fill missing i18n translation keys |

---

## Project structure

```
my-app/
├── src/
│   ├── routes/
│   │   ├── (auth)/             ← login, register, forgot/reset password
│   │   ├── (protected)/        ← dashboard & admin (auth-gated)
│   │   ├── settings/           ← settings page
│   │   └── theme/              ← theme preview page
│   ├── lib/
│   │   ├── api/                ← HTTP client, endpoints, services, types
│   │   ├── components/         ← 20+ reusable UI components
│   │   ├── stores/             ← auth, config, snackbar, loader state
│   │   ├── composables/        ← Svelte actions (autoFocus, clickOutside)
│   │   ├── constants/          ← route names, auth keys
│   │   ├── utils/              ← helpers (string, date, number, URL, theme)
│   │   ├── types/              ← shared TypeScript interfaces
│   │   └── styles/             ← global CSS and Tailwind config
│   ├── hooks.server.ts         ← auth, locale, API key middleware
│   ├── hooks.client.ts         ← client error handling
│   └── service-worker.ts       ← offline cache + request queue
├── messages/
│   ├── en.json                 ← English translations
│   ├── es.json                 ← Spanish translations
│   └── ar.json                 ← Arabic translations
├── static/
│   ├── config/
│   │   ├── config.local.json   ← runtime config for local dev
│   │   └── config.prod.json    ← runtime config for production
│   ├── theme-light.css
│   └── theme-dark.css
├── .env                        ← your env vars (not committed)
├── .env.example                ← template for env vars
├── svelte.config.js
├── vite.config.ts
└── package.json
```

---

## Features

### Authentication
- Session cookie–based login (httpOnly, secure in production)
- JWT access + refresh tokens stored in cookie, auto-read by server hooks
- `/login`, `/register`, `/forgot-password`, `/reset-password` pages — all styled and wired
- Auth store with role-based helpers (`isAdmin`, `hasRole`, `hasPermission`)
- 5-level role hierarchy: `GUEST → USER → MANAGER → ADMIN → SUPER_ADMIN`
- Protected route group `(protected)/` — server layout checks auth before rendering

### API layer
Located in `src/lib/api/`:

| Folder | Purpose |
|---|---|
| `axiosClient.ts` | Configured axios instance — base URL from env, 30s timeout, auto Bearer token, 401 handler |
| `http.ts` | Response normalizer + offline-queue-aware request wrapper |
| `endpoints/` | URL constants with a `buildUrl()` param helper |
| `services/` | Functions for every API call (login, register, me, logout, refresh, list, get, update, remove) |
| `types/` | TypeScript interfaces for all payloads and responses |

### Offline support
- Service worker with cache-first for static assets and network-first for API/pages
- IndexedDB sync queue — requests made offline are stored and replayed when network returns
- Background Sync API (Chrome/Edge) with postMessage fallback (Safari/Firefox)

### i18n (multi-language)
- **Paraglide** (`@inlang/paraglide-sveltekit`) — compile-time-safe translations
- Languages: English, Spanish, Arabic (RTL supported)
- Language switcher in `Header.svelte` — persists to localStorage
- To add a language: add `messages/xx.json`, register in `project.inlang/settings.json`, run `npm run machine-translate`

### Theming
- Light / dark CSS variable themes in `static/theme-light.css` and `theme-dark.css`
- Theme loaded before first paint — no flash
- Toggle in `Header.svelte` — persists preference
- Theme preview page at `/theme`


### Developer experience
- Auto-imports via `unplugin-auto-import` — no need to import `onMount`, `goto`, `fade`, etc.
- Path aliases — `$components`, `$stores`, `$utils`, `$lib`
- TypeScript strict mode — unused locals/params flagged
- ESLint + Prettier preconfigured
- VS Code extensions and debugger configured out of the box
- Version polling — layout detects new deploys and reloads automatically

---

## How to publish a new version

```bash
# 1. Make your changes inside template/ or cli.js

# 2. Bump the version
npm version patch   # 1.0.1 → 1.0.2
npm version minor   # 1.0.0 → 1.1.0
npm version major   # 1.0.0 → 2.0.0

# 3. Publish to npm
npm publish --access public

# 4. Clear the npx cache so users get the new version immediately
npx clear-npx-cache
```

> On Windows, clear manually if needed:
> `Remove-Item -Recurse -Force "$env:LOCALAPPDATA\npm-cache\_npx"`

### What gets published

Only `cli.js` and the `template/` folder are included in the npm tarball (controlled by the `files` field in `package.json`). This README and other repo files are not published.

### Repo structure

```
super-duper-skeleton-svelte/
├── cli.js          ← scaffolding script (entry point)
├── package.json    ← package config (name, version, bin, files)
└── template/       ← everything here gets copied into the new project
```
