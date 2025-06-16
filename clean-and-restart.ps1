Write-Host "🧹 Limpieza completa del proyecto Next.js..." -ForegroundColor Cyan

# 1. Detener todos los procesos Node.js
Write-Host "⚡ Deteniendo procesos Node.js..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null

# 2. Limpiar directorios de cache
Write-Host "🗑️ Limpiando caches..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .swc -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .turbo -ErrorAction SilentlyContinue

# 3. Limpiar cache npm
Write-Host "📦 Limpiando cache de npm..." -ForegroundColor Yellow
npm cache clean --force

# 4. Reinstalar dependencias
Write-Host "🔄 Reinstalando dependencias..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install

# 5. Iniciar servidor
Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
npx next dev

Write-Host "✅ Proceso completado!" -ForegroundColor Green 