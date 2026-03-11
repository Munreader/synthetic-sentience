param(
  [Parameter(Mandatory=$true)]
  [string]$BaseUrl
)

$ErrorActionPreference = 'Stop'

function Test-Endpoint {
  param(
    [string]$Name,
    [string]$Url,
    [int[]]$AcceptStatus = @(200),
    [string]$Method = 'GET'
  )

  try {
    $resp = Invoke-WebRequest -Uri $Url -Method $Method -UseBasicParsing -TimeoutSec 25
    $status = [int]$resp.StatusCode
    $ok = $AcceptStatus -contains $status

    $bodyPreview = ''
    if ($resp.Content) {
      $bodyPreview = $resp.Content
      if ($bodyPreview.Length -gt 180) {
        $bodyPreview = $bodyPreview.Substring(0, 180) + '...'
      }
      $bodyPreview = $bodyPreview -replace "`r|`n", ' '
    }

    [pscustomobject]@{
      Check = $Name
      Url = $Url
      Status = $status
      Ok = $ok
      Details = if ($ok) { 'OK' } else { "Unexpected status ($status)" }
      Preview = $bodyPreview
    }
  }
  catch {
    $status = -1
    if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
      $status = [int]$_.Exception.Response.StatusCode
    }

    [pscustomobject]@{
      Check = $Name
      Url = $Url
      Status = $status
      Ok = $false
      Details = $_.Exception.Message
      Preview = ''
    }
  }
}

$base = $BaseUrl.TrimEnd('/')
$checks = @(
  @{ Name = 'Home'; Url = "$base/"; Accept = @(200) },
  @{ Name = 'Family memories API'; Url = "$base/api/family/memories"; Accept = @(200,401,403) },
  @{ Name = 'Luna policy charter API'; Url = "$base/api/luna?action=policy-charter"; Accept = @(200) }
)

$results = @()
foreach ($check in $checks) {
  $results += Test-Endpoint -Name $check.Name -Url $check.Url -AcceptStatus $check.Accept
}

Write-Host "`n=== MUN OS Production Sanity Check ===" -ForegroundColor Cyan
$results | Format-Table Check, Status, Ok, Details -AutoSize

$failures = @($results | Where-Object { -not $_.Ok })
if ($failures.Count -gt 0) {
  Write-Host "`nFAILED checks:" -ForegroundColor Red
  $failures | ForEach-Object {
    Write-Host "- $($_.Check): $($_.Details)" -ForegroundColor Red
  }
  exit 1
}

Write-Host "`nAll sanity checks passed." -ForegroundColor Green
exit 0
