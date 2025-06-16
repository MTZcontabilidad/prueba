# 🔧 Guía de Corrección de Errores ESLint

Este documento explica los errores de ESLint encontrados en el proyecto y cómo el script los corrige automáticamente.

## 📋 Resumen de Errores

### 1. **react/no-unescaped-entities**
- **Archivo**: `app/test-connection/page.tsx`
- **Problema**: Las comillas `"` no están escapadas en JSX
- **Solución**: Reemplazar `"` con `&ldquo;` y `&rdquo;`

### 2. **@typescript-eslint/no-explicit-any**
- **Archivos múltiples**: hooks, services, components
- **Problema**: Uso del tipo `any` que desactiva el type checking
- **Solución**: Cambiar `any` por `unknown` para mantener la seguridad de tipos

### 3. **prefer-const**
- **Archivo**: `components/clients/client-form.tsx`
- **Problema**: Variable `rut` declarada con `let` pero nunca reasignada
- **Solución**: Cambiar `let rut` por `const rut`

### 4. **@typescript-eslint/no-unused-vars**
- **Archivos**: `clients-dashboard.tsx`, `calendar.tsx`, `user-profile.tsx`
- **Problema**: Variables o parámetros declarados pero no usados
- **Solución**: 
  - Eliminar parámetros no usados
  - Usar prefijo `_` para indicar que es intencional

### 5. **react-hooks/exhaustive-deps**
- **Archivos**: `database-dashboard.tsx`, `simple-clients-dashboard.tsx`
- **Problema**: Dependencias faltantes en `useEffect`
- **Solución**: Agregar las funciones faltantes al array de dependencias

### 6. **@typescript-eslint/no-empty-object-type**
- **Archivos**: `types.ts`, `types-new.ts`
- **Problema**: Uso de `{}` como tipo
- **Solución**: Cambiar `{}` por `Record<string, never>`

## 🚀 Cómo ejecutar las correcciones

### Opción 1: Corregir todo de una vez
```bash
npm run fix-all
```

### Opción 2: Corregir por separado
```bash
# Primero corregir errores de ESLint
npm run fix-errors

# Luego limpiar imports no usados
npm run clean-imports
```

### Opción 3: Usar el archivo batch (Windows)
```bash
corregir-errores.bat
```

## 📝 Cambios realizados por archivo

### `app/test-connection/page.tsx`
```typescript
// Antes
<p>"base de datos"</p>

// Después
<p>&ldquo;base de datos&rdquo;</p>
```

### `components/clients/client-form.tsx`
```typescript
// Antes
} catch (error: any) {
let rut = value;

// Después
} catch (error: unknown) {
const rut = value;
```

### `components/clients-dashboard.tsx`
```typescript
// Antes
onClick={(client) => window.location.href = '/clients/import'}

// Después
onClick={() => window.location.href = '/clients/import'}

// También se agrega el import faltante:
import { useClients } from "@/lib/hooks/useClients";
```

### `components/database-dashboard.tsx`
```typescript
// Antes
} catch (error: any) {
const data: any[] = result.data;
}, []);

// Después
} catch (error: unknown) {
const data: unknown[] = result.data;
}, [analyzeTables]);
```

### `components/ui/calendar.tsx`
```typescript
// Antes
buttonVariants)(props)

// Después
buttonVariants)(_props)
```

### Hooks y Services
```typescript
// Antes
} catch (err: any) {

// Después
} catch (err: unknown) {
```

### Types de Supabase
```typescript
// Antes
type SomeType = {} | null;

// Después
type SomeType = Record<string, never> | null;
```

## ⚠️ Notas importantes

1. **unknown vs any**: 
   - `any` desactiva completamente el type checking
   - `unknown` es seguro pero requiere validación antes de usar
   - Ejemplo de uso correcto:
   ```typescript
   } catch (error: unknown) {
     const message = error instanceof Error ? error.message : 'Error desconocido';
     console.error(message);
   }
   ```

2. **Dependencias de useEffect**:
   - Siempre incluir todas las variables y funciones usadas
   - Si una función causa re-renders infinitos, envuélvela en `useCallback`

3. **Variables no usadas**:
   - Si realmente no se necesita, elimínala
   - Si es intencional (ej: en destructuring), usa `_` como prefijo

## 🔍 Verificación posterior

Después de ejecutar las correcciones:

1. **Verificar con ESLint**:
   ```bash
   npm run lint
   ```

2. **Hacer build de prueba**:
   ```bash
   npm run build
   ```

3. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

## 🛠️ Personalización

Si necesitas modificar las correcciones, edita el archivo `scripts/fix-eslint-errors.js`.

Cada corrección está organizada por archivo y tiene una función específica que puedes ajustar según tus necesidades.

## 📚 Referencias

- [ESLint Rules](https://eslint.org/docs/rules/)
- [TypeScript ESLint](https://typescript-eslint.io/rules/)
- [React Hooks Rules](https://reactjs.org/docs/hooks-rules.html)
