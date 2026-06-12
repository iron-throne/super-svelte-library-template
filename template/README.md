# ui-kit

A Svelte 5 component library template powered by [SvelteKit](https://svelte.dev/docs/kit), [Tailwind CSS v4](https://tailwindcss.com), and TypeScript.

## Stack

- **Svelte 5** with runes mode enforced across the project
- **SvelteKit** — dev server, routing, and packaging
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **TypeScript** with strict config
- **ESLint + Prettier** (with `eslint-plugin-svelte`)
- **`@aryagg/theme`**, **`@aryagg/types`**, **`@aryagg/utils`** — shared design system packages

## Getting started

Install dependencies:

```sh
npm install
```

Start the dev server (includes a live showcase app at `src/routes`):

```sh
npm run dev

# open in browser automatically
npm run dev -- --open
```

## Project structure

```
src/
  lib/        ← library source (exported to consumers)
  routes/     ← showcase / preview app (not published)
```

Everything inside `src/lib` is part of the published library. Use `src/routes` to build demos and test components interactively.

## Building

Build and package the library:

```sh
npm run build
```

This runs `svelte-kit sync`, `svelte-package`, and `publint` in sequence. Output goes to `dist/`.

Preview the showcase app production build:

```sh
npm run preview
```

## Type checking & linting

```sh
npm run check          # svelte-check + tsc
npm run check:watch    # watch mode

npm run lint           # prettier + eslint
npm run format         # auto-format with prettier
```

## Publishing

1. Set the `"name"` field in `package.json` to your desired package name.
2. Add a `"license"` field and a `LICENSE` file (e.g. [MIT](https://opensource.org/license/mit/)).
3. Publish to npm:

```sh
npm publish
```

The `"exports"` field in `package.json` exposes `./dist/index.js` (Svelte) and `./dist/index.d.ts` (types) for consumers.
