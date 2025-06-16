# 🚀 Sistema de Gestión de Clientes - Next.js + Supabase

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

## 📋 Descripción

Sistema completo de gestión de clientes construido con las últimas tecnologías web. Diseñado para empresas chilenas, incluye validación de RUT, manejo de datos empresariales y funcionalidades avanzadas de administración.

## ✨ Características Principales

### 🔐 **Autenticación y Seguridad**
- ✅ Autenticación completa con Supabase Auth
- ✅ Políticas RLS (Row Level Security) implementadas
- ✅ Middleware de protección de rutas
- ✅ Roles de usuario (admin/usuario)

### 📊 **Gestión de Clientes (CRUD Completo)**
- ✅ **Crear**: Formulario con validación completa
- ✅ **Leer**: Listado con paginación y búsqueda
- ✅ **Actualizar**: Edición inline y por formulario
- ✅ **Eliminar**: Con confirmación y permisos

### 🎯 **Funcionalidades Avanzadas**
- ✅ **Dashboard con Métricas**: Estadísticas en tiempo real
- ✅ **Sistema de Reportes**: Generación de informes personalizados
- ✅ **Importación Excel/CSV**: Carga masiva de clientes
- ✅ **Exportación de Datos**: CSV, Excel y PDF
- ✅ **Búsqueda Avanzada**: Filtros múltiples
- ✅ **Vista Dual**: Tarjetas y tabla
- ✅ **Modo Oscuro/Claro**: Tema adaptable

### 🏆 **Validaciones Robustas**
- ✅ Validación de RUT chileno (módulo 11)
- ✅ Formato de teléfono chileno (+56)
- ✅ Validación de email RFC 5322
- ✅ Campos requeridos y opcionales
- ✅ Mensajes de error personalizados

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15 (App Router)
- **Base de Datos**: Supabase (PostgreSQL)
- **Estilos**: Tailwind CSS + shadcn/ui
- **Validación**: Zod + React Hook Form
- **Estado**: Custom Hooks
- **Notificaciones**: React Hot Toast
- **Iconos**: Lucide React

## 📁 Estructura del Proyecto

```
├── app/
│   ├── auth/              # Páginas de autenticación
│   ├── clientes/          # CRUD de clientes
│   │   ├── page.tsx       # Listado principal
│   │   ├── [id]/          # Detalle/edición
│   │   └── importar/      # Importación masiva
│   ├── dashboard/         # Dashboard con métricas
│   └── reportes/          # Generador de reportes
├── components/
│   ├── clientes/          # Componentes específicos
│   ├── ui/                # Componentes base (shadcn)
│   └── providers/         # Context providers
├── lib/
│   ├── services/          # Lógica de negocio
│   ├── schemas/           # Validaciones Zod
│   ├── hooks/             # Custom hooks
│   └── supabase/          # Cliente y tipos
└── public/                # Archivos estáticos
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ instalado
- Cuenta en [Supabase](https://supabase.com)

### Instalación

1. **Clonar el repositorio**
```bash
git clone [tu-repositorio]
cd prueba
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

4. **Iniciar el servidor de desarrollo**

**Opción A - Windows (Más fácil):**
```bash
# Doble clic en:
iniciar.bat
```

**Opción B - Manual:**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 📖 Guías de Uso

### Dashboard Principal
- Accede a `/dashboard` para ver métricas y estadísticas
- Visualiza distribución por ciudad
- Últimos clientes registrados
- Tasas de activación

### Gestión de Clientes
1. **Crear Cliente**: Clic en "Nuevo Cliente"
2. **Buscar**: Usa la barra de búsqueda superior
3. **Filtrar**: Por ciudad o actividad
4. **Exportar**: Botón "Exportar CSV"
5. **Importar**: Botón "Importar" → Sube archivo Excel/CSV

### Generación de Reportes
1. Ve a `/reportes`
2. Selecciona tipo de reporte
3. Elige campos a incluir
4. Aplica filtros si necesitas
5. Genera y descarga

### Importación Masiva
1. Ve a `/clientes/importar`
2. Descarga la plantilla CSV
3. Completa los datos
4. Sube el archivo
5. Revisa los resultados

## 🗄️ Base de Datos

### Tabla CLIENTE
```sql
CREATE TABLE public."CLIENTE" (
    id_cliente BIGINT PRIMARY KEY,
    nombre_cliente TEXT NOT NULL,
    rut TEXT NOT NULL,
    direccion TEXT,
    ciudad TEXT,
    comuna TEXT,
    telefono TEXT,
    email TEXT,
    fec_ini_actividades TEXT,
    actividad TEXT,
    codigo TEXT,
    representante_legal TEXT,
    rut_represente TEXT,
    logo TEXT
);
```

### Políticas RLS
- SELECT: Usuarios autenticados
- INSERT/UPDATE: Usuarios autenticados
- DELETE: Solo administradores

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Compilar producción
npm start           # Iniciar producción
npm run lint        # Verificar código
```

## 📝 Características por Implementar

- [ ] Integración con API SII
- [ ] Facturación electrónica
- [ ] Sistema de cotizaciones
- [ ] Historial de cambios
- [ ] API REST pública
- [ ] Tests E2E con Playwright

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Equipo

Desarrollado con ❤️ por el equipo de MTZcontabilidad

---

### 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la [documentación completa](./DIAGNOSTICO_SUPABASE.md)
2. Crea un issue en GitHub
3. Contacta al equipo de desarrollo

### 🌟 Agradecimientos

- [Next.js](https://nextjs.org) - Framework React
- [Supabase](https://supabase.com) - Backend as a Service
- [shadcn/ui](https://ui.shadcn.com) - Componentes UI
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
