# Submission Notes

## What We Built

A minimal Terminal 3 Agent Auth demo showing explicit user approval for a protected AI-agent action.

The agent asks to share a verified status with a partner support CRM. The request is blocked until the user approves the exact request. After approval, the response returns only proof-level fields and confirms that raw private data was not released.

## Why It Is Different

The beta winners already covered delegated procurement and spending-pass style flows. This demo avoids that overlap and focuses on a different enterprise problem:

```text
Can an AI support agent prove a user status to another system without exposing raw private data?
```

## Terminal 3 Integration

The repo imports and uses `@terminal3/t3n-sdk@3.9.0`.

It supports:

- local review mode with no secrets required
- optional live T3N mode if `T3N_API_KEY` is set locally
- server-side-only key handling
- explicit allow/deny flow
- visible consent summary before approval
- policy fingerprint and expiry on every request
- consent receipt after approved execution
- audit log for request, block, approval, and execution events
- a documented onboarding gap sweep in `docs/BUG_DOC_GAP_SWEEP.md`

## Judge Checklist

```text
npm install
npm run smoke
npm run demo
open http://127.0.0.1:8787
create request
review consent summary
try without approval
approve
run approved action
inspect consent receipt
inspect audit log
open docs/BUG_DOC_GAP_SWEEP.md
```

## Safety Notes

- No API key is committed.
- No private key is returned to the browser.
- No raw private user data is included in the safe payload.
- The app does not claim live testnet auth unless a local `T3N_API_KEY` is provided.
- `.env` is supported locally through `dotenv`; secrets are ignored by git.
- The approval token is only issued after the user confirms the visible trust boundary.
