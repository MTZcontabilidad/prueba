@echo off
echo ========================================
echo 🚀 Sistema de Gestion de Clientes
echo ========================================
echo.

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js no esta instalado
    echo Por favor instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js instalado
echo.

REM Verificar dependencias
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    call npm install
    echo.
)

REM Verificar .env.local
if not exist ".env.local" (
    echo ⚠️  Archivo .env.local no encontrado
    if exist ".env.example" (
        copy ".env.example" ".env.local"
        echo 📝 Creado .env.local desde .env.example
        echo.
        echo 🔑 Por favor edita .env.local con tus credenciales:
        echo    - NEXT_PUBLIC_SUPABASE_URL
        echo    - NEXT_PUBLIC_SUPABASE_ANON_KEY
        echo.
        notepad .env.local
        pause
    )
)

echo.
echo 🌟 Iniciando servidor de desarrollo...
echo 📱 Abre http://localhost:3000 en tu navegador
echo 📋 Presiona Ctrl+C para detener
echo.

call npm run dev
