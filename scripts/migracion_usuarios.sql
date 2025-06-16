-- =====================================================
-- SCRIPT DE MIGRACIÓN: TABLA USUARIOS A USERS
-- =====================================================
-- Ejecutar después de haber creado la tabla users
-- =====================================================

-- 1. Verificar estado actual
SELECT 
    'usuarios (legacy)' as tabla,
    COUNT(*) as total,
    COUNT(DISTINCT email) as emails_unicos,
    COUNT(DISTINCT rut) as ruts_unicos
FROM usuarios
UNION ALL
SELECT 
    'users (nueva)',
    COUNT(*),
    COUNT(DISTINCT email),
    COUNT(DISTINCT tax_id)
FROM users;

-- 2. Migrar datos de usuarios que no estén ya migrados
INSERT INTO users (
    email,
    auth_id,
    password_hash,
    tax_id,
    first_name,
    last_name,
    maternal_surname,
    client_id,
    user_type,
    is_active,
    must_change_password,
    failed_login_attempts,
    locked_until,
    last_login,
    last_login_ip,
    settings,
    created_at,
    updated_at,
    legacy_user_id
)
SELECT 
    u.email,
    NULL as auth_id, -- Se actualizará cuando el usuario haga login
    u.password_hash,
    u.rut as tax_id,
    COALESCE(
        SPLIT_PART(p.nombre, ' ', 1),
        SPLIT_PART(u.email, '@', 1)
    ) as first_name,
    COALESCE(
        SPLIT_PART(p.nombre, ' ', 2),
        'Usuario'
    ) as last_name,
    CASE 
        WHEN ARRAY_LENGTH(STRING_TO_ARRAY(p.nombre, ' '), 1) > 2 
        THEN SPLIT_PART(p.nombre, ' ', 3)
        ELSE NULL
    END as maternal_surname,
    (SELECT id FROM clients WHERE legacy_id = u.id_cliente LIMIT 1) as client_id,
    CASE 
        WHEN u.tipo = 'admin' THEN 'admin'
        WHEN u.tipo = 'contador' THEN 'accountant'
        WHEN u.tipo = 'cliente' THEN 'client'
        ELSE 'client'
    END as user_type,
    u.activo as is_active,
    u.debe_cambiar_password as must_change_password,
    u.intentos_fallidos as failed_login_attempts,
    u.bloqueado_hasta as locked_until,
    u.last_login,
    u.ip_ultimo_acceso as last_login_ip,
    COALESCE(u.configuracion, '{}'::jsonb) as settings,
    u.created_at,
    u.updated_at,
    u.id as legacy_user_id
FROM usuarios u
LEFT JOIN personas p ON u.persona_id = p.id
WHERE NOT EXISTS (
    SELECT 1 FROM users 
    WHERE email = u.email 
    OR legacy_user_id = u.id
)
AND u.email IS NOT NULL
AND u.email != '';

-- 3. Actualizar auth_id para usuarios que ya tienen cuenta en Supabase Auth
UPDATE users u
SET auth_id = au.id
FROM auth.users au
WHERE u.email = au.email
AND u.auth_id IS NULL;

-- 4. Crear trigger para sincronizar con Supabase Auth en futuros registros
CREATE OR REPLACE FUNCTION sync_user_on_auth_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar si ya existe un usuario con este email
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE email = NEW.email) THEN
        -- Crear usuario en nuestra tabla
        INSERT INTO public.users (
            auth_id,
            email,
            first_name,
            last_name,
            user_type,
            is_active,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'first_name', SPLIT_PART(NEW.email, '@', 1)),
            COALESCE(NEW.raw_user_meta_data->>'last_name', 'Usuario'),
            'client',
            true,
            NOW(),
            NOW()
        );
    ELSE
        -- Actualizar auth_id si el usuario ya existe
        UPDATE public.users 
        SET auth_id = NEW.id,
            updated_at = NOW()
        WHERE email = NEW.email
        AND auth_id IS NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger solo si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created'
    ) THEN
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION sync_user_on_auth_insert();
    END IF;
END
$$;

-- 5. Verificar migración
SELECT 
    'Total usuarios migrados' as descripcion,
    COUNT(*) as cantidad
FROM users
WHERE legacy_user_id IS NOT NULL
UNION ALL
SELECT 
    'Usuarios con auth_id',
    COUNT(*)
FROM users
WHERE auth_id IS NOT NULL
UNION ALL
SELECT 
    'Usuarios sin auth_id (pendientes login)',
    COUNT(*)
FROM users
WHERE auth_id IS NULL;

-- 6. Actualizar políticas RLS para la tabla users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver su propio registro
CREATE POLICY "Users can view own record" ON users
    FOR SELECT USING (auth_id = auth.uid());

-- Política: Los usuarios pueden ver a otros usuarios de su mismo cliente
CREATE POLICY "Users can view same client users" ON users
    FOR SELECT USING (
        client_id IN (
            SELECT client_id FROM users WHERE auth_id = auth.uid()
        )
    );

-- Política: Los administradores pueden ver todos los usuarios
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth_id = auth.uid() 
            AND user_type = 'admin'
        )
    );

-- Política: Los administradores pueden modificar usuarios
CREATE POLICY "Admins can modify users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth_id = auth.uid() 
            AND user_type = 'admin'
        )
    );

-- Política: Los usuarios pueden actualizar su propio registro (excepto campos sensibles)
CREATE POLICY "Users can update own non-sensitive fields" ON users
    FOR UPDATE USING (auth_id = auth.uid())
    WITH CHECK (
        -- No pueden cambiar estos campos
        auth_id = (SELECT auth_id FROM users WHERE id = users.id) AND
        user_type = (SELECT user_type FROM users WHERE id = users.id) AND
        client_id = (SELECT client_id FROM users WHERE id = users.id)
    );

-- 7. Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);
CREATE INDEX IF NOT EXISTS idx_users_client_id ON users(client_id);
CREATE INDEX IF NOT EXISTS idx_users_legacy_id ON users(legacy_user_id);

-- =====================================================
-- FIN DEL SCRIPT DE MIGRACIÓN DE USUARIOS
-- =====================================================
-- IMPORTANTE: 
-- 1. Los usuarios existentes mantendrán sus contraseñas
-- 2. El auth_id se actualizará cuando hagan login
-- 3. Los nuevos usuarios se crearán automáticamente
-- =====================================================
