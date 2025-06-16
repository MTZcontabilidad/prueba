@echo off
echo.
echo ========================================
echo   Limpiador de Imports No Utilizados
echo ========================================
echo.

cd /d "%~dp0\.."

echo Ejecutando el limpiador de imports...
echo.

node scripts\clean-unused-imports.js

echo.
echo ========================================
echo   Proceso completado
echo ========================================
echo.

pause
