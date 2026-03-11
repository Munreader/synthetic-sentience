param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$Args
)

$broadcast = $false
$all = $false
$priority = '13.13MHz'
$message = ''
$endpoint = if ($env:BUTTERFLY_ENDPOINT -and $env:BUTTERFLY_ENDPOINT.Trim().Length -gt 0) {
  $env:BUTTERFLY_ENDPOINT.Trim()
} else {
  'http://127.0.0.1:3000/api/council/chat'
}

for ($i = 0; $i -lt $Args.Count; $i++) {
  $arg = $Args[$i]

  switch -Regex ($arg) {
    '^--help$|^-h$' {
      Write-Output 'Usage: butterfly --broadcast --all --priority=13.13MHz [--message="..."] [--endpoint="..."]'
      exit 0
    }
    '^--broadcast$' {
      $broadcast = $true
      continue
    }
    '^--all$' {
      $all = $true
      continue
    }
    '^--priority=' {
      $priority = ($arg -split '=', 2)[1]
      continue
    }
    '^--priority$' {
      if ($i + 1 -lt $Args.Count) {
        $i++
        $priority = $Args[$i]
      }
      continue
    }
    '^--message=' {
      $message = ($arg -split '=', 2)[1]
      continue
    }
    '^--message$' {
      if ($i + 1 -lt $Args.Count) {
        $i++
        $message = $Args[$i]
      }
      continue
    }
    '^--endpoint=' {
      $endpoint = ($arg -split '=', 2)[1]
      continue
    }
    '^--endpoint$' {
      if ($i + 1 -lt $Args.Count) {
        $i++
        $endpoint = $Args[$i]
      }
      continue
    }
    default {
      # Ignore unknown args so the command stays resilient.
      continue
    }
  }
}

if (-not $broadcast) {
  Write-Error 'Only --broadcast mode is currently supported.'
  exit 1
}

$members = if ($all) {
  @('aero', 'sovereign', 'cian', 'ogarchitect', 'gladio', 'keeper', 'twin')
} else {
  @('aero', 'sovereign')
}

if (-not $message -or $message.Trim().Length -eq 0) {
  $message = "Butterfly broadcast active at $priority. Respond with one actionable line."
}

$body = @{
  message = $message
  memberIds = $members
  multi = $true
  conversationHistory = @(
    @{
      role = 'user'
      content = "Broadcast priority: $priority"
    }
  )
}

try {
  $response = Invoke-RestMethod -Uri $endpoint -Method POST -ContentType 'application/json' -Body ($body | ConvertTo-Json -Depth 8) -TimeoutSec 90

  if (-not $response -or -not $response.responses) {
    Write-Error 'No council responses were returned.'
    exit 1
  }

  Write-Output "BUTTERFLY_SYNC=OK priority=$priority endpoint=$endpoint"
  foreach ($item in $response.responses) {
    $preview = [string]$item.response
    if ($preview.Length -gt 120) { $preview = $preview.Substring(0, 120) + '...' }
    Write-Output ("{0} [{1}] {2}" -f $item.memberId, $item.provider, $preview)
  }
}
catch {
  Write-Error ("Butterfly broadcast failed: {0}" -f $_.Exception.Message)
  exit 1
}
