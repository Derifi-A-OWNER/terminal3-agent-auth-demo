# DoraHacks Field Copy

Use this copy when filling the Terminal 3 Agent Dev Kit Bounty Challenge submission form.

## Project Name

```text
Consent-Bound Agent Auth Demo
```

## Short Description

```text
A Terminal 3 Agent Auth SDK demo that turns AI-agent actions into explicit, consent-bound requests. The agent can request a proof-only verified-status share, but execution is blocked until the user confirms the visible trust boundary. Approved execution returns a consent receipt and rawDataReleased=false.
```

## What You Built

```text
I built a small, judge-friendly Terminal 3 Agent Auth demo for a support-agent workflow. The agent asks to prove that a user is verified to a partner CRM, but it cannot run the protected action until the user reviews and confirms a visible trust boundary.

The demo shows:

1. SDK status for @terminal3/t3n-sdk@3.9.0
2. agent request creation
3. consent summary before approval
4. blocked execution without approval
5. approval token issued only after boundary confirmation
6. proof-only output with rawDataReleased=false
7. consent receipt tied to request, capability, policy fingerprint, and expiry
8. audit trail for request, block, approval, and execution
```

## Judging Fit Add-On

Use this as an optional final paragraph in the Details field after the main description.

```text
Judging fit:

Completeness: the repo includes a runnable app, final-check command, one-click judge walkthrough, manual demo path, trust guardrails, live-mode notes, and a narrated demo video.

SDK integration: the app imports @terminal3/t3n-sdk@3.9.0, exposes SDK status, keeps secrets server-side, supports local review mode, and includes optional live T3N mode through T3N_API_KEY.

Creativity: instead of a generic spending or procurement agent, this demo applies Agent Auth to privacy-safe proof sharing for an AI support workflow, with visible consent, blocked execution before approval, proof-only output, and an audit trail.
```

## Why This Is Different

```text
Previous Terminal 3 beta winners already covered delegated procurement and spending-pass style flows. This submission avoids those themes and focuses on a different enterprise problem: privacy-safe proof sharing by an AI support agent.

The core idea is that Agent Auth should not just let an agent act. It should make the boundary visible, consent-bound, and auditable before the action can execute.
```

## Technical Integration

```text
The project imports @terminal3/t3n-sdk@3.9.0 and exposes SDK status in the app. It supports local review mode without secrets, plus optional live T3N mode when a local T3N_API_KEY is provided.

Keys stay server-side only. The browser receives only SDK status, masked live-check output when available, policy metadata, and proof-level action results.
```

## Judge Instructions

```text
npm install
npm run final-check
npm run demo

Then open:

http://127.0.0.1:8787

Demo flow:

1. create request
2. review consent summary
3. try without approval
4. confirm boundary and approve
5. run approved action
6. inspect consent receipt and audit trail
```

## Demo Video Description

```text
The video shows the SDK status, agent request, visible trust boundary, blocked unapproved action, approved execution, rawDataReleased=false, consent receipt, and audit trail.
```

## Links To Mention

```text
README.md
docs/TRUST_GUARDRAILS.md
docs/BUG_DOC_GAP_SWEEP.md
docs/DEMO_SCRIPT.md
```
