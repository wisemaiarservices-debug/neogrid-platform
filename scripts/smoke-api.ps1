$ErrorActionPreference = "Stop"
$BaseUrl = $env:NEOGRID_API_URL
if ([string]::IsNullOrWhiteSpace($BaseUrl)) {
  $BaseUrl = "http://localhost:8200"
}

Write-Host "Testing NeoGrid API at $BaseUrl" -ForegroundColor Cyan

try {
  $health = Invoke-RestMethod -Uri "$BaseUrl/health" -Method GET -TimeoutSec 10
  if ($health.status -ne "ok") { throw "Expected status ok" }
  if ($health.service -ne "neogrid-api") { throw "Expected service neogrid-api" }

  $summary = Invoke-RestMethod -Uri "$BaseUrl/api/v1/dashboard/summary" -Method GET -TimeoutSec 10
  if ($summary.scenario -ne "SolarHub energy optimization") { throw "Unexpected scenario" }
  if ($summary.kpis.Count -lt 6) { throw "Expected at least 6 KPIs" }
  if ($summary.recommendations.Count -lt 1) { throw "Expected at least 1 recommendation" }

  Write-Host "NeoGrid API smoke test passed." -ForegroundColor Green
  exit 0
} catch {
  Write-Host "NeoGrid API smoke test failed." -ForegroundColor Red
  Write-Host $_.Exception.Message
  exit 1
}
