param(
    [switch]$Build
)

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoRoot

$go = @(
    "$env:GOROOT\bin\go.exe",
    "C:\Program Files\Go\bin\go.exe",
    "C:\Go\bin\go.exe"
) | Where-Object { $_ -and (Test-Path $_) } | Select-Object -First 1

if (-not $go) {
    throw "Could not find go.exe. Install Go or add it to PATH."
}

Write-Host "Using Go from: $go"

if ($Build) {
    New-Item -ItemType Directory -Force -Path (Join-Path $repoRoot 'bin') | Out-Null
    & $go build -o (Join-Path $repoRoot 'bin\server.exe') ./cmd
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
    Write-Host "Build complete: bin\server.exe"
    exit 0
}

& $go run ./cmd/main.go
exit $LASTEXITCODE
