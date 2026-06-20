# Demo Script

Use this script for the required DoraHacks demo video.

## 75-90 Second Walkthrough

1. Start the app:

   ```bash
   npm install
   npm run final-check
   npm run demo
   ```

2. Open `http://127.0.0.1:8787`.

3. Show the SDK status panel:

   ```text
   @terminal3/t3n-sdk 3.9.0
   environment: testnet
   local review mode unless T3N_API_KEY is set
   ```

4. Click `Create agent request`.

5. Show the consent summary:

   ```text
   purpose
   allowed data
   blocked data
   expiry
   policy fingerprint
   ```

6. Click `Try without approval`.

7. Show that it is blocked:

   ```text
   Blocked: user has not approved this protected action.
   ```

8. Click `Confirm boundary and approve`.

9. Click `Run approved action`.

10. Show the safe payload:

    ```text
    verifiedStatus: verified
    rawDataReleased: false
    consentReceipt: request id, capability, policy fingerprint, expiry
    ```

11. Show the audit trail with request, blocked, approved, and executed events.

## Closing Line

This is intentionally narrow: a complete Agent Auth boundary with explicit consent, denial, policy fingerprinting, and proof-only output that a judge can verify in under two minutes.
