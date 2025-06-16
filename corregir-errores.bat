@echo off
echo.
echo ==========================================
echo   Corrector de Errores de ESLint y Build
echo ==========================================
echo.

cd /d "%~dp0"

echo [1/2] Corrigiendo errores de ESLint...
echo.
node scripts\fix-eslint-errors.js

echo.
echo [2/2] Limpiando imports no utilizados...
echo.
node scripts\clean-unused-imports.js

echo.
echo ==========================================
echo   ¡Proceso completado!
echo ==========================================
echo.
echo Próximos pasos:
echo 1. Ejecuta: npm run lint (para verificar)
echo 2. Ejecuta: npm run build (para compilar)
echo.

pause
