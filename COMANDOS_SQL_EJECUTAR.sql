-- =====================================================
-- COMANDOS SQL PARA EJECUTAR EN SUPABASE
-- =====================================================
-- Ejecutar estos comandos en orden en el SQL Editor
-- =====================================================

-- 1. VERIFICAR ESTADO ACTUAL
SELECT 
    'clients' as tabla,
    COUNT(*) as total,
    'Nueva tabla en inglés' as estado
FROM clients
UNION ALL
SELECT 
    'users',
    COUNT(*),
    'Por migrar desde usuarios'
FROM users
UNION ALL
SELECT 
    'usuarios (legacy)',
    COUNT(*),
    'Tabla original'
FROM usuarios;

-- 2. EJECUTAR MIGRACIÓN DE USUARIOS
-- Copiar y ejecutar el contenido completo de scripts/migracion_usuarios.sql

-- 3. VERIFICAR MIGRACIÓN
SELECT 
    'Total usuarios migrados' as descripcion,
    COUNT(*) as cantidad
FROM users
WHERE legacy_user_id IS NOT NULL;

-- 4. VERIFICAR POLÍTICAS RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('clients', 'users', 'tax_documents')
ORDER BY tablename, policyname;

-- 5. VERIFICAR ÍNDICES
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('clients', 'users', 'tax_documents')
ORDER BY tablename, indexname;

-- 6. PRUEBA DE INTEGRIDAD
-- Verificar que todos los clientes tienen al menos un usuario
SELECT 
    c.id,
    c.legal_name,
    c.tax_id,
    COUNT(u.id) as usuarios_count
FROM clients c
LEFT JOIN users u ON u.client_id = c.id
GROUP BY c.id, c.legal_name, c.tax_id
HAVING COUNT(u.id) = 0
LIMIT 10;

-- 7. ESTADÍSTICAS FINALES
SELECT 
    'Resumen de Migración' as titulo,
    (SELECT COUNT(*) FROM clients WHERE is_active = true) as clientes_activos,
    (SELECT COUNT(*) FROM users WHERE is_active = true) as usuarios_activos,
    (SELECT COUNT(*) FROM users WHERE auth_id IS NOT NULL) as usuarios_con_auth,
    (SELECT COUNT(*) FROM document_types) as tipos_documento,
    (SELECT COUNT(DISTINCT user_type) FROM users) as tipos_usuario;

-- =====================================================
-- IMPORTANTE: GUARDAR ESTOS RESULTADOS COMO REFERENCIA
-- =====================================================
