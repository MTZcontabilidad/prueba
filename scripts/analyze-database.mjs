// Script para analizar la base de datos Supabase
// Ejecutar con: node scripts/analyze-database.mjs

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas');
  console.log('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en tu .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeDatabase() {
  console.log('🔍 Analizando base de datos Supabase...\n');
  
  try {
    // Método 1: Intentar obtener esquema completo
    console.log('📋 Intentando obtener esquema de information_schema...');
    const { data: schemaData, error: schemaError } = await supabase
      .from('information_schema.columns')
      .select('table_name, column_name, data_type, is_nullable, column_default')
      .eq('table_schema', 'public');

    if (schemaError) {
      console.log('⚠️ No se pudo acceder a information_schema:', schemaError.message);
      console.log('📋 Intentando método alternativo...\n');
      await analyzeKnownTables();
    } else {
      await displaySchemaInfo(schemaData);
    }

  } catch (error) {
    console.error('❌ Error analizando base de datos:', error.message);
    console.log('📋 Intentando método alternativo...\n');
    await analyzeKnownTables();
  }
}

async function displaySchemaInfo(schemaData) {
  // Agrupar por tabla
  const tables = {};
  schemaData.forEach(col => {
    if (!tables[col.table_name]) {
      tables[col.table_name] = [];
    }
    tables[col.table_name].push(col);
  });

  console.log(`✅ Encontradas ${Object.keys(tables).length} tablas:\n`);

  for (const [tableName, columns] of Object.entries(tables)) {
    console.log(`📊 Tabla: ${tableName}`);
    console.log('─'.repeat(50));
    
    // Obtener conteo de filas
    try {
      const { count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      console.log(`📈 Filas: ${count || 0}`);
    } catch {
      console.log('📈 Filas: No accesible');
    }

    console.log('\n🏗️ Estructura:');
    columns.forEach(col => {
      console.log(`  • ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? '- Nullable' : '- Not Null'}`);
    });
    
    console.log('\n');
  }
}

async function analyzeKnownTables() {
  const knownTables = [
    'CLIENTE', 'cliente', 'clientes', 
    'PRODUCTO', 'producto', 'productos',
    'PEDIDO', 'pedido', 'pedidos',
    'USUARIO', 'usuario', 'usuarios',
    'users', 'profiles', 'notes'
  ];

  console.log('🔍 Buscando tablas conocidas...\n');
  
  const foundTables = [];

  for (const tableName of knownTables) {
    try {
      const { data, error, count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact' })
        .limit(1);

      if (!error && data !== null) {
        foundTables.push({ name: tableName, data, count });
        console.log(`✅ Tabla encontrada: ${tableName} (${count || 0} filas)`);
      }
    } catch {
      // Tabla no existe, continuar silenciosamente
    }
  }

  console.log(`\n📊 Resumen: ${foundTables.length} tablas encontradas\n`);

  // Mostrar estructura de cada tabla encontrada
  for (const table of foundTables) {
    console.log(`📋 Análisis de tabla: ${table.name}`);
    console.log('─'.repeat(50));
    console.log(`📈 Total de filas: ${table.count || 0}`);
    
    if (table.data.length > 0) {
      console.log('\n🏗️ Estructura inferida:');
      const sample = table.data[0];
      Object.entries(sample).forEach(([key, value]) => {
        const type = value === null ? 'null' : typeof value;
        console.log(`  • ${key}: ${type}`);
      });
      
      console.log('\n📄 Datos de ejemplo:');
      console.log(JSON.stringify(sample, null, 2));
    } else {
      console.log('\n⚠️ Tabla vacía - no se puede inferir estructura');
    }
    
    console.log('\n');
  }

  if (foundTables.length === 0) {
    console.log('❌ No se encontraron tablas accesibles');
    console.log('💡 Sugerencias:');
    console.log('  • Verifica que las tablas existan en Supabase');
    console.log('  • Revisa los permisos RLS (Row Level Security)');
    console.log('  • Asegúrate de que tu API key tenga los permisos correctos');
  }
}

// Ejecutar análisis
analyzeDatabase().catch(console.error); 