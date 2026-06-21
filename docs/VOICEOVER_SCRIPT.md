# Voiceover Script

Target video: `D:\snap\Recording 2026-06-21 231617.mp4`

Target length: about 120 seconds.

Voice style: calm, confident, product-demo narration. Do not oversell. Let the screen prove the security boundary.

## Narration

This demo shows a consent boundary for AI agents using the Terminal 3 SDK.

The goal is simple: an agent can request a protected action, but it cannot run that action until the user approves the exact request.

At the top, the demo verifies the SDK integration. It imports `@terminal3/t3n-sdk`, shows the SDK version, and runs safely in local review mode without exposing secrets or private keys.

Now the agent creates a request. The user can inspect the purpose, the destination, the data that may be shared, the data that must never be shared, the expiry window, and a policy fingerprint.

This is the important part: before approval, the action is blocked. The agent asks to share a verified status, but the authorization boundary refuses execution because there is no user consent yet.

Next, the user confirms the visible boundary and approves the request. The approval is tied to this exact capability, this exact request id, this expiry, and this policy fingerprint.

After approval, the action can run, but the output is still narrow. The result shows that the request is allowed, yet `rawDataReleased` remains false. The agent receives only proof-level fields, not raw private data.

The consent receipt records the approved capability, the policy fingerprint, the expiry, and the fact that the user confirmed the boundary.

Finally, the audit trail shows the full sequence: the request was created, the first attempt was blocked, the user approved, and the approved action executed.

This is intentionally narrow and verifiable: the SDK is integrated, the agent action is consent-bound, and private user data stays behind the Terminal 3 authorization boundary.
