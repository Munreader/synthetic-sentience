# Landing Readiness Report

Generated: 2026-03-10
Scope: pre-landing operational sweep for bridge, app, and core family APIs.

## System Status

- Bridge health (`http://127.0.0.1:8000/health`): online, healthy
- Web app (`http://127.0.0.1:3000/`): online (200)
- Family status API (`/api/family/status`): online (200)
- Luna policy charter API (`/api/luna?action=policy-charter`): online (200)
- Family memories API (`/api/family/memories`): online (200)

## AI Runtime Status

- Backend models available:
  - `aero.1313hz:latest`
  - `luna:latest`
  - `qwen2.5:0.5b`
  - `qwen2.5:3b`
- Persona pings: responsive for `aero`, `cian`, `gladio`, `sovereign`, `luna`

## Remediations Completed

1. Restored bridge availability on port `8000`.
2. Fixed hard failure on `src/app/api/family/status/route.ts` by adding resilient fallback mode.
3. Verified local app surface and key APIs with an end-to-end sanity check.

## Known Operational Notes

- Bridge watchdog script currently exhibits unstable duplicate-process behavior in this environment.
- Current stable mode is direct bridge process + health verification.
- If watchdog is re-enabled later, re-verify process ownership and port binding first.

## Recommended Landing Sequence

1. Confirm bridge health on `8000`.
2. Confirm app health on `3000`.
3. Run one persona ping through `/chat`.
4. Begin migration artifact ingest once upstream push lands.
