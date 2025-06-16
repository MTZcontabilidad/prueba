# Script de inicio para Windows
Write-Host "🚀 Iniciando Sistema de Gestión de Clientes" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Verificar si Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado. Por favor instala Node.js 18+" -ForegroundColor Red
    exit 1
}

# Verificar si las dependencias están instaladas
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Verificar archivo .env.local
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  No se encontró .env.local" -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Host "📝 Creado .env.local desde .env.example" -ForegroundColor Yellow
        Write-Host "🔑 Por favor edita .env.local con tus credenciales de Supabase" -ForegroundColor Yellow
        notepad .env.local
        Read-Host "Presiona Enter cuando hayas actualizado las credenciales"
    }
}

Write-Host "`n🌟 Iniciando servidor de desarrollo..." -ForegroundColor Green
Write-Host "📱 El proyecto estará disponible en: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📋 Presiona Ctrl+C para detener el servidor`n" -ForegroundColor Gray

# Iniciar el servidor
npm run dev
