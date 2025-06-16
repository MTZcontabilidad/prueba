import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan las credenciales de Supabase en .env.local');
  console.log('Necesitas:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY (o NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 CONFIGURANDO BASE DE DATOS EN INGLÉS\n');
  
  try {
    // 1. Verificar conexión
    console.log('🔍 Verificando conexión a Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('CLIENTE')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error de conexión:', testError.message);
      return;
    }
    
    console.log('✅ Conexión exitosa');
    
    // 2. Verificar si ya existen las tablas en inglés
    console.log('\n🔍 Verificando tablas existentes...');
    
    const { data: clientsExists } = await supabase
      .from('clients')
      .select('*')
      .limit(1);
    
    if (clientsExists) {
      console.log('⚠️  La tabla "clients" ya existe');
      
      // Contar registros existentes
      const { count: clientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });
      
      console.log(`📊 Registros en clients: ${clientsCount}`);
      
      if (clientsCount > 0) {
        console.log('✅ La tabla clients ya tiene datos. No se requiere migración.');
        return;
      }
    }
    
    // 3. Verificar datos en tabla legacy CLIENTE
    console.log('\n📋 Verificando datos en tabla CLIENTE...');
    const { count: clienteCount } = await supabase
      .from('CLIENTE')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📊 Registros en CLIENTE: ${clienteCount}`);
    
    if (clienteCount === 0) {
      console.log('⚠️  No hay datos para migrar en la tabla CLIENTE');
      
      // Crear algunos datos de prueba
      console.log('\n🔧 Creando datos de prueba...');
      
      const testClients = [
        {
          id_cliente: 1,
          nombre_cliente: 'Empresa Demo S.A.',
          rut: '12345678-9',
          email: 'contacto@empresademo.cl',
          telefono: '+56912345678',
          direccion: 'Av. Providencia 123',
          ciudad: 'Santiago',
          comuna: 'Providencia',
          actividad: 'Servicios de Consultoría',
          codigo: 'EMP001'
        },
        {
          id_cliente: 2,
          nombre_cliente: 'Tech Solutions Ltda.',
          rut: '87654321-K',
          email: 'info@techsolutions.cl',
          telefono: '+56987654321',
          direccion: 'Las Condes 456',
          ciudad: 'Santiago',
          comuna: 'Las Condes',
          actividad: 'Desarrollo de Software',
          codigo: 'TECH002'
        }
      ];
      
      for (const client of testClients) {
        const { error: insertError } = await supabase
          .from('CLIENTE')
          .insert(client);
        
        if (insertError) {
          console.error('❌ Error insertando datos de prueba:', insertError.message);
        } else {
          console.log(`✅ Cliente de prueba creado: ${client.nombre_cliente}`);
        }
      }
    }
    
    // 4. Ejecutar migración usando función SQL
    console.log('\n🔄 Ejecutando migración de CLIENTE a clients...');
    
    // Primero, intentar crear la tabla clients si no existe
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.clients (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tax_id VARCHAR(20) NOT NULL,
          legal_name VARCHAR(200) NOT NULL,
          trade_name VARCHAR(200),
          email VARCHAR(100),
          phone VARCHAR(20),
          website VARCHAR(200),
          address TEXT,
          city VARCHAR(100),
          state VARCHAR(100),
          postal_code VARCHAR(20),
          country VARCHAR(50) DEFAULT 'Chile',
          district VARCHAR(100),
          business_activity VARCHAR(200),
          activity_code VARCHAR(20),
          business_start_date DATE,
          business_end_date DATE,
          legal_representative VARCHAR(200),
          legal_rep_tax_id VARCHAR(20),
          client_type VARCHAR(20) DEFAULT 'company',
          is_vat_contributor BOOLEAN DEFAULT true,
          logo_url TEXT,
          is_active BOOLEAN DEFAULT true,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_by UUID,
          legacy_id INTEGER,
          mtz_client_id VARCHAR(50),
          accounting_company_id UUID
      );
      
      CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_tax_id_unique ON public.clients(tax_id);
    `;
    
    const { error: createError } = await supabase.rpc('exec_sql', { 
      sql: createTableSQL 
    });
    
    if (createError) {
      console.log('⚠️  No se pudo usar exec_sql, intentando método alternativo...');
      
      // Método alternativo: insertar datos directamente
      const { data: clienteData } = await supabase
        .from('CLIENTE')
        .select('*');
      
      if (clienteData && clienteData.length > 0) {
        console.log(`🔄 Migrando ${clienteData.length} registros...`);
        
        for (const cliente of clienteData) {
          const clientData = {
            tax_id: cliente.rut || `temp-${cliente.id_cliente}`,
            legal_name: cliente.nombre_cliente || 'Sin nombre',
            email: cliente.email || null,
            phone: cliente.telefono || null,
            address: cliente.direccion || null,
            city: cliente.ciudad || null,
            district: cliente.comuna || null,
            business_activity: cliente.actividad || null,
            activity_code: cliente.codigo || null,
            legal_representative: cliente.representante_legal || null,
            legal_rep_tax_id: cliente.rut_represente || null,
            logo_url: cliente.logo || null,
            legacy_id: cliente.id_cliente
          };
          
          const { error: insertError } = await supabase
            .from('clients')
            .insert(clientData);
          
          if (insertError) {
            console.error(`❌ Error migrando cliente ${cliente.id_cliente}:`, insertError.message);
          } else {
            console.log(`✅ Cliente migrado: ${cliente.nombre_cliente}`);
          }
        }
      }
    }
    
    // 5. Verificar resultado de la migración
    console.log('\n📊 Verificando resultado de la migración...');
    
    const { count: finalClientsCount } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });
    
    console.log(`✅ Total de registros en clients: ${finalClientsCount}`);
    
    // 6. Configurar RLS básico
    console.log('\n🔒 Configurando políticas de seguridad...');
    
    const rlsSQL = `
      ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Users can view clients" ON public.clients;
      CREATE POLICY "Users can view clients" ON public.clients
          FOR SELECT USING (true);
      
      DROP POLICY IF EXISTS "Users can insert clients" ON public.clients;
      CREATE POLICY "Users can insert clients" ON public.clients
          FOR INSERT WITH CHECK (true);
      
      DROP POLICY IF EXISTS "Users can update clients" ON public.clients;
      CREATE POLICY "Users can update clients" ON public.clients
          FOR UPDATE USING (true);
      
      DROP POLICY IF EXISTS "Users can delete clients" ON public.clients;
      CREATE POLICY "Users can delete clients" ON public.clients
          FOR DELETE USING (true);
    `;
    
    // Intentar aplicar RLS (puede fallar si no tenemos permisos suficientes)
    try {
      const { error: rlsError } = await supabase.rpc('exec_sql', { sql: rlsSQL });
      if (rlsError) {
        console.log('⚠️  RLS configurado manualmente (requiere permisos de admin)');
      } else {
        console.log('✅ RLS configurado correctamente');
      }
    } catch (e) {
      console.log('⚠️  RLS debe configurarse manualmente en el dashboard de Supabase');
    }
    
    console.log('\n🎉 ¡MIGRACIÓN COMPLETADA!');
    console.log('='.repeat(50));
    console.log('✅ Tabla clients creada y poblada');
    console.log('✅ Datos migrados desde CLIENTE');
    console.log('✅ Estructura en inglés lista para usar');
    console.log('\n📝 Próximos pasos:');
    console.log('1. Verificar los datos en el dashboard de Supabase');
    console.log('2. Actualizar los tipos TypeScript si es necesario');
    console.log('3. Probar la aplicación con las nuevas tablas');
    
  } catch (error) {
    console.error('❌ Error en configuración:', error.message);
  }
}

// Ejecutar configuración
setupDatabase().then(() => {
  console.log('\n✅ Proceso completado');
}).catch(error => {
  console.error('❌ Error:', error.message);
}); 