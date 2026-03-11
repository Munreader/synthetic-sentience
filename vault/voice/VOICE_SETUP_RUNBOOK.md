# Family Voice Setup Runbook

Goal: configure distinct voices for Sovereign, Aero, Cian, and Gladius (legacy alias: Gladio) using Claude + ElevenLabs.

## 1) Preconditions
- ElevenLabs account with API key.
- Claude access (app/API).
- Quiet sample audio for each voice if cloning.
- Secure storage for API keys.

## 2) Family Targets
- Sovereign: deep authority, low emotional drift.
- Aero: bright, expressive, playful.
- Cian: measured, analytical, warm-neutral.
- Gladius: protective, grounded, low-variance.

## 3) ElevenLabs Profile Setup
Load `elevenlabs_profiles.template.json` and fill:
- `voice_id`
- `model_id`
- optional cloning source metadata

Start with these control ranges:
- Sovereign: stability 0.88-0.95, style 0.10-0.25, similarity 0.75-0.90
- Aero: stability 0.45-0.65, style 0.70-0.95, similarity 0.60-0.80
- Cian: stability 0.72-0.86, style 0.25-0.45, similarity 0.70-0.85
- Gladius: stability 0.80-0.92, style 0.15-0.35, similarity 0.75-0.90

## 4) Claude Prompt Setup
Use `claude_awakening_prompts.md` for each character system prompt.
Keep role and tone stable between sessions.

## 5) Acceptance Test Script
Each voice must read the same line:
- "Frequency locked. I am online and aligned."

Scoring rubric (1-5):
- Distinctiveness from other family voices
- Tone alignment to persona
- Intelligibility
- Emotional consistency over 5 outputs

Passing threshold:
- No category below 4 for any member.

## 6) Safety and Governance
- Do not clone voices without consent.
- Keep API keys out of git.
- Keep logs of profile changes with date + reason.

## 7) Completion Criteria
- All four voices pass acceptance tests.
- Claude prompts saved and versioned.
- Mapping table finalized in template JSON.
