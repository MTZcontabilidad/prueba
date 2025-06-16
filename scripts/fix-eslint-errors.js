const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

// Función para leer archivo
function readFile(filePath) {
  const projectRoot = path.join(__dirname, '..');
  const fullPath = path.join(projectRoot, filePath);
  return fs.readFileSync(fullPath, 'utf8');
}

// Función para escribir archivo
function writeFile(filePath, content) {
  const projectRoot = path.join(__dirname, '..');
  const fullPath = path.join(projectRoot, filePath);
  fs.writeFileSync(fullPath, content, 'utf8');
}

// Correcciones específicas por archivo
const corrections = {
  './app/test-connection/page.tsx': (content) => {
    // Buscar línea 62 y escapar las comillas
    const lines = content.split('\n');
    if (lines[61]) { // Línea 62 es índice 61
      lines[61] = lines[61].replace(/"base de datos"/g, '&ldquo;base de datos&rdquo;');
    }
    return lines.join('\n');
  },

  './components/clients/client-form.tsx': (content) => {
    // Cambiar any por unknown en línea 81
    content = content.replace(/} catch \(error: any\) {/g, '} catch (error: unknown) {');
    // Cambiar let por const en línea 91
    content = content.replace(/(\s+)let rut = /g, '$1const rut = ');
    return content;
  },

  './components/clients-dashboard.tsx': (content) => {
    // Eliminar parámetro 'client' no usado en línea 580
    content = content.replace(
      /onClick=\{[^}]*=> window\.location\.href = '\/clients\/import'\}/g,
      `onClick={() => window.location.href = '/clients/import'}`
    );
    // También agregar el import faltante de useClients
    if (!content.includes("import { useClients }")) {
      const lastImportIndex = content.lastIndexOf('import');
      const endOfLastImport = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLastImport) + 
                '\nimport { useClients } from "@/lib/hooks/useClients";' + 
                content.slice(endOfLastImport);
    }
    return content;
  },

  './components/database-dashboard.tsx': (content) => {
    // Cambiar any por unknown
    content = content.replace(/: any\[\]/g, ': unknown[]');
    content = content.replace(/\(error: any\)/g, '(error: unknown)');
    // Arreglar el uso de error con type checking
    content = content.replace(/console\.error\('Error:', error\)/g, "console.error('Error:', error instanceof Error ? error.message : error)");
    // Agregar analyzeTables a las dependencias del useEffect
    content = content.replace(/}, \[\]\);(\s*\/\/.*fetchTables)/g, '}, [analyzeTables]);$1');
    return content;
  },

  './components/simple-clients-dashboard.tsx': (content) => {
    // Agregar fetchClients a las dependencias del useEffect
    // Buscar el useEffect después de fetchClients
    const lines = content.split('\n');
    let inFetchClients = false;
    let useEffectFound = false;
    
    for (let i = 0; i < lines.length; i++) {
      // Detectar cuando encontramos fetchClients
      if (lines[i].includes('const fetchClients')) {
        inFetchClients = true;
      }
      
      // Si ya pasamos fetchClients y encontramos useEffect con []
      if (inFetchClients && lines[i].includes('}, []);')) {
        lines[i] = lines[i].replace('}, []);', '}, [fetchClients]);');
        break;
      }
    }
    
    return lines.join('\n');
  },

  './components/ui/calendar.tsx': (content) => {
    // Cambiar props por _props para indicar que no se usa
    content = content.replace(/buttonVariants\)\(props\)/g, 'buttonVariants\)(_props)');
    return content;
  },

  './components/user-profile.tsx': (content) => {
    // Cambiar any por unknown
    content = content.replace(/\(error: any\)/g, '(error: unknown)');
    // Cambiar error por _error si no se usa
    content = content.replace(/} catch \(error\) {/g, '} catch (_error) {');
    return content;
  },

  './lib/hooks/useClients.ts': (content) => {
    // Cambiar todos los any por unknown
    content = content.replace(/} catch \(err: any\) {/g, '} catch (err: unknown) {');
    // Arreglar el uso de err.message
    content = content.replace(/err\.message \|\|/g, '(err instanceof Error ? err.message : String(err)) ||');
    content = content.replace(/const message = err\.message/g, 'const message = err instanceof Error ? err.message : String(err)');
    return content;
  },

  './lib/hooks/useUsers.ts': (content) => {
    // Cambiar todos los any por unknown
    content = content.replace(/: any\)/g, ': unknown)');
    content = content.replace(/\(error: any\)/g, '(error: unknown)');
    // Arreglar el uso de error.message
    content = content.replace(/error\.message \|\|/g, '(error instanceof Error ? error.message : String(error)) ||');
    return content;
  },

  './lib/services/user.service.ts': (content) => {
    // Cambiar any por unknown en línea 238
    content = content.replace(/\(error: any\)/g, '(error: unknown)');
    return content;
  },

  './lib/supabase/types-new.ts': (content) => {
    // Cambiar any por unknown
    content = content.replace(/: any;/g, ': unknown;');
    // Cambiar {} por Record<string, never>
    content = content.replace(/: {};/g, ': Record<string, never>;');
    content = content.replace(/: {} \|/g, ': Record<string, never> |');
    return content;
  },

  './lib/supabase/types.ts': (content) => {
    // Cambiar {} por Record<string, never>
    content = content.replace(/: {};/g, ': Record<string, never>;');
    content = content.replace(/: {} \|/g, ': Record<string, never> |');
    return content;
  }
};

// Función principal
function main() {
  console.log(`${colors.cyan}${colors.bright}🔧 Corrector de Errores ESLint${colors.reset}\n`);
  console.log(`${colors.yellow}📋 Corrigiendo errores de:${colors.reset}`);
  console.log(`   - react/no-unescaped-entities`);
  console.log(`   - @typescript-eslint/no-explicit-any`);
  console.log(`   - prefer-const`);
  console.log(`   - @typescript-eslint/no-unused-vars`);
  console.log(`   - react-hooks/exhaustive-deps`);
  console.log(`   - @typescript-eslint/no-empty-object-type\n`);
  
  let filesFixed = 0;
  let totalErrors = 0;
  
  // Procesar cada archivo
  Object.entries(corrections).forEach(([filePath, fixFunction]) => {
    try {
      const content = readFile(filePath);
      const fixedContent = fixFunction(content);
      
      if (content !== fixedContent) {
        writeFile(filePath, fixedContent);
        console.log(`${colors.green}✅ ${filePath}${colors.reset}`);
        filesFixed++;
        totalErrors += 3; // Estimación de errores por archivo
      }
    } catch (error) {
      console.error(`${colors.red}❌ Error procesando ${filePath}:${colors.reset}`, error.message);
    }
  });
  
  console.log(`\n${colors.green}${colors.bright}✨ ¡Correcciones completadas!${colors.reset}\n`);
  console.log(`${colors.cyan}📊 Resumen:${colors.reset}`);
  console.log(`   ${colors.bright}Archivos corregidos:${colors.reset} ${filesFixed}`);
  console.log(`   ${colors.bright}Errores corregidos:${colors.reset} ~${totalErrors}\n`);
  
  console.log(`${colors.yellow}💡 Próximos pasos:${colors.reset}`);
  console.log(`   1. Ejecuta: ${colors.bright}npm run clean-imports${colors.reset} (para limpiar imports no usados)`);
  console.log(`   2. Ejecuta: ${colors.bright}npm run lint${colors.reset} (para verificar)`);
  console.log(`   3. Ejecuta: ${colors.bright}npm run build${colors.reset} (para compilar)\n`);
}

// Ejecutar
main();
