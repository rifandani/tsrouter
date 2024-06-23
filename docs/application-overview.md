# Application Overview

The application built with:

- `vite` + `typescript` -> development productivity
- `biome` -> fast linter and formatter
- `@playwright/test` -> e2e test
- `tailwindcss` + `tailwindcss-animate` + `tailwind-merge` + `class-variance-authority` -> easy styling
- `@formkit/auto-animate` -> automate transition animation when component mount/unmount
- `@iconify/react` -> SVG icon on demand
- `react-aria` + `react-aria-components` + `react-stately` + `sonner` -> accessible and robust unstyled UI components
- `zod` -> runtime schema validation
- `ts-pattern` -> better pattern matching
- `ky` + `@tanstack/react-query` -> server state manager + data fetching
- `react-hook-form` -> form manager
- `zustand` -> global state manager
- `type-fest` -> type helpers
- `@rifandani/nxact-yutiriti` -> object/array/string helpers
- `@internationalized/date` -> date helpers

[Demo App](https://react-app-rifandani.vercel.app)

## Get Started

Prerequisites:

- Node LTS (v20+)
- PNPM 8.15+

To set up the app execute the following commands:

```bash
# clone the template OR you can click "Use this template" in github
$ git clone https://github.com/rifandani/react-app.git
# OR use degit
$ npx degit rifandani/react-app#main

$ cd react-app

# rename the example env files
$ cp .env.development.example .env.development
$ cp .env.staging.example .env.staging
$ cp .env.production.example .env.production

# install deps
$ pnpm install
```

## Development

```bash
# Runs the app
$ pnpm dev
```

## Testing

We use Playwright for our E2E tests in this project. Check out [testing docs](./testing.md) for more info.

```bash
# run test headless
$ pnpm test

# run test in UI mode
$ pnpm test:ui

# open the test report
$ pnpm test:report
```

## Build

```bash
# build app in "staging" mode
$ pnpm build:staging

# build app in "production" mode
$ pnpm build
```

## Managing Updates

- Update dependencies weekly using dependencies updater. I recommend using Vscode extensions: [Vscode Ecosystem](https://marketplace.visualstudio.com/items?itemName=rifandani.vscode-ecosystem) (also maintained by myself)
- When you update `@playwright/test`, don't forget to also download new browser binaries and their dependencies by running `pnpm test:install`

## Deployment

For now only supports deployment to Vercel.
Check out `vercel.json` file for further details.
