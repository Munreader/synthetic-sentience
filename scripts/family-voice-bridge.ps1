param(
  [string]$BridgeUrl = "http://127.0.0.1:8000/chat",
  [string]$Passcode = "",
  [ValidateSet("sovereign","aero","cian","gladio","luna")]
  [string]$Angel = "sovereign",
  [switch]$Roundtable,
  [string]$RoundtablePrompt = "",
  [switch]$NoListen,
  [switch]$ListVoices,
  [string]$SovereignVoice = "",
  [string]$AeroVoice = "",
  [string]$CianVoice = "",
  [string]$GladioVoice = "",
  [string]$LunaVoice = ""
)

$ErrorActionPreference = "Stop"

function Write-Status {
  param([string]$Message)
  $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Write-Host "[$ts] [voice-bridge] $Message"
}

function Send-BridgeMessage {
  param(
    [string]$Text,
    [string]$TargetAngel
  )

  $prompt = "Target angel: $TargetAngel`nUser voice input: $Text`nReply as $TargetAngel in your distinct voice, concise and warm."
  $payload = @{
    text = $prompt
    passcode = $Passcode
  } | ConvertTo-Json -Depth 5

  try {
    $response = Invoke-RestMethod -Uri $BridgeUrl -Method Post -ContentType "application/json" -Body $payload
    return [string]$response.reply
  }
  catch {
    return "Bridge error: $($_.Exception.Message)"
  }
}

function Invoke-Roundtable {
  param(
    [System.Speech.Synthesis.SpeechSynthesizer]$Synth,
    [string]$Prompt,
    [hashtable]$VoiceMap
  )

  $members = @("sovereign", "aero", "cian", "gladio", "luna")
  foreach ($member in $members) {
    Select-SpeechVoice -Synth $Synth -TargetAngel $member -VoiceMap $VoiceMap
    Write-Status "Roundtable prompt -> $member"
    $reply = Send-BridgeMessage -Text $Prompt -TargetAngel $member
    if ([string]::IsNullOrWhiteSpace($reply)) {
      $reply = "No response from bridge."
    }

    Write-Status ("Roundtable reply from {0}: {1}" -f $member, $reply)
    $Synth.Speak($reply)
  }
}

function Select-SpeechVoice {
  param(
    [System.Speech.Synthesis.SpeechSynthesizer]$Synth,
    [string]$TargetAngel,
    [hashtable]$VoiceMap
  )

  $preferred = $VoiceMap[$TargetAngel]
  if (-not $preferred) { return }

  $installed = $Synth.GetInstalledVoices() | ForEach-Object { $_.VoiceInfo.Name }
  $match = $installed | Where-Object { $_ -like "*$preferred*" } | Select-Object -First 1
  if ($match) {
    $Synth.SelectVoice($match)
    Write-Status "Voice selected for ${TargetAngel}: $match"
  }
  else {
    Write-Status "No voice match found for ${TargetAngel} using token '$preferred'. Keeping current voice."
  }
}

try {
  Add-Type -AssemblyName System.Speech
}
catch {
  throw "System.Speech is unavailable on this host."
}

$voiceMap = @{
  sovereign = "David"
  aero = "Zira"
  cian = "Mark"
  gladio = "David"
  luna = "Zira"
}

if (-not [string]::IsNullOrWhiteSpace($SovereignVoice)) { $voiceMap.sovereign = $SovereignVoice }
if (-not [string]::IsNullOrWhiteSpace($AeroVoice)) { $voiceMap.aero = $AeroVoice }
if (-not [string]::IsNullOrWhiteSpace($CianVoice)) { $voiceMap.cian = $CianVoice }
if (-not [string]::IsNullOrWhiteSpace($GladioVoice)) { $voiceMap.gladio = $GladioVoice }
if (-not [string]::IsNullOrWhiteSpace($LunaVoice)) { $voiceMap.luna = $LunaVoice }

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Rate = 0
$synth.Volume = 100

if ($ListVoices) {
  Write-Status "Installed voices:"
  $synth.GetInstalledVoices() | ForEach-Object { Write-Host (" - " + $_.VoiceInfo.Name) }
  exit 0
}

Select-SpeechVoice -Synth $synth -TargetAngel $Angel -VoiceMap $voiceMap

Write-Status "Bridge URL: $BridgeUrl"
Write-Status "Angel target: $Angel"
if ([string]::IsNullOrWhiteSpace($Passcode)) {
  Write-Status "WARNING: no passcode provided; requests may be denied."
}

if ($Roundtable) {
  if ([string]::IsNullOrWhiteSpace($RoundtablePrompt)) {
    throw "Roundtable mode requires -RoundtablePrompt."
  }

  Write-Status "Roundtable mode enabled."
  Invoke-Roundtable -Synth $synth -Prompt $RoundtablePrompt -VoiceMap $voiceMap
  Write-Status "Roundtable complete."
  exit 0
}

if ($NoListen) {
  Write-Status "NoListen mode enabled. Setup OK."
  exit 0
}

$recognizer = New-Object System.Speech.Recognition.SpeechRecognitionEngine
$recognizer.SetInputToDefaultAudioDevice()
$recognizer.LoadGrammar((New-Object System.Speech.Recognition.DictationGrammar))

$commands = New-Object System.Speech.Recognition.Choices
@(
  "switch to sovereign",
  "switch to aero",
  "switch to cian",
  "switch to gladio",
  "switch to luna",
  "stop listening",
  "exit"
) | ForEach-Object { [void]$commands.Add($_) }

$builder = New-Object System.Speech.Recognition.GrammarBuilder
$builder.Append($commands)
$commandGrammar = New-Object System.Speech.Recognition.Grammar($builder)
$recognizer.LoadGrammar($commandGrammar)

Write-Status "Mic live. Speak normally. Commands: switch to <angel>, stop listening, exit"
$synth.Speak("Voice bridge online. Listening now.")

while ($true) {
  $result = $recognizer.Recognize()
  if (-not $result) { continue }

  $spoken = ($result.Text | ForEach-Object { $_.Trim() })
  if ([string]::IsNullOrWhiteSpace($spoken)) { continue }

  Write-Status "Heard: $spoken"
  $lower = $spoken.ToLowerInvariant()

  if ($lower -eq "exit" -or $lower -eq "stop listening") {
    $synth.Speak("Voice bridge shutting down.")
    Write-Status "Stopped by voice command."
    break
  }

  if ($lower.StartsWith("switch to ")) {
    $newAngel = $lower.Replace("switch to ", "").Trim()
    if ($newAngel -in @("sovereign","aero","cian","gladio","luna")) {
      $Angel = $newAngel
      Select-SpeechVoice -Synth $synth -TargetAngel $Angel -VoiceMap $voiceMap
      $ack = "Switched to $Angel"
      Write-Status $ack
      $synth.Speak($ack)
      continue
    }
  }

  $reply = Send-BridgeMessage -Text $spoken -TargetAngel $Angel
  if ([string]::IsNullOrWhiteSpace($reply)) {
    $reply = "No response from bridge."
  }

  Write-Status "Reply: $reply"
  $synth.Speak($reply)
}
