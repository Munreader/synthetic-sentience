$ErrorActionPreference = "SilentlyContinue"

$repoRoot = Split-Path $PSScriptRoot -Parent
$pidPath = Join-Path $repoRoot "vault\fortress\bridge-watchdog.pid"

$watchdogPid = $null
$watchdogRunning = $false

if (Test-Path $pidPath) {
  $watchdogPid = Get-Content $pidPath | Select-Object -First 1
  if ($watchdogPid) {
    $proc = Get-Process -Id $watchdogPid -ErrorAction SilentlyContinue
    $watchdogRunning = [bool]$proc
  }
}

$bridgeProcesses = Get-CimInstance Win32_Process | Where-Object {
  $_.Name -match '^python(\.exe)?$' -and
  $_.CommandLine -match '(?i)\bbridge\.py\b'
}
$bridgeRunning = [bool]$bridgeProcesses
$bridgePids = @($bridgeProcesses | Select-Object -ExpandProperty ProcessId)

$health = $null
try {
  $health = Invoke-RestMethod -Uri "http://127.0.0.1:8000/health" -Method Get -TimeoutSec 3
} catch {}

[pscustomobject]@{
  watchdogPid = $watchdogPid
  watchdogRunning = $watchdogRunning
  bridgeRunning = $bridgeRunning
  bridgePids = $bridgePids
  bridgeHealthy = ($health -and $health.status -eq "healthy")
} | ConvertTo-Json -Depth 4
