# Bug And Documentation Gap Sweep

This file records the developer-experience sweep for the Terminal 3 Agent Auth demo.

## Scope

The sweep only covers real setup, documentation, and demo gaps that affect a judge or developer trying to run this repo.

It does not claim Terminal 3 platform bugs unless they are reproducible from official SDK usage.

## Findings

### 1. `.env` onboarding mismatch

Status: fixed in this repo

The README allowed a judge to create a local `.env` with `T3N_API_KEY`, but the first server implementation only read process environment variables. That meant a judge following the README exactly could see local review mode even after adding `.env`.

Fix:

- added `dotenv`
- load `.env` before SDK status and live auth checks
- clarified in the README that `.env` is local-only and the key is never sent to the browser

Repro before fix:

```bash
echo "T3N_API_KEY=[local-private-key]" > .env
npm run demo
```

Expected:

```text
keyPresent: true
liveAuthAvailable: true
```

Actual before fix:

```text
keyPresent: false
liveAuthAvailable: false
```

### 2. Live SDK check was not exposed in the UI

Status: fixed in this repo

The server had `/api/live-auth-check`, but the browser demo did not expose a judge-friendly way to run it. This made the optional live SDK path harder to verify during a short judging pass.

Fix:

- added `Run live SDK check`
- show local-review fallback if no key is present
- show only masked DID/usage status when live auth is available

## Current Verification

```bash
npm install
npm run smoke
npm run typecheck
npm run build
npm run demo
```

Then open:

```text
http://127.0.0.1:8787
```

The required local review path works without secrets. The optional live path requires a local `T3N_API_KEY`.
