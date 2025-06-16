import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  console.log('🔍 VERIFICANDO ESTRUCTURA DE TABLA CLIENTS\n');
  
  try {
    // Intentar insertar un registro mínimo para ver qué columnas acepta
    const testClient = {
      tax_id: 'test-123',
      legal_name: 'Test Client'
    };
    
    const { data, error } = await supabase
      .from('clients')
      .insert(testClient)
      .select();
    
    if (error) {
      console.error('❌ Error insertando cliente de prueba:', error.message);
    } else {
      console.log('✅ Cliente de prueba insertado exitosamente');
      console.log('📋 Estructura detectada:', Object.keys(data[0]));
      
      // Eliminar el cliente de prueba
      await supabase
        .from('clients')
        .delete()
        .eq('tax_id', 'test-123');
      
      console.log('🗑️ Cliente de prueba eliminado');
    }
    
    // Intentar obtener información de la tabla usando describe
    console.log('\n🔍 Intentando obtener esquema de la tabla...');
    
    // Método alternativo: insertar con todos los campos posibles y ver cuáles fallan
    const fullTestClient = {
      tax_id: 'test-456',
      legal_name: 'Full Test Client',
      trade_name: 'Test Trade',
      email: 'test@test.com',
      phone: '+56912345678',
      website: 'https://test.com',
      address: 'Test Address',
      city: 'Santiago',
      state: 'RM',
      postal_code: '12345',
      country: 'Chile',
      business_activity: 'Testing',
      activity_code: 'TEST',
      business_start_date: '2024-01-01',
      legal_representative: 'Test Rep',
      legal_rep_tax_id: '12345678-9',
      client_type: 'company',
      is_vat_contributor: true,
      logo_url: 'https://test.com/logo.png',
      is_active: true,
      notes: 'Test notes'
    };
    
    const { data: fullData, error: fullError } = await supabase
      .from('clients')
      .insert(fullTestClient)
      .select();
    
    if (fullError) {
      console.error('❌ Error con cliente completo:', fullError.message);
      
      // Intentar con campos básicos
      const basicClient = {
        tax_id: 'test-789',
        legal_name: 'Basic Test Client',
        email: 'basic@test.com',
        phone: '+56912345678',
        city: 'Santiago'
      };
      
      const { data: basicData, error: basicError } = await supabase
        .from('clients')
        .insert(basicClient)
        .select();
      
      if (basicError) {
        console.error('❌ Error con cliente básico:', basicError.message);
      } else {
        console.log('✅ Cliente básico insertado');
        console.log('📋 Campos aceptados:', Object.keys(basicData[0]));
        
        // Limpiar
        await supabase
          .from('clients')
          .delete()
          .eq('tax_id', 'test-789');
      }
      
    } else {
      console.log('✅ Cliente completo insertado exitosamente');
      console.log('📋 Todos los campos disponibles:', Object.keys(fullData[0]));
      
      // Limpiar
      await supabase
        .from('clients')
        .delete()
        .eq('tax_id', 'test-456');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Ejecutar
checkTableStructure().then(() => {
  console.log('\n✅ Verificación completada');
}).catch(error => {
  console.error('❌ Error:', error.message);
}); 