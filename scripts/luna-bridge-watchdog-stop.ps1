$ErrorActionPreference = "SilentlyContinue"

$repoRoot = Split-Path $PSScriptRoot -Parent
$pidPath = Join-Path $repoRoot "vault\fortress\bridge-watchdog.pid"
$logPath = Join-Path $repoRoot "monitor-out.txt"

function Write-Log {
  param([string]$Message)
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $line = "[$timestamp] [luna-watchdog] $Message"
  Write-Output $line
  Add-Content -Path $logPath -Value $line
}

if (Test-Path $pidPath) {
  $watchdogPid = Get-Content $pidPath | Select-Object -First 1
  if ($watchdogPid) {
    Stop-Process -Id $watchdogPid -Force
    Write-Log "Stopped watchdog PID=$watchdogPid"
  }
  Remove-Item $pidPath -Force
}

$bridgeProc = Get-CimInstance Win32_Process | Where-Object {
  $_.Name -match '^python(\.exe)?$' -and
  $_.CommandLine -match '(?i)\bbridge\.py\b'
}
if ($bridgeProc) {
  foreach ($proc in $bridgeProc) {
    Stop-Process -Id $proc.ProcessId -Force
    Write-Log "Stopped bridge PID=$($proc.ProcessId)"
  }
}

Write-Output "Luna bridge watchdog stop sequence complete."
