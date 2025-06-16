#!/bin/bash

echo "🚀 Script de instalación y configuración del Sistema de Gestión de Clientes"
echo "=========================================================================="

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ primero."
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar si npm está instalado
if ! command -v npm &> /dev/null
then
    echo "❌ npm no está instalado. Por favor instala npm primero."
    exit 1
fi

echo "✅ npm encontrado: $(npm --version)"

# Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."
npm install

# Verificar si el archivo .env.local existe
if [ ! -f .env.local ]; then
    echo ""
    echo "⚠️  No se encontró el archivo .env.local"
    echo "📝 Creando .env.local desde .env.example..."
    cp .env.example .env.local
    echo ""
    echo "🔑 Por favor edita el archivo .env.local con tus credenciales de Supabase:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo ""
    echo "Puedes obtener estas credenciales en:"
    echo "https://app.supabase.com/project/_/settings/api"
    echo ""
    read -p "Presiona Enter cuando hayas actualizado las credenciales..."
fi

# Mostrar las instrucciones finales
echo ""
echo "✅ Instalación completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Asegúrate de que las credenciales en .env.local sean correctas"
echo "2. Ejecuta 'npm run dev' para iniciar el servidor de desarrollo"
echo "3. Abre http://localhost:3000 en tu navegador"
echo ""
echo "📚 Documentación adicional:"
echo "- README.md: Guía completa del proyecto"
echo "- DIAGNOSTICO_SUPABASE.md: Estado actual y detalles técnicos"
echo ""
echo "¡Disfruta usando el Sistema de Gestión de Clientes! 🎉"
