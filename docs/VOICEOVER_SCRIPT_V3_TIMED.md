# Voiceover Script V3 Timed

Target video: `D:\snap\Recording 2026-06-22 002644.mp4`

Target length: 96.93 seconds.

Voice style: calm, concise, aligned to visible actions. This script is split into timed segments so the narration follows the screen instead of describing an earlier state.

## Timed Segments

### 00.5s

This demo shows Terminal 3 Agent Auth as a consent boundary for AI agents.

### 06.5s

The SDK status is visible: Terminal 3 SDK is imported, versioned, and running in local review mode.

### 14.0s

The agent request flow is now visible. It asks to share verified status with a partner CRM, without requesting raw private data.

### 23.0s

After creating the request, the user can inspect the purpose, destination, allowed data, blocked data, expiry, and policy fingerprint before approving anything.

### 36.0s

This is the key security moment: before approval, the protected action is blocked because the user has not approved this exact request.

### 49.0s

Next, the user confirms the visible boundary and approves the request. The approval is bound to this request id, capability, expiry, and policy fingerprint.

### 61.0s

After approval, the action can run, but the output stays narrow. The result is allowed, while `rawDataReleased` remains false.

### 73.5s

The consent receipt records what was approved, and the agent receives proof-level fields instead of raw private user data.

### 84.0s

Finally, the audit trail shows the full sequence: request created, blocked attempt, user approval, and approved execution.

### 92.0s

Reviewable, consent-bound, and limited to user-approved data.
