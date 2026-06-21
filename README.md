# Terminal 3 Agent Auth Demo

This is a small, judge-friendly demo for the Terminal 3 Agent Dev Kit Bounty Challenge.

It shows one clear thing:

> An AI agent can request a protected action, but the action stays blocked until the user explicitly approves it.

The demo uses the real `@terminal3/t3n-sdk` package as the SDK boundary. It can run in two modes:

- Local review mode: no secrets required. Shows the allow/deny policy flow and verifies that the SDK is installed and importable.
- Live T3N mode: if `T3N_API_KEY` is present locally, the gateway can derive the wallet address and run the real SDK handshake/auth path.

No private key is committed, printed, or sent to the browser.

## Why This Fits The Bounty

The scoring weights are:

- 30% solution completeness
- 40% SDK integration
- 30% creativity

So this repo is intentionally small. It focuses on a complete and inspectable Agent Auth flow instead of a large unfinished product.

The chosen use case is not procurement or spending-pass automation, because those were already beta-winning themes. This demo is a privacy-safe credential sharing flow:

```text
AI support agent -> asks to share a verified status -> user approves or denies -> only redacted proof leaves the boundary
```

## Quick Start

```bash
npm install
npm run final-check
npm run demo
```

Open:

```text
http://127.0.0.1:8787
```

For the fastest review path, click:

```text
Run judge walkthrough
```

That button resets the demo, creates a fresh agent request, proves that execution is blocked before approval, confirms the boundary, executes the approved proof-only action, and prints a compact PASS summary.

## Optional Live SDK Check

Create a local `.env` or set the environment variable in your shell:

```bash
T3N_API_KEY=[local-private-key]
```

Then run:

```bash
npm run demo
```

The app will show a masked wallet/DID preview when the key is present. The key remains server-side only.

The local server automatically loads `.env` through `dotenv`, so judges can either export `T3N_API_KEY` in the shell or place it in a local `.env` file. The browser never receives the key.

See `docs/LIVE_T3N_MODE_EVIDENCE.md` for the exact live-mode boundary and masked output behavior.

## Demo Flow

1. Open the local app.
2. Click `Create agent request`.
3. Review the consent summary: purpose, allowed data, blocked data, expiry, and policy fingerprint.
4. Click `Try without approval`.
5. The request is blocked.
6. Click `Confirm boundary and approve`.
7. Click `Run approved action`.
8. The request is allowed and returns only redacted proof fields plus a consent receipt.
9. Review the audit log.

## Security Boundary

The demo enforces three simple invariants:

1. The agent action cannot execute without explicit user approval.
2. The user must confirm the visible trust boundary.
3. Only the requested capability can be used.
4. The approval expires with the request.
5. The response never returns raw private data.

See:

- `src/policy.ts`
- `src/t3nGateway.ts`
- `docs/DEMO_SCRIPT.md`
- `docs/LIVE_T3N_MODE_EVIDENCE.md`
- `docs/TRUST_GUARDRAILS.md`

## Rubric Fit

### Completeness

The repo includes a runnable app, `npm run final-check`, a one-click judge walkthrough, a manual step-by-step path, README instructions, submission notes, trust guardrails, live-mode evidence, and a narrated demo video.

### SDK Integration

The app imports `@terminal3/t3n-sdk@3.9.0`, exposes SDK status in the UI, keeps the live key server-side, supports local review mode without secrets, and includes optional live T3N mode through `T3N_API_KEY`.

### Creativity

Instead of another delegated spending or procurement agent, this demo applies Agent Auth to privacy-safe proof sharing for an AI support workflow. The agent can request a proof, but the user controls what leaves the boundary.

## Submission Notes

Use `docs/SUBMISSION_NOTES.md` for the DoraHacks submission form.

The onboarding sweep is recorded in `docs/BUG_DOC_GAP_SWEEP.md`.

Final submission helpers:

- `docs/DORAHACKS_FIELD_COPY.md`
- `docs/VIDEO_RECORDING_RUNBOOK.md`
- `docs/FINAL_SUBMISSION_CHECKLIST.md`
- `docs/POST1_90_PLUS_UPGRADE_PLAN.md`
- `docs/PUBLISH_COMMANDS.md`
