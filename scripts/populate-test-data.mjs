import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function populateTestData() {
  console.log('🔧 POBLANDO DATOS DE PRUEBA EN TABLA CLIENTS\n');
  
  const testClients = [
    {
      tax_id: '12345678-9',
      legal_name: 'Empresa Demo S.A.',
      trade_name: 'Demo Corp',
      email: 'contacto@empresademo.cl',
      phone: '+56912345678',
      address: 'Av. Providencia 123, Oficina 456',
      city: 'Santiago',
      district: 'Providencia',
      business_activity: 'Servicios de Consultoría',
      activity_code: 'EMP001',
      client_type: 'company',
      is_vat_contributor: true,
      country: 'Chile'
    },
    {
      tax_id: '87654321-K',
      legal_name: 'Tech Solutions Ltda.',
      trade_name: 'TechSol',
      email: 'info@techsolutions.cl',
      phone: '+56987654321',
      address: 'Las Condes 456, Piso 12',
      city: 'Santiago',
      district: 'Las Condes',
      business_activity: 'Desarrollo de Software',
      activity_code: 'TECH002',
      client_type: 'company',
      is_vat_contributor: true,
      country: 'Chile'
    },
    {
      tax_id: '11223344-5',
      legal_name: 'Comercial Norte SpA',
      email: 'ventas@comercialnorte.cl',
      phone: '+56911223344',
      address: 'Av. Libertador 789',
      city: 'Valparaíso',
      district: 'Valparaíso',
      business_activity: 'Comercio al por Mayor',
      activity_code: 'COM003',
      client_type: 'company',
      is_vat_contributor: true,
      country: 'Chile'
    },
    {
      tax_id: '99887766-3',
      legal_name: 'Servicios Profesionales Ltda.',
      email: 'contacto@servprof.cl',
      phone: '+56999887766',
      address: 'Moneda 1234',
      city: 'Santiago',
      district: 'Santiago Centro',
      business_activity: 'Servicios Profesionales',
      activity_code: 'SERV004',
      client_type: 'company',
      is_vat_contributor: false,
      country: 'Chile'
    },
    {
      tax_id: '55443322-1',
      legal_name: 'Innovación Digital S.A.',
      trade_name: 'InnoDigital',
      email: 'hola@innodigital.cl',
      phone: '+56955443322',
      website: 'https://innodigital.cl',
      address: 'Nueva Providencia 567',
      city: 'Santiago',
      district: 'Providencia',
      business_activity: 'Tecnología e Innovación',
      activity_code: 'TECH005',
      client_type: 'company',
      is_vat_contributor: true,
      country: 'Chile'
    }
  ];
  
  try {
    console.log(`🔄 Insertando ${testClients.length} clientes de prueba...`);
    
    for (const client of testClients) {
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select();
      
      if (error) {
        console.error(`❌ Error insertando ${client.legal_name}:`, error.message);
      } else {
        console.log(`✅ Cliente creado: ${client.legal_name}`);
      }
    }
    
    // Verificar total de registros
    const { count } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n📊 Total de clientes en la base de datos: ${count}`);
    
    // Mostrar algunos datos de ejemplo
    const { data: sampleData } = await supabase
      .from('clients')
      .select('legal_name, tax_id, city, business_activity')
      .limit(3);
    
    if (sampleData && sampleData.length > 0) {
      console.log('\n📋 MUESTRA DE DATOS:');
      console.log('='.repeat(50));
      sampleData.forEach(client => {
        console.log(`• ${client.legal_name} (${client.tax_id})`);
        console.log(`  📍 ${client.city} - ${client.business_activity}`);
      });
    }
    
    console.log('\n✅ ¡DATOS DE PRUEBA CREADOS EXITOSAMENTE!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar
populateTestData().then(() => {
  console.log('\n🎉 Proceso completado');
}).catch(error => {
  console.error('❌ Error:', error.message);
}); 