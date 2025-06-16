import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan las credenciales de Supabase en .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeTables() {
  console.log('🔍 ANALIZANDO ESTRUCTURA DE TABLAS EN SUPABASE\n');
  
  try {
    // Primero, intentemos obtener las tablas usando una consulta SQL directa
    const { data: tables, error } = await supabase.rpc('get_table_list');
    
    if (error) {
      // Si no existe la función, intentemos con una consulta directa
      console.log('Intentando método alternativo...');
      
      // Verificar tabla CLIENTE directamente
      const { data: clienteData, error: clienteError } = await supabase
        .from('CLIENTE')
        .select('*')
        .limit(1);
      
      if (!clienteError) {
        console.log('✅ Tabla CLIENTE encontrada');
        
        // Contar registros
        const { count } = await supabase
          .from('CLIENTE')
          .select('*', { count: 'exact', head: true });
        
        console.log(`📊 CLIENTE: ${count} registros`);
        
        // Obtener una muestra de datos
        const { data: sample } = await supabase
          .from('CLIENTE')
          .select('*')
          .limit(3);
        
        if (sample && sample.length > 0) {
          console.log('\n📋 ESTRUCTURA DE CLIENTE:');
          console.log('Columnas encontradas:', Object.keys(sample[0]));
        }
      }
      
      // Verificar si existe tabla clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .limit(1);
      
      if (!clientsError) {
        console.log('✅ Tabla clients encontrada');
        
        const { count: clientsCount } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true });
        
        console.log(`📊 clients: ${clientsCount} registros`);
      } else {
        console.log('❌ Tabla clients no encontrada');
      }
      
      // Verificar tabla users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(1);
      
      if (!usersError) {
        console.log('✅ Tabla users encontrada');
        
        const { count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
        
        console.log(`📊 users: ${usersCount} registros`);
      } else {
        console.log('❌ Tabla users no encontrada');
      }
      
    } else {
      console.log('Tablas encontradas:', tables);
    }
    
  } catch (error) {
    console.error('❌ Error en análisis:', error.message);
  }
}

// Ejecutar análisis
analyzeTables().then(() => {
  console.log('\n✅ Análisis completado');
}).catch(error => {
  console.error('❌ Error:', error.message);
}); 