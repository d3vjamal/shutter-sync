# ShutterSync Mobile

Bare React Native (CLI) app for photographers — a mobile port of the core workflows from the web
app (`../src`), backed by the same Convex deployment (`../convex`). Currently Android-only (no
`ios/` project has been scaffolded yet).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Configure your Convex deployment URL

   ```bash
   cp .env.example .env
   # then edit .env and set CONVEX_URL to the same deployment
   # ../.env.local's VITE_CONVEX_URL points at
   ```

3. Run on Android (emulator or connected device)

   ```bash
   npm run android
   ```

   This starts the Metro bundler and builds/installs the debug APK. On subsequent runs, `npm start`
   alone is enough if the app is already installed.

## What's here

- `src/App.tsx` — app shell: `ConvexAuthProvider` (token storage via `react-native-keychain`) +
  React Navigation root.
- `src/navigation/` — root auth-gated navigator, bottom tabs, and the modal stack for
  create/edit screens.
- `src/screens/` — Dashboard, Packages, Agreements, Profile, and the Create Assignment /
  Create Freelance Job forms.
- `src/hooks/` — one-to-one ports of the web app's Convex hooks (`../src/hooks/*.js`).
- `src/components/ui/` — small RN primitives (Button, Card, Input, etc.) styled from
  `src/constants/theme.ts`, mirroring the web's design tokens.

## Scope

This app covers the core photographer workflows only — sign in/up, assignments, freelance jobs,
packages, agreements, payments, and profile. The admin dashboard and the public
marketing/photographer-profile pages are web-only and out of scope here.

Google sign-in is wired up (custom URL scheme `shuttersync://auth-callback`, registered in
`android/app/src/main/AndroidManifest.xml`) but requires your Convex deployment's Google OAuth
credentials to allow that redirect URI — see `../convex/auth.ts` and the
[Convex Auth OAuth docs](https://labs.convex.dev/auth/config/oauth/google).
