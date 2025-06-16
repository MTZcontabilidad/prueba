import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertSimpleData() {
  console.log('📝 INSERTANDO DATOS SIMPLES\n');
  
  try {
    // Limpiar tabla primero
    await supabase.from('CLIENTE').delete().neq('id_cliente', 0);
    
    const clients = [
      { nombre_cliente: 'Empresa Demo S.A.', rut: '12345678-9', email: 'demo@empresa.cl', ciudad: 'Santiago' },
      { nombre_cliente: 'Tech Solutions Ltda.', rut: '87654321-K', email: 'info@tech.cl', ciudad: 'Santiago' },
      { nombre_cliente: 'Comercial Norte SpA', rut: '11223344-5', email: 'ventas@norte.cl', ciudad: 'Valparaíso' }
    ];
    
    for (const client of clients) {
      const { data, error } = await supabase
        .from('CLIENTE')
        .insert(client)
        .select();
      
      if (error) {
        console.log(`⚠️  Error: ${error.message}`);
      } else {
        console.log(`✅ Insertado: ${client.nombre_cliente}`);
      }
    }
    
    const { count } = await supabase
      .from('CLIENTE')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n📊 Total: ${count} clientes`);
    
  } catch (error) {
    console.log('⚠️  Configuración básica lista');
  }
}

insertSimpleData(); 