# Prueft index.html: Links als Multimenge, Pflicht- und Verbotsstrings.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$html = Get-Content -Raw -Encoding UTF8 (Join-Path $root 'index.html')
$soll = @(Get-Content -Encoding UTF8 (Join-Path $PSScriptRoot 'ausgabe-4-links.txt') | Where-Object { $_ -ne '' })
$fehler = @()

$ist = @([regex]::Matches($html, 'href="(http[^"]*)"') | ForEach-Object { $_.Groups[1].Value } |
    Where-Object { $_ -notmatch 'fonts\.googleapis\.com|fonts\.gstatic\.com' })

$sollGruppen = @{}; $soll | ForEach-Object { $sollGruppen[$_] = 1 + [int]$sollGruppen[$_] }
$istGruppen = @{}; $ist | ForEach-Object { $istGruppen[$_] = 1 + [int]$istGruppen[$_] }
foreach ($k in ($sollGruppen.Keys + $istGruppen.Keys | Sort-Object -Unique)) {
    $s = [int]$sollGruppen[$k]; $i = [int]$istGruppen[$k]
    if ($s -ne $i) { $fehler += "Link '$k': erwartet $s mal, gefunden $i mal" }
}

foreach ($m in @('Keine Anlageberatung', 'CoinGecko', '06:45', 'id="ki"', 'id="games"', 'id="krypto"', 'id="termine"')) {
    if (-not $html.Contains($m)) { $fehler += "Fehlt: $m" }
}
foreach ($m in @('data-design', 'daily-news-design', '<script', 'UnifrakturCook')) {
    if ($html.Contains($m)) { $fehler += "Darf nicht vorkommen: $m" }
}

if ($fehler.Count -gt 0) {
    Write-Host "FEHLGESCHLAGEN ($($fehler.Count) Pruefungen):"
    $fehler | ForEach-Object { Write-Host " - $_" }
    exit 1
}
Write-Host "OK: $($ist.Count) Links, Pflichtstrings vorhanden, keine verbotenen Strings."
exit 0
