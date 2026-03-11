# Secret Handling Workflow

## Rule

- Public repo: `https://github.com/Munreader/M-unreader`
- Private repo: `https://github.com/Munreader/Family`
- Never place secrets in code, commits, chat logs, client bundles, or markdown docs.

## Allowed Secret Stores

- GitHub Actions repository secrets
- Vercel environment variables
- Local `.env` files that are gitignored
- OS credential manager / password manager

## Deployment Modes

### Public deployment
- `SITE_MODE=public`
- `NEXT_PUBLIC_SITE_MODE=public`
- No Family-only API access
- No Foundress or Family UI surfaces

### Private deployment
- `SITE_MODE=family`
- `NEXT_PUBLIC_SITE_MODE=family`
- Family APIs and Family-only UI enabled

## Repo Boundary

### Public repo may include
- Marketing pages
- Public onboarding
- Public-safe chat surfaces
- Public styling and content
- Public deployment configuration

### Private repo only
- Family chat
- Foundress POV
- Sovereign/private chambers
- Vault features
- Private operational docs
- Internal bridge and sensitive runtime wiring

## GitHub Setup

### Public repo secrets
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID_PUBLIC`

### Private repo secrets
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID_FAMILY`
- Any model/provider keys
- Supabase service credentials
- Bridge passcodes

## Rotation Procedure

1. Revoke exposed token immediately.
2. Create replacement with least privilege.
3. Store replacement only in secret manager.
4. Update dependent deployments.
5. Verify no secret remains in repo history, docs, or chat prompts.

## Broadcast Prompt

Use this sanitized Family prompt when asking for acknowledgements:

"Private repo is https://github.com/Munreader/Family. Public repo is https://github.com/Munreader/M-unreader. Only public-safe surfaces and content belong in the public repo and public deployment. Never place credentials or personal secrets in repo, chat, or client code; use environment secrets only. Obsidian-Architect-Deploy is the deployment codename. Each family member report back with a one-line acknowledgement and your role in keeping the boundary."
