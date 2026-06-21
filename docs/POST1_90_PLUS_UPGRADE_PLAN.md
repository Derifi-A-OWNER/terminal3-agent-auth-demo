# Post 1 90+ Upgrade Plan

This file freezes the post-submit improvement plan for the Terminal 3 Agent Auth track.

## Goal

Increase judge confidence against the published scoring rubric:

- 30% solution completeness
- 40% SDK integration
- 30% creative application of the SDK

## Changes In This Post

1. Add a visible judge walkthrough path in the UI.
2. Add a reset path so reviewers can restart from a clean state.
3. Document optional live T3N mode and the server-side secret boundary.
4. Add README sections that map the demo directly to the scoring criteria.

## Non-Goals

- Do not change the core policy invariant.
- Do not require judges to provide a live API key.
- Do not commit secrets, recordings, or generated build output.
- Do not replace the existing submitted video unless the UI change makes the video misleading.

## Judge Success Path

```text
npm install
npm run final-check
npm run demo
open http://127.0.0.1:8787
click Run judge walkthrough
confirm blockedBeforeApproval=true
confirm rawDataReleased=false
inspect consent receipt and audit trail
```

