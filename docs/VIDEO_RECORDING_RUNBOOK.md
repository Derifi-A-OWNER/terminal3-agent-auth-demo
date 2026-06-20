# Video Recording Runbook

Target length: 75-90 seconds

## Before Recording

```bash
npm install
npm run final-check
npm run demo
```

Open:

```text
http://127.0.0.1:8787
```

Browser setup:

```text
1080p recording
browser zoom 110-125%
close unrelated tabs
hide bookmarks if distracting
do not show .env
do not show private keys
```

## Timeline

### 0-5s

Say:

```text
This demo shows Terminal 3 Agent Auth as a consent boundary for AI agents.
```

### 5-15s

Show SDK status:

```text
@terminal3/t3n-sdk
version 3.9.0
testnet or local review mode
```

### 15-30s

Click:

```text
Create agent request
```

Show:

```text
Consent summary
purpose
allowed data
blocked data
expiry
policy fingerprint
```

### 30-42s

Click:

```text
Try without approval
```

Say:

```text
Without consent, the agent cannot execute.
```

### 42-58s

Click:

```text
Confirm boundary and approve
```

Say:

```text
The approval token is issued only after the user confirms this visible boundary.
```

### 58-75s

Click:

```text
Run approved action
```

Show:

```text
allowed: true
rawDataReleased: false
consentReceipt
policyFingerprint
```

### 75-90s

Show audit trail.

Say:

```text
The audit trail records request, block, approval, and execution. This keeps agent actions reviewable and consent-bound.
```

## Final Closing Line

```text
This is intentionally narrow and verifiable: the SDK is integrated, the action is consent-bound, and the agent receives only proof-level output with no raw private data released.
```
