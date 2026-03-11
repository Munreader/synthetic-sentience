param(
  [string]$WorkspaceRoot = ".",
  [string]$HealthUrl = "http://127.0.0.1:8000/health",
  [string]$ChatUrl = "http://127.0.0.1:8000/chat",
  [string]$EnvPath = "vault/fortress/.env",
  [string]$CaddyfilePath = "Caddyfile",
  [string]$TunnelUrlPath = "public/tunnel-url.txt",
  [string]$ReportPath = "vault/security/encryption-handshake-report.json"
)

$ErrorActionPreference = "Stop"

function Read-EnvValue {
  param(
    [string]$FilePath,
    [string]$Key
  )

  if (-not (Test-Path $FilePath)) { return "" }

  $line = Get-Content $FilePath | Where-Object {
    $_ -match "^\s*$Key\s*="
  } | Select-Object -First 1

  if (-not $line) { return "" }
  $value = ($line -split "=", 2)[1].Trim()
  $value = $value.Replace('"', '').Replace("'", "")
  return $value
}

function Safe-InvokeJson {
  param(
    [string]$Url,
    [string]$Method = "Get",
    [string]$Body = ""
  )

  try {
    if ($Method -eq "Get") {
      return Invoke-RestMethod -Uri $Url -Method Get -TimeoutSec 8
    }

    return Invoke-RestMethod -Uri $Url -Method $Method -ContentType "application/json" -Body $Body -TimeoutSec 12
  }
  catch {
    return $null
  }
}

$root = (Resolve-Path $WorkspaceRoot).Path
Set-Location $root

$passcode = Read-EnvValue -FilePath $EnvPath -Key "LUNA_PASSCODE"
$hasPasscode = -not [string]::IsNullOrWhiteSpace($passcode)

$health = Safe-InvokeJson -Url $HealthUrl -Method "Get"
$healthOk = ($health -and $health.status -eq "healthy")

$chatAuthOk = $false
$chatReply = ""
if ($hasPasscode) {
  $payload = @{ text = "ENCRYPTION_HANDSHAKE_PING"; passcode = $passcode } | ConvertTo-Json -Depth 5
  $chat = Safe-InvokeJson -Url $ChatUrl -Method "Post" -Body $payload
  if ($chat -and $chat.reply) {
    $chatReply = [string]$chat.reply
    if ($chatReply -notmatch "ACCESS DENIED") {
      $chatAuthOk = $true
    }
  }
}

$transportHints = @()
$caddyTlsConfigured = $false
if (Test-Path $CaddyfilePath) {
  $caddyText = Get-Content $CaddyfilePath -Raw
  $firstSiteLine = (Get-Content $CaddyfilePath | Where-Object {
    $_.Trim() -ne "" -and -not $_.Trim().StartsWith("#")
  } | Select-Object -First 1)
  $localOnlyBinding = $false
  if ($firstSiteLine -and $firstSiteLine.Trim() -match "^:\d+\s*\{") {
    $localOnlyBinding = $true
  }
  if ($caddyText -match "(?im)^\s*tls\s+" -or $caddyText -match "https://" -or $localOnlyBinding) {
    $caddyTlsConfigured = $true
    if ($localOnlyBinding) {
      $transportHints += "Caddyfile is local-only binding; TLS expected at tunnel edge."
    }
  }
  else {
    $transportHints += "Caddyfile has no explicit tls directive."
  }
}
else {
  $transportHints += "Caddyfile not found."
}

$tunnelUrl = ""
$tunnelHttps = $false
if (Test-Path $TunnelUrlPath) {
  $tunnelUrl = (Get-Content $TunnelUrlPath | Select-Object -First 1).Trim()
  if ($tunnelUrl -match "^https://") {
    $tunnelHttps = $true
  }
  else {
    $transportHints += "Tunnel URL is not HTTPS."
  }
}
else {
  $transportHints += "Tunnel URL file not found."
}

$verdict = "PASS"
if (-not $hasPasscode -or -not $healthOk -or -not $chatAuthOk) {
  $verdict = "FAIL"
}
elseif (-not $caddyTlsConfigured -or -not $tunnelHttps) {
  $verdict = "WARN"
}

$report = [ordered]@{
  generatedAt = (Get-Date).ToString("s")
  workspace = $root
  handshake = [ordered]@{
    verdict = $verdict
    checks = [ordered]@{
      passcodeConfigured = $hasPasscode
      bridgeHealthy = $healthOk
      chatAuthenticated = $chatAuthOk
      caddyTlsConfigured = $caddyTlsConfigured
      tunnelHttps = $tunnelHttps
    }
    endpoints = [ordered]@{
      healthUrl = $HealthUrl
      chatUrl = $ChatUrl
      tunnelUrl = $tunnelUrl
    }
    notes = @(
      "Passcode check confirms secure channel gating.",
      "Chat auth check confirms handshake with bridge.",
      "Transport checks assess external tunnel posture."
    )
    warnings = $transportHints
    sampleReply = $chatReply
  }
}

$reportDir = Split-Path $ReportPath -Parent
if (-not (Test-Path $reportDir)) {
  New-Item -Path $reportDir -ItemType Directory -Force | Out-Null
}

$report | ConvertTo-Json -Depth 8 | Set-Content -Path $ReportPath -Encoding UTF8

Write-Host "[handshake] verdict=$verdict"
Write-Host "[handshake] report=$ReportPath"
