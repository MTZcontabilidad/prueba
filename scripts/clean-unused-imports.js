const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Función para obtener todos los archivos .tsx y .ts
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Ignorar directorios especificados
      const ignoreDirs = ['node_modules', '.git', '.next', 'dist', 'build'];
      if (!ignoreDirs.includes(file)) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

// Función mejorada para extraer imports
function extractImports(content) {
  const imports = [];
  
  // Regex para imports estándar
  const importRegex = /import\s+(?:type\s+)?(?:(?:\*\s+as\s+(\w+))|(?:(\w+)(?:\s*,\s*)?)?(?:\{([^}]+)\})?)\s+from\s+['"]([^'"]+)['"]/g;
  
  // Regex para imports de tipo TypeScript
  const typeImportRegex = /import\s+type\s+(?:\{([^}]+)\})\s+from\s+['"]([^'"]+)['"]/g;
  
  let match;

  // Procesar imports estándar
  while ((match = importRegex.exec(content)) !== null) {
    const [fullMatch, namespaceImport, defaultImport, namedImports, source] = match;
    const importedItems = [];
    const isTypeImport = fullMatch.includes('import type');

    if (namespaceImport) {
      importedItems.push({ name: namespaceImport, isNamespace: true });
    }
    if (defaultImport) {
      importedItems.push({ name: defaultImport, isDefault: true });
    }
    if (namedImports) {
      const items = namedImports.split(',').map(item => {
        const trimmed = item.trim();
        const parts = trimmed.split(/\s+as\s+/);
        return {
          name: parts[1] || parts[0],
          originalName: parts[0],
          isNamed: true
        };
      });
      importedItems.push(...items);
    }

    imports.push({
      fullMatch,
      items: importedItems,
      source,
      isTypeImport
    });
  }

  return imports;
}

// Función mejorada para verificar si un import se usa
function isImportUsed(content, importItem, fullImportStatement) {
  // Remover todos los imports del contenido para buscar
  const contentWithoutImports = content.replace(/import\s+.*?from\s+['"].*?['"]\s*;?/gs, '');
  
  const importName = importItem.name;
  
  // Casos especiales que siempre se consideran usados
  const alwaysUsed = ['React', 'Fragment', 'FC', 'ReactNode', 'PropsWithChildren'];
  if (alwaysUsed.includes(importName)) return true;
  
  // Para react-hot-toast
  if (importName === 'toast' && content.includes('toast.')) return true;
  
  // Lista de patrones para buscar el uso
  const patterns = [
    // Uso directo como identificador
    new RegExp(`(?<!\\w)${importName}(?!\\w)(?!:)`, 'g'),
    // Como componente JSX
    new RegExp(`<${importName}(?:\\s|>|/)`, 'g'),
    new RegExp(`</${importName}>`, 'g'),
    // En props de componentes
    new RegExp(`(?:^|\\s)${importName}=`, 'g'),
    // Como tipo en TypeScript
    new RegExp(`:\\s*${importName}(?:<|\\[|\\s|;|,|\\)|$)`, 'g'),
    new RegExp(`extends\\s+${importName}`, 'g'),
    new RegExp(`implements\\s+${importName}`, 'g'),
    // En genéricos TypeScript
    new RegExp(`<${importName}(?:,|>|\\s)`, 'g'),
    // Como namespace
    new RegExp(`${importName}\\.\\w+`, 'g'),
    // En destructuring
    new RegExp(`\\{[^}]*\\b${importName}\\b[^}]*\\}`, 'g'),
    // Como parámetro de función
    new RegExp(`\\(([^)]*\\b${importName}\\b[^)]*)\\)`, 'g'),
    // En arrays
    new RegExp(`\\[.*\\b${importName}\\b.*\\]`, 'g'),
    // En template literals
    new RegExp(`\\\${.*${importName}.*}`, 'g'),
    // Como propiedad de objeto
    new RegExp(`\\.${importName}(?:\\s|\\(|;|,|\\))`, 'g'),
    // En declaraciones
    new RegExp(`(?:const|let|var)\\s+.*=.*\\b${importName}\\b`, 'g'),
    // En retornos
    new RegExp(`return\\s+.*\\b${importName}\\b`, 'g'),
    // En exports
    new RegExp(`export\\s+.*\\b${importName}\\b`, 'g'),
  ];

  // Verificar si algún patrón coincide
  for (const pattern of patterns) {
    if (pattern.test(contentWithoutImports)) {
      return true;
    }
  }

  // Verificación adicional para hooks personalizados
  if (importName.startsWith('use') && contentWithoutImports.includes(importName)) {
    return true;
  }

  return false;
}

// Función para limpiar imports no utilizados con mejor manejo
function cleanUnusedImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    const imports = extractImports(content);
    const unusedImports = [];
    let modifiedContent = content;

    // Analizar cada import
    imports.forEach(importObj => {
      const unusedItems = [];
      const usedItems = [];

      importObj.items.forEach(item => {
        if (isImportUsed(content, item, importObj.fullMatch)) {
          usedItems.push(item);
        } else {
          unusedItems.push(item);
        }
      });

      // Si ningún item se usa, marcar el import completo para eliminar
      if (usedItems.length === 0 && unusedItems.length > 0) {
        unusedImports.push({
          fullMatch: importObj.fullMatch,
          items: unusedItems.map(i => i.name),
          source: importObj.source
        });
        
        // Eliminar el import completo
        modifiedContent = modifiedContent.replace(importObj.fullMatch + '\n', '');
        modifiedContent = modifiedContent.replace(importObj.fullMatch, '');
      }
      // Si algunos items se usan y otros no, reconstruir el import
      else if (usedItems.length > 0 && unusedItems.length > 0) {
        const namedImportMatch = importObj.fullMatch.match(/\{([^}]+)\}/);
        if (namedImportMatch) {
          const currentItems = namedImportMatch[1];
          const itemsArray = currentItems.split(',').map(i => i.trim());
          
          // Filtrar los items no usados
          const newItems = itemsArray.filter(itemStr => {
            const itemName = itemStr.split(/\s+as\s+/)[1] || itemStr.split(/\s+as\s+/)[0];
            return !unusedItems.some(unused => unused.name === itemName.trim());
          });
          
          if (newItems.length > 0) {
            const newImportStr = importObj.fullMatch.replace(
              /\{[^}]+\}/,
              `{ ${newItems.join(', ')} }`
            );
            modifiedContent = modifiedContent.replace(importObj.fullMatch, newImportStr);
            
            unusedImports.push({
              fullMatch: importObj.fullMatch,
              items: unusedItems.map(i => i.name),
              source: importObj.source,
              partial: true
            });
          }
        }
      }
    });

    // Solo escribir si hubo cambios
    if (modifiedContent !== originalContent) {
      fs.writeFileSync(filePath, modifiedContent, 'utf8');
      
      const relativePath = path.relative(process.cwd(), filePath);
      console.log(`${colors.green}✅ ${relativePath}${colors.reset}`);
      
      unusedImports.forEach(unused => {
        if (unused.partial) {
          console.log(`   ${colors.yellow}⚠${colors.reset}  Eliminados de '${unused.source}': ${unused.items.join(', ')}`);
        } else {
          console.log(`   ${colors.red}✖${colors.reset}  Eliminado import completo de '${unused.source}'`);
        }
      });
      
      return unusedImports.reduce((acc, curr) => acc + curr.items.length, 0);
    }
    
    return 0;
  } catch (error) {
    console.error(`${colors.red}❌ Error procesando ${filePath}:${colors.reset}`, error.message);
    return 0;
  }
}

// Función principal
function main() {
  console.log(`${colors.cyan}${colors.bright}🧹 Limpiador de Imports No Utilizados${colors.reset}\n`);
  console.log(`${colors.cyan}🔍 Buscando archivos TypeScript/React...${colors.reset}\n`);
  
  const projectRoot = path.join(__dirname, '..');
  const files = getAllFiles(projectRoot);
  
  console.log(`${colors.cyan}📁 Encontrados ${colors.bright}${files.length}${colors.reset}${colors.cyan} archivos para analizar${colors.reset}\n`);
  
  let totalRemoved = 0;
  let filesModified = 0;
  
  // Crear una barra de progreso simple
  const totalFiles = files.length;
  let processedFiles = 0;
  
  files.forEach((file, index) => {
    const removed = cleanUnusedImports(file);
    processedFiles++;
    
    if (removed > 0) {
      totalRemoved += removed;
      filesModified++;
    } else {
      // Mostrar progreso para archivos sin cambios
      if (processedFiles % 10 === 0) {
        const progress = Math.round((processedFiles / totalFiles) * 100);
        process.stdout.write(`\r${colors.cyan}Progreso: ${progress}%${colors.reset}`);
      }
    }
  });
  
  // Limpiar la línea de progreso
  process.stdout.write('\r\x1b[K');
  
  console.log(`\n${colors.green}${colors.bright}✨ ¡Limpieza completada!${colors.reset}\n`);
  console.log(`${colors.cyan}📊 Resumen:${colors.reset}`);
  console.log(`   ${colors.bright}Archivos analizados:${colors.reset} ${totalFiles}`);
  console.log(`   ${colors.bright}Archivos modificados:${colors.reset} ${filesModified}`);
  console.log(`   ${colors.bright}Imports eliminados:${colors.reset} ${totalRemoved}\n`);
  
  if (filesModified === 0) {
    console.log(`${colors.green}✨ ¡Tu código ya está limpio! No se encontraron imports sin usar.${colors.reset}`);
  } else {
    console.log(`${colors.yellow}💡 Tip: Ejecuta 'npm run lint' para verificar que no haya errores.${colors.reset}`);
  }
}

// Verificar si Node.js soporta los módulos necesarios
try {
  // Ejecutar el script
  main();
} catch (error) {
  console.error(`${colors.red}❌ Error fatal:${colors.reset}`, error.message);
  process.exit(1);
}
