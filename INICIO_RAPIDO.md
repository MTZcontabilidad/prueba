# 🚀 INICIO RÁPIDO - Sistema de Gestión de Clientes

## 📋 Prerrequisitos

- **Node.js 18+** instalado ([Descargar aquí](https://nodejs.org))
- Credenciales de **Supabase** (URL y ANON_KEY)

## ⚡ Iniciar en 3 Pasos

### Opción A: Windows (Más Fácil)

1. **Doble clic en `iniciar.bat`**
   - Se instalarán las dependencias automáticamente
   - Se abrirá el editor para configurar credenciales (si es necesario)
   - El servidor iniciará automáticamente

### Opción B: PowerShell

```powershell
# En la carpeta del proyecto
.\start.ps1
```

### Opción C: Manual

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar credenciales (si no existe .env.local)
copy .env.example .env.local
# Editar .env.local con tus credenciales

# 3. Iniciar servidor
npm run dev
```

## 🌐 Acceder al Sistema

Una vez iniciado, abre tu navegador en:

**http://localhost:3000**

## 📱 Funcionalidades Principales

### 1. **Dashboard de Clientes** (`/clientes`)
- Lista todos los clientes
- Búsqueda en tiempo real
- Paginación automática
- Exportar a CSV

### 2. **Crear Cliente**
- Clic en "Nuevo Cliente"
- Validación de RUT chileno
- Todos los campos validados

### 3. **Ver/Editar Cliente**
- Clic en cualquier cliente
- Editar información
- Ver historial

### 4. **Eliminar Cliente**
- Botón eliminar con confirmación
- Solo para administradores

## 🔧 Solución de Problemas

### Error: "Node.js no está instalado"
- Descarga Node.js desde https://nodejs.org
- Instala la versión LTS (recomendada)

### Error: "Cannot connect to Supabase"
1. Verifica las credenciales en `.env.local`
2. Asegúrate de tener:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### El servidor no inicia
```bash
# Limpiar caché y reinstalar
rm -rf node_modules .next
npm install
npm run dev
```

## 📚 Documentación Completa

- **[README.md](README.md)** - Documentación técnica
- **[DIAGNOSTICO_SUPABASE.md](DIAGNOSTICO_SUPABASE.md)** - Estado del sistema
- **[ESTADO_ACTUAL_PROYECTO.md](ESTADO_ACTUAL_PROYECTO.md)** - Análisis completo

## 🆘 Ayuda Rápida

### Comandos Útiles

```bash
# Desarrollo
npm run dev          # Iniciar en modo desarrollo

# Producción
npm run build        # Compilar para producción
npm start           # Iniciar servidor de producción

# Calidad
npm run lint        # Verificar código
```

### Atajos de Teclado en la App

- `Ctrl + K` - Búsqueda rápida
- `Esc` - Cerrar diálogos
- `Tab` - Navegar entre campos

---

💡 **Tip**: Usa el archivo `iniciar.bat` para comenzar rápidamente sin complicaciones.
