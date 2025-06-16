# 🧹 Limpiador de Imports No Utilizados

Este script analiza automáticamente todos los archivos TypeScript y React (`.ts` y `.tsx`) en tu proyecto y elimina los imports que no se están utilizando.

## 📋 Características

- ✅ Detecta y elimina imports completos no utilizados
- ✅ Elimina selectivamente elementos no utilizados de imports múltiples
- ✅ Maneja imports de tipos TypeScript
- ✅ Preserva imports especiales (React, tipos base, etc.)
- ✅ Muestra un resumen detallado de los cambios realizados
- ✅ Código con colores en la consola para mejor visualización

## 🚀 Cómo usar

### Opción 1: Usando npm

```bash
npm run clean-imports
```

### Opción 2: Usando el archivo batch (Windows)

Simplemente ejecuta:
```bash
limpiar-imports.bat
```

### Opción 3: Usando PowerShell

```powershell
./limpiar-imports.ps1
```

### Opción 4: Directamente con Node.js

```bash
node scripts/clean-unused-imports.js
```

## 📊 Ejemplo de salida

```
🧹 Limpiador de Imports No Utilizados

🔍 Buscando archivos TypeScript/React...

📁 Encontrados 52 archivos para analizar

✅ components\clients-dashboard.tsx
   ✖  Eliminado import completo de 'lucide-react'
   ⚠  Eliminados de '@/components/ui/card': CardDescription

✅ app\page.tsx
   ✖  Eliminado import completo de '@/lib/utils'

✨ ¡Limpieza completada!

📊 Resumen:
   Archivos analizados: 52
   Archivos modificados: 12
   Imports eliminados: 28
```

## ⚠️ Consideraciones

1. **Backup**: Aunque el script es seguro, se recomienda tener un backup o usar control de versiones (git)

2. **Casos especiales**: El script preserva automáticamente:
   - `React` en archivos `.tsx`
   - Tipos base de TypeScript (`FC`, `ReactNode`, etc.)
   - `toast` de react-hot-toast cuando se usa con notación de punto

3. **Verificación**: Después de ejecutar el script, es recomendable:
   ```bash
   npm run lint
   npm run build
   ```

## 🛠️ Configuración

El script ignora automáticamente las siguientes carpetas:
- `node_modules`
- `.git`
- `.next`
- `dist`
- `build`

Si necesitas agregar más carpetas a ignorar, edita la variable `ignoreDirs` en el archivo `scripts/clean-unused-imports.js`.

## 📝 Notas técnicas

El script utiliza expresiones regulares y análisis de patrones para detectar el uso de imports. Verifica:

- Uso directo como identificador
- Componentes JSX
- Tipos TypeScript
- Destructuring
- Propiedades de objetos
- Parámetros de funciones
- Y muchos otros patrones

## 🐛 Solución de problemas

Si encuentras algún import que no debería haber sido eliminado:

1. Revisa el archivo afectado
2. Si es un caso especial, agrégalo a la lista `alwaysUsed` en el script
3. Usa `git checkout` para restaurar el archivo si es necesario

## 📄 Licencia

Este script es parte del proyecto y sigue la misma licencia del proyecto principal.
