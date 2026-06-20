# Publish Commands

Use these commands after creating an empty public GitHub repo.

Recommended repo name:

```text
terminal3-agent-auth-demo
```

## Prepare Local Repo

From this folder:

```powershell
cd C:\Users\ADMIN\Desktop\mybot\MultiMeta_Prime\BUG_HUNTER_OS_V1\targets\terminal3_agent_auth_bounty_2026_06\terminal3-agent-auth-demo
```

Verify:

```powershell
npm run final-check
```

Then initialize and commit:

```powershell
git init
git add README.md package.json package-lock.json tsconfig.json .env.example .gitignore .npmignore src public docs
git commit -m "Add Terminal 3 Agent Auth consent-bound demo"
```

## Connect Remote

Replace `YOUR_OWNER` with your GitHub owner.

```powershell
git branch -M main
git remote add origin https://github.com/YOUR_OWNER/terminal3-agent-auth-demo.git
git push -u origin main
```

## Final Public URL

Use this format in DoraHacks:

```text
https://github.com/YOUR_OWNER/terminal3-agent-auth-demo
```

## Do Not Commit

```text
node_modules/
dist/
.env
recordings with private data
```
