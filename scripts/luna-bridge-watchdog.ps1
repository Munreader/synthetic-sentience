param(
  [int]$CheckIntervalSeconds = 10,
  [int]$RestartDelaySeconds = 2,
  [int]$StartupGraceSeconds = 20,
  [int]$HealthFailureThreshold = 3,
  [string]$BridgeHealthUrl = "http://127.0.0.1:8000/health"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path $PSScriptRoot -Parent
$fortressDir = Join-Path $repoRoot "vault\fortress"
$pythonExe = Join-Path $repoRoot ".venv\Scripts\python.exe"
$logPath = Join-Path $repoRoot "monitor-out.txt"
$bridgeStdOutLogPath = Join-Path $repoRoot "vault\fortress\bridge-out.log"
$bridgeStdErrLogPath = Join-Path $repoRoot "vault\fortress\bridge-err.log"
$pidPath = Join-Path $repoRoot "vault\fortress\bridge-watchdog.pid"

if (-not (Test-Path $fortressDir)) {
  throw "Fortress directory not found: $fortressDir"
}

if (-not (Test-Path $pythonExe)) {
  $pythonExe = "python"
}

function Write-Log {
  param([string]$Message)
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $line = "[$timestamp] [luna-watchdog] $Message"
  Write-Output $line
  Add-Content -Path $logPath -Value $line
}

function Get-BridgeProcessInfos {
  return Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
    Where-Object {
      $_.Name -match '^python(\.exe)?$' -and
      $_.CommandLine -match '(?i)\bbridge\.py\b'
    }
}

function Stop-ManagedBridgeProcesses {
  param([int]$KeepPid)

  foreach ($procPid in @($script:ManagedBridgePids)) {
    if ($procPid -eq $KeepPid) { continue }
    $proc = Get-Process -Id $procPid -ErrorAction SilentlyContinue
    if (-not $proc) {
      $script:ManagedBridgePids = @($script:ManagedBridgePids | Where-Object { $_ -ne $procPid })
      continue
    }
    try {
      Stop-Process -Id $procPid -Force -ErrorAction SilentlyContinue
      Write-Log "Stopped managed bridge process (PID=$procPid)"
    } catch {}
    $script:ManagedBridgePids = @($script:ManagedBridgePids | Where-Object { $_ -ne $procPid })
  }
}

function Start-BridgeProcess {
  Write-Log "Starting bridge with $pythonExe"
  $proc = Start-Process -FilePath $pythonExe -ArgumentList "-u", "bridge.py" -WorkingDirectory $fortressDir -PassThru -WindowStyle Hidden -RedirectStandardOutput $bridgeStdOutLogPath -RedirectStandardError $bridgeStdErrLogPath
  $script:ManagedBridgePids = @($script:ManagedBridgePids + $proc.Id | Select-Object -Unique)
  Write-Log "Bridge process started (PID=$($proc.Id))"
  return $proc
}

function Test-BridgeHealth {
  try {
    $response = Invoke-RestMethod -Uri $BridgeHealthUrl -Method Get -TimeoutSec 5
    return ($response.status -eq "healthy")
  } catch {
    return $false
  }
}

function Ensure-SingleWatchdog {
  if (Test-Path $pidPath) {
    $existingPid = Get-Content $pidPath -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($existingPid) {
      $proc = Get-Process -Id $existingPid -ErrorAction SilentlyContinue
      if ($proc) {
        throw "Watchdog already running with PID $existingPid"
      }
    }
  }
  Set-Content -Path $pidPath -Value $PID
}

function Cleanup {
  if (Test-Path $pidPath) {
    Remove-Item $pidPath -Force -ErrorAction SilentlyContinue
  }
}

Ensure-SingleWatchdog
Write-Log "Watchdog online (PID=$PID). Interval=${CheckIntervalSeconds}s"

$bridgeProc = $null
$script:ManagedBridgePids = @()

$healthyWithoutBridgeLogged = $false
$lastStartAt = Get-Date
$consecutiveHealthFailures = 0

try {
  while ($true) {
    $needsRestart = $false
    $healthOk = Test-BridgeHealth
    if ($healthOk) {
      $healthyWithoutBridgeLogged = $false
      $trackedHandle = $null
      if ($bridgeProc) {
        $trackedHandle = Get-Process -Id $bridgeProc.Id -ErrorAction SilentlyContinue
      }

      if ($trackedHandle) {
        Stop-ManagedBridgeProcesses -KeepPid $trackedHandle.Id
      } elseif (-not $healthyWithoutBridgeLogged) {
        Write-Log "Health endpoint is up with an external owner; watchdog will not adopt foreign process."
        $healthyWithoutBridgeLogged = $true
      }
      $consecutiveHealthFailures = 0
      Start-Sleep -Seconds $CheckIntervalSeconds
      continue
    }

    $healthyWithoutBridgeLogged = $false
    $trackedHandle = $null
    if ($bridgeProc) {
      $trackedHandle = Get-Process -Id $bridgeProc.Id -ErrorAction SilentlyContinue
    }

    if (-not $trackedHandle) {
      if ($bridgeProc -and $bridgeProc.HasExited) {
        Write-Log "Tracked bridge process exited (PID=$($bridgeProc.Id), ExitCode=$($bridgeProc.ExitCode))"
      }
      Write-Log "Bridge process missing or exited"
      $consecutiveHealthFailures = 0
      $needsRestart = $true
    } else {
      $secondsSinceStart = [int]((Get-Date) - $lastStartAt).TotalSeconds
      if ($secondsSinceStart -lt $StartupGraceSeconds) {
        Write-Log "Bridge warming up (${secondsSinceStart}s/${StartupGraceSeconds}s); skipping health enforcement"
        Start-Sleep -Seconds $CheckIntervalSeconds
        continue
      }

      $consecutiveHealthFailures += 1
      if ($consecutiveHealthFailures -lt $HealthFailureThreshold) {
        Write-Log "Health check failed ($consecutiveHealthFailures/$HealthFailureThreshold); waiting before restart"
        Start-Sleep -Seconds $CheckIntervalSeconds
        continue
      }

      Write-Log "Health check failed ($consecutiveHealthFailures/$HealthFailureThreshold); restarting bridge"
      try {
        Stop-Process -Id $trackedHandle.Id -Force -ErrorAction SilentlyContinue
        Write-Log "Stopped unhealthy bridge process (PID=$($trackedHandle.Id))"
      } catch {}
      $script:ManagedBridgePids = @($script:ManagedBridgePids | Where-Object { $_ -ne $trackedHandle.Id })
      $bridgeProc = $null
      $consecutiveHealthFailures = 0
      $needsRestart = $true
    }

    if ($needsRestart) {
      Stop-ManagedBridgeProcesses -KeepPid -1
      $existingBridge = Get-BridgeProcessInfos | Select-Object -First 1
      if ($existingBridge) {
        $existingHandle = Get-Process -Id $existingBridge.ProcessId -ErrorAction SilentlyContinue
        if ($existingHandle) {
          Write-Log "Detected existing bridge process before restart (PID=$($existingHandle.Id)); skipping duplicate start"
          $bridgeProc = $null
          Start-Sleep -Seconds $CheckIntervalSeconds
          continue
        }
      }
      Start-Sleep -Seconds $RestartDelaySeconds
      $bridgeProc = Start-BridgeProcess
      $lastStartAt = Get-Date
      Start-Sleep -Seconds 2
      if (Test-BridgeHealth) {
        $consecutiveHealthFailures = 0
        Write-Log "Bridge health restored"
      } else {
        Write-Log "Bridge still unhealthy after restart attempt"
      }
    }

    Start-Sleep -Seconds $CheckIntervalSeconds
  }
}
finally {
  Write-Log "Watchdog shutting down"
  Cleanup
}
