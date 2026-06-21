# Voiceover Script V2

Target video: `D:\snap\Recording 2026-06-22 002644.mp4`

Target length: about 95-97 seconds.

Voice style: calm, confident, security-product demo narration. Keep the wording concrete and let the visible demo prove the boundary.

## Narration

This demo shows a consent boundary for AI agents using the Terminal 3 SDK.

The point is simple: an agent can request a protected action, but it cannot run that action until the user approves the exact request.

At the top, the demo verifies the SDK integration. It imports `@terminal3/t3n-sdk`, shows the SDK version, and runs safely in local review mode without exposing secrets.

Now the agent creates a request. The user can inspect the purpose, the destination, the allowed data, the blocked data, the expiry window, and the policy fingerprint before approving anything.

This is the key security moment. Before approval, the action is blocked. The agent is asking to share a verified status, but the authorization boundary refuses execution because the user has not approved this protected action.

Next, the user confirms the visible boundary and approves the request. The approval is tied to this request id, this capability, this expiry, and this policy fingerprint.

After approval, the action can run, but the output is still narrow. The result is allowed, while `rawDataReleased` remains false. The agent receives proof-level fields, not raw private user data.

The consent receipt records what was approved and why it was allowed.

Finally, the audit trail shows the full sequence: request created, blocked attempt, user approval, and approved execution.

This keeps AI agent actions reviewable, consent-bound, and limited to the data the user explicitly approved.
