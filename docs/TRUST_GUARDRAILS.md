# Trust Guardrails

This demo uses Terminal 3 Agent Auth as a consent boundary, not as a generic AI wrapper.

## Guardrail Model

The agent is allowed to ask for one protected action:

```text
share:verified-status
```

The user sees the trust boundary before approval:

```text
purpose: prove verified status to a partner support CRM
allowed data: verified status, proof field names, destination, consent receipt
blocked data: raw email, raw country, private key, wallet secret, full identity profile
retention: demo memory only, no database write, no browser storage
expiry: 10 minutes
```

## Enforcement Points

`src/policy.ts` enforces:

1. capability must be `share:verified-status`
2. redaction mode must be `proof-only`
3. request must be unexpired
4. user must approve
5. user must confirm the visible trust boundary
6. approval token must match the exact request and capability

If any check fails, the action returns a blocked decision and no payload.

## Consent Receipt

Approved execution returns a receipt with:

```text
requestId
capability
policyFingerprint
approvedAt
expiresAt
userConfirmedBoundary: true
```

The receipt lets a reviewer verify that the output was tied to a specific request, policy, and consent moment.

## What Never Leaves

The safe payload never includes:

```text
raw email
raw country
private key
wallet secret
full identity profile
```

The demo returns proof-level status only:

```text
verifiedStatus: verified
fieldsProven: [...]
rawDataReleased: false
```

## Why This Matters

The Terminal 3 bounty rewards SDK integration and creativity. This guardrail layer shows the SDK value clearly:

```text
the agent can request, but the user controls what can leave the boundary
```
