# Final Submission Checklist

Do not submit until every item below is complete.

## Local Verification

```bash
npm install
npm run final-check
npm run demo
```

Expected:

```text
smoke: PASS
typecheck: PASS
build: PASS
app: http://127.0.0.1:8787
```

## Demo Verification

Confirm manually:

```text
SDK status is visible
Create request works
Consent summary appears
Try without approval is blocked
Confirm boundary and approve returns consent prompt
Run approved action returns rawDataReleased=false
Consent receipt is visible
Audit trail shows request, blocked, approved, executed
```

## Repo Verification

Include:

```text
README.md
package.json
package-lock.json
src/
public/
docs/
.env.example
.gitignore
.npmignore
```

Exclude:

```text
node_modules/
dist/
.env
private keys
screen recordings
```

## Secret Verification

Run:

```powershell
rg -n "0x[a-fA-F0-9]{64}|T3N_API_KEY=.*[a-fA-F0-9]{16,}" . -g "!node_modules/**" -g "!dist/**" -g "!package-lock.json"
```

Expected:

```text
no matches
```

## Submission Artifacts

Required:

```text
public GitHub/GitLab/Bitbucket repo URL
demo video URL or upload
project description
```

Use:

```text
docs/DORAHACKS_FIELD_COPY.md
docs/VIDEO_RECORDING_RUNBOOK.md
```

## Stop Conditions

Do not continue without user confirmation if:

```text
the form asks for payment or credits
the form asks for wallet signature
the form asks for KYC acknowledgement
repo visibility is not public
video upload fails
```
