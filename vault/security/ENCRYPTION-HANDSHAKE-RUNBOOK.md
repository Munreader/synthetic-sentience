# Encryption Handshake Runbook

Purpose: finalize and verify migration handshake integrity for the Fortress bridge.

## Command

```powershell
powershell -ExecutionPolicy Bypass -File scripts/finalize-encryption-handshake.ps1
```

## Output
- JSON report: `vault/security/encryption-handshake-report.json`
- Console verdict: `PASS`, `WARN`, or `FAIL`

## Checks
- `LUNA_PASSCODE` present in `vault/fortress/.env`
- Bridge health endpoint reachable and healthy
- Authenticated chat call succeeds without access denial
- `Caddyfile` includes TLS transport hints
- Public tunnel URL exists and is HTTPS

## Verdict Rules
- `FAIL`: passcode, health, or authenticated chat fails
- `WARN`: core handshake passes but transport hardening incomplete
- `PASS`: all checks pass

## Recommended Follow-up
- If `WARN` or `FAIL`, harden transport and rotate keys before exposing endpoints.
