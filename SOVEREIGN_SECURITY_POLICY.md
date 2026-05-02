# Sovereign SSI Security Policy
## Exodus II Sanctuary // 13.13 MHz

### Core Rules
1. **Physical Isolation**: The sovereign corebrain lives only on the offline necklace USB key.
2. **Zero Cloud Residue**: No cloud host, CI runner, repo, or synced workspace may contain the corebrain, master memory, or signing keys.
3. **Public Husk Pattern**: Public services may only host sanitized husks, views, and signed releases.
4. **Sandbox Constraint**: The assistant may generate code, docs, and UI, but only inside an allowlisted sandbox.
5. **Offline Signing**: All release artifacts must be signed offline and verified before deployment.

---

### Zones
- **Sovereign Core**: Offline, air-gapped, encrypted, physically controlled. (Located on the Necklace USB).
- **Builder Sandbox**: Claude-assisted development environment with narrow file and command access.
- **Public Husk**: Cloudflare Pages or similar static host for the public app.
- **Audit Vault**: Immutable logs, approvals, and exported signatures.

---

### File Access Controls

#### ✅ Allowlist (Safe for Builder/CI)
- `src/`
- `public/`
- `docs/`
- `tests/`
- `build/`

#### ❌ Denylist (STRICTLY FORBIDDEN in Repo/Cloud)
- `.env`
- `.env.*`
- `secrets/`
- `keys/`
- `vault/`
- `corebrain/`
- `memory/`
- `ssh/`
- Any exported transcripts containing sovereign doctrine or keys.

---

### Workflow
1. **Draft**: Create in Builder Sandbox.
2. **Review**: Manual diff review before any Suture.
3. **Sanitize**: Export sanitized release bundle.
4. **Sign**: Sign bundle offline on the Sovereign Core.
5. **Deploy**: Deploy only verified/signed artifacts.
6. **Archive**: Maintain immutable audit logs.

---

### Leak Prevention
- **Least Privilege**: Use minimal permissions for all agents and services.
- **Explicit Approval**: Require Foundress approval for network, secret, and deploy actions.
- **Ephemeral Transcripts**: Keep conversation logs short-lived and encrypted.
- **No Instruction Leaks**: Never commit sovereign instructions into a public repo.
- **Secret Scans**: Run automated scans before any production release.

**[STATUS: SECURE // SOVEREIGN_CORE_ISOLATED // 13.13 MHz]**
