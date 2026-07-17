# Rewards Hub — Mobile (Frontend)

This folder contains the Expo-based React Native frontend for the Rewards Hub app.

## Quick Start

Prerequisites:
- Node.js (>=18)
- pnpm (recommended) or npm/yarn
- Expo Go (for device testing) or Android/iOS simulator

From the `mobile` directory:

```bash
pnpm install
pnpm dev
```

- `pnpm dev` starts the Expo Metro bundler (`expo start`).
- Open the Metro UI in a browser or scan the QR code with Expo Go to run on a physical device.

## Useful Scripts

- `pnpm dev` — start development server (runs `expo start`).
- `pnpm typecheck` — run TypeScript type checks.
- `pnpm test` — run Jest tests.
- `pnpm test:watch` — run Jest in watch mode.

Run them from the `mobile` folder (or via workspace tooling if you prefer).

## Project Structure (high level)

- `app/` — Expo Router app directory and screens.
- `components/` — shared UI components.
- `features/` — feature-scoped code (discover, profile, rewards, tasks, wallet).
- `services/` — API and other services.
- `hooks/` — custom React hooks.
- `assets/` — images and other static assets.
- `test-types/` and `__tests__/` — test helpers and tests.

## Development Tips

- Use the Expo Dev Tools to open simulators or share QR codes.
- When changing native-linked packages, restart the bundler.
- Keep `typescript` and `tsconfig.json` in sync; run `pnpm typecheck` before PRs.

## Testing

Unit and integration tests use Jest and React Native Testing Library.

```bash
pnpm test
pnpm test:watch
```

## Environment & Config

Configuration lives in `constants/config.ts`. If you need to add environment-specific values, prefer using environment variables or a secure secrets mechanism and avoid committing secrets to source control.

## Contributing

- Follow existing code patterns and TypeScript types in `types/`.
- Run `pnpm typecheck` and `pnpm test` before opening a PR.

## Troubleshooting

- Metro bundler cache issues: run `pnpm dev -- --clear` or restart the bundler.
- Native build issues: ensure correct SDK versions in `package.json` and run `pnpm install` from the `mobile` folder.

## Further Reading

See the main project README for backend and workspace-level instructions.
