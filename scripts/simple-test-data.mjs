import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSimpleTestData() {
  console.log('🔧 CREANDO DATOS DE PRUEBA SIMPLES\n');
  
  // Datos mínimos basados en la estructura que sabemos que existe
  const simpleClients = [
    {
      tax_id: '12345678-9',
      legal_name: 'Empresa Demo S.A.'
    },
    {
      tax_id: '87654321-K', 
      legal_name: 'Tech Solutions Ltda.'
    },
    {
      tax_id: '11223344-5',
      legal_name: 'Comercial Norte SpA'
    }
  ];
  
  try {
    console.log('🔄 Insertando clientes con estructura mínima...');
    
    for (const client of simpleClients) {
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select();
      
      if (error) {
        console.error(`❌ Error insertando ${client.legal_name}:`, error.message);
        
        // Si falla, intentar con la tabla CLIENTE legacy
        console.log(`🔄 Intentando insertar en tabla CLIENTE legacy...`);
        
        const legacyClient = {
          nombre_cliente: client.legal_name,
          rut: client.tax_id
        };
        
        const { data: legacyData, error: legacyError } = await supabase
          .from('CLIENTE')
          .insert(legacyClient)
          .select();
        
        if (legacyError) {
          console.error(`❌ Error en tabla legacy:`, legacyError.message);
        } else {
          console.log(`✅ Cliente insertado en tabla legacy: ${client.legal_name}`);
        }
        
      } else {
        console.log(`✅ Cliente insertado en tabla clients: ${client.legal_name}`);
        if (data && data[0]) {
          console.log(`   📋 Campos disponibles:`, Object.keys(data[0]));
        }
      }
    }
    
    // Verificar conteos finales
    console.log('\n📊 RESUMEN FINAL:');
    
    const { count: clientsCount } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });
    
    const { count: clienteCount } = await supabase
      .from('CLIENTE')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📋 Registros en tabla 'clients': ${clientsCount}`);
    console.log(`📋 Registros en tabla 'CLIENTE': ${clienteCount}`);
    
    // Mostrar datos de ejemplo si existen
    if (clientsCount > 0) {
      const { data: clientsData } = await supabase
        .from('clients')
        .select('*')
        .limit(2);
      
      console.log('\n📄 MUESTRA DE DATOS EN CLIENTS:');
      clientsData?.forEach(client => {
        console.log(`• ${client.legal_name} (${client.tax_id})`);
      });
    }
    
    if (clienteCount > 0) {
      const { data: clienteData } = await supabase
        .from('CLIENTE')
        .select('*')
        .limit(2);
      
      console.log('\n📄 MUESTRA DE DATOS EN CLIENTE:');
      clienteData?.forEach(cliente => {
        console.log(`• ${cliente.nombre_cliente} (${cliente.rut})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar
createSimpleTestData().then(() => {
  console.log('\n✅ Proceso completado');
}).catch(error => {
  console.error('❌ Error:', error.message);
}); 