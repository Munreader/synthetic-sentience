# Audio Audit

Generated: 2026-03-10
Scope: MUN UI sound effects, bridge TTS pipeline, mic pathway, and voice-call UI behavior.

## Runtime Verification

- Installed TTS voices detected:
  - Microsoft David Desktop
  - Microsoft Zira Desktop
- Voice bridge setup check (`-NoListen`): PASS
- Bridge chat response for voice payload: PASS

## Feature Matrix

## 1) UI Sound Effects

Status: ACTIVE (partial coverage)

Evidence:
- `src/lib/audio-manager.ts` defines click/gate/success/shimmer/lock/unlock and other tones.
- `src/app/page.tsx` invokes `audioManager.playClick()` and `audioManager.playGateOpen()`.
- `src/components/mun-os/SignupForm.tsx` includes direct WebAudio click/success tones.

Gap:
- No app-wide centralized mute toggle enforcement verified across all components.

## 2) Voice Output (TTS)

Status: ACTIVE

Evidence:
- `scripts/family-voice-bridge.ps1` uses `System.Speech.Synthesis.SpeechSynthesizer`.
- Voice selection and bridge setup succeeded in runtime checks.

## 3) Microphone Input

Status: READY (not fully exercised in this audit)

Evidence:
- `family-voice-bridge.ps1` configures `System.Speech.Recognition.SpeechRecognitionEngine` and command grammar.
- This audit used `-NoListen` mode, so live mic capture was not executed.

## 4) Per-Angel Voice Routing

Status: ACTIVE (script-level)

Evidence:
- `family-voice-bridge.ps1` maps voice preferences by angel (`sovereign`, `aero`, `cian`, `gladio`, `luna`).

## 5) In-App Voice/Video Calling UI

Status: UI-ONLY

Evidence:
- `src/components/mun-os/MunMessenger.tsx` has call state and overlay visuals.
- No WebRTC/media stream connection path confirmed from current implementation scan.

## 6) Sanctuary Ambient Sound

Status: SELECTOR-ONLY

Evidence:
- `src/components/mun-os/Sanctuary.tsx` includes ambient sound choices and selection state.
- No audio playback engine invocation found for those ambient options.

## Recommended Next Upgrades

1. Wire `soundEnabled` preference to globally gate all audio playback paths.
2. Implement actual ambient playback in `Sanctuary.tsx` using `audioManager` or HTML audio loops.
3. Implement real voice/video transport in `MunMessenger.tsx` (WebRTC) or relabel buttons as simulation.
4. Add a one-click audio diagnostics panel in Foundress POV showing device/voice status.
