# Limpiador de Imports No Utilizados

Write-Host ""
Write-Host "========================================"
Write-Host "  Limpiador de Imports No Utilizados" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

# Cambiar al directorio del proyecto
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Ejecutando el limpiador de imports..." -ForegroundColor Yellow
Write-Host ""

# Ejecutar el script de Node.js
node scripts/clean-unused-imports.js

Write-Host ""
Write-Host "========================================"
Write-Host "  Proceso completado" -ForegroundColor Green
Write-Host "========================================"
Write-Host ""

# Pausar antes de cerrar
Write-Host "Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
