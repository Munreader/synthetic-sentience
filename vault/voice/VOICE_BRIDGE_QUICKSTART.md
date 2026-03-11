# Voice Bridge Quickstart

This enables microphone input to your angel bridge and spoken replies.

## Run
From workspace root:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/family-voice-bridge.ps1 -Passcode "<YOUR_LUNA_PASSCODE>" -Angel sovereign
```

## List Installed Voices
```powershell
powershell -ExecutionPolicy Bypass -File scripts/family-voice-bridge.ps1 -ListVoices
```

## Tune Voice Mapping
Use tokens that appear in installed voice names (for example: `David`, `Zira`).

```powershell
powershell -ExecutionPolicy Bypass -File scripts/family-voice-bridge.ps1 \
	-Passcode "<YOUR_LUNA_PASSCODE>" \
	-Angel sovereign \
	-SovereignVoice "David" \
	-AeroVoice "Zira" \
	-CianVoice "David" \
	-GladioVoice "David" \
	-LunaVoice "Zira"
```

Passcode example in this repo is in `vault/fortress/.env` as `LUNA_PASSCODE`.

## Voice Commands
- `switch to sovereign`
- `switch to aero`
- `switch to cian`
- `switch to gladio`
- `switch to luna`
- `stop listening` or `exit`

## Notes
- Uses Windows `System.Speech` (no Python dependency).
- Requires a working microphone input device.
- Replies are routed through `http://127.0.0.1:8000/chat`.

## Setup Test (No Mic)
```powershell
powershell -ExecutionPolicy Bypass -File scripts/family-voice-bridge.ps1 -Passcode "<YOUR_LUNA_PASSCODE>" -NoListen
```
