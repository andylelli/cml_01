$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$nodeExe = Get-ChildItem -Path (Join-Path $repoRoot '..\.tools\node') -Recurse -Filter node.exe | Select-Object -First 1 -ExpandProperty FullName
if (-not $nodeExe) { throw 'Portable Node.js not found under .tools/node' }
$nodeDir = Split-Path $nodeExe -Parent
$gitExe = Join-Path (Join-Path $repoRoot '..\.tools\git\cmd') 'git.exe'
if (-not (Test-Path $gitExe)) { throw 'Portable Git not found under .tools/git/cmd' }
$gitDir = Split-Path $gitExe -Parent
$env:Path = "$nodeDir;$gitDir;$env:Path"
Set-Location $repoRoot
Write-Host "Dev shell ready in $repoRoot"
Write-Host "node: $(& node -v)"
Write-Host "npm : $(& npm -v)"
Write-Host "git : $(& git --version)"
Write-Host "Tip: run npm run -w @cml/api dev, npm run -w @cml/worker dev, npm run -w @cml/web dev"
