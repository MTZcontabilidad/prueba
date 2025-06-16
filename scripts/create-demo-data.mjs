import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createDemoData() {
  console.log('🎯 CREANDO DATOS DE DEMOSTRACIÓN\n');
  
  const demoClients = [
    {
      nombre_cliente: 'Empresa Demo S.A.',
      rut: '12345678-9',
      email: 'contacto@empresademo.cl',
      telefono: '+56912345678',
      direccion: 'Av. Providencia 123',
      ciudad: 'Santiago',
      comuna: 'Providencia',
      actividad: 'Servicios de Consultoría'
    },
    {
      nombre_cliente: 'Tech Solutions Ltda.',
      rut: '87654321-K',
      email: 'info@techsolutions.cl',
      telefono: '+56987654321',
      direccion: 'Las Condes 456',
      ciudad: 'Santiago',
      comuna: 'Las Condes',
      actividad: 'Desarrollo de Software'
    },
    {
      nombre_cliente: 'Comercial Norte SpA',
      rut: '11223344-5',
      email: 'ventas@comercialnorte.cl',
      telefono: '+56911223344',
      direccion: 'Av. Libertador 789',
      ciudad: 'Valparaíso',
      comuna: 'Valparaíso',
      actividad: 'Comercio al por Mayor'
    },
    {
      nombre_cliente: 'Servicios Profesionales Ltda.',
      rut: '99887766-3',
      email: 'contacto@servprof.cl',
      telefono: '+56999887766',
      direccion: 'Moneda 1234',
      ciudad: 'Santiago',
      comuna: 'Santiago Centro',
      actividad: 'Servicios Profesionales'
    },
    {
      nombre_cliente: 'Innovación Digital S.A.',
      rut: '55443322-1',
      email: 'hola@innodigital.cl',
      telefono: '+56955443322',
      direccion: 'Nueva Providencia 567',
      ciudad: 'Santiago',
      comuna: 'Providencia',
      actividad: 'Tecnología e Innovación'
    }
  ];
  
  try {
    console.log('🔄 Insertando datos en tabla CLIENTE...');
    
    for (const client of demoClients) {
      const { error } = await supabase
        .from('CLIENTE')
        .upsert(client, { onConflict: 'rut' });
      
      if (error) {
        console.log(`⚠️  ${client.nombre_cliente}: ${error.message}`);
      } else {
        console.log(`✅ ${client.nombre_cliente} - agregado`);
      }
    }
    
    // Verificar total
    const { count } = await supabase
      .from('CLIENTE')
      .select('*', { count: 'exact', head: true });
    
    console.log(`\n📊 Total de clientes: ${count}`);
    console.log('\n🎉 ¡Datos de demostración creados!');
    console.log('Ahora puedes ver los clientes en: http://localhost:3002/clients');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createDemoData(); 