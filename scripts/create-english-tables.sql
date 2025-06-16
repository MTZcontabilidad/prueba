-- =====================================================
-- SCRIPT PARA CREAR TABLAS EN INGLÉS Y MIGRAR DATOS
-- =====================================================

-- 1. CREAR TABLA CLIENTS (reemplaza CLIENTE)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tax_id VARCHAR(20) NOT NULL UNIQUE, -- RUT
    legal_name VARCHAR(200) NOT NULL, -- nombre_cliente
    trade_name VARCHAR(200), -- nombre comercial
    email VARCHAR(100),
    phone VARCHAR(20), -- telefono
    website VARCHAR(200),
    address TEXT, -- direccion
    city VARCHAR(100), -- ciudad
    state VARCHAR(100), -- región
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'Chile',
    district VARCHAR(100), -- comuna
    business_activity VARCHAR(200), -- actividad
    activity_code VARCHAR(20), -- codigo
    business_start_date DATE, -- fec_ini_actividades
    business_end_date DATE,
    legal_representative VARCHAR(200), -- representante_legal
    legal_rep_tax_id VARCHAR(20), -- rut_represente
    client_type VARCHAR(20) DEFAULT 'company', -- 'company' o 'individual'
    is_vat_contributor BOOLEAN DEFAULT true,
    logo_url TEXT, -- logo
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    -- Campos para compatibilidad con sistema legacy
    legacy_id INTEGER, -- id_cliente original
    mtz_client_id VARCHAR(50),
    accounting_company_id UUID
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_clients_tax_id ON public.clients(tax_id);
CREATE INDEX IF NOT EXISTS idx_clients_legal_name ON public.clients(legal_name);
CREATE INDEX IF NOT EXISTS idx_clients_city ON public.clients(city);
CREATE INDEX IF NOT EXISTS idx_clients_is_active ON public.clients(is_active);
CREATE INDEX IF NOT EXISTS idx_clients_legacy_id ON public.clients(legacy_id);

-- 2. CREAR TABLA USERS (estructura completa)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) NOT NULL UNIQUE,
    auth_id UUID REFERENCES auth.users(id),
    password_hash VARCHAR(255), -- Para usuarios que no usan Supabase Auth
    tax_id VARCHAR(20), -- RUT del usuario
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    maternal_surname VARCHAR(100), -- Apellido materno (Chile)
    full_name VARCHAR(300) GENERATED ALWAYS AS (
        CASE 
            WHEN maternal_surname IS NOT NULL THEN 
                first_name || ' ' || last_name || ' ' || maternal_surname
            ELSE 
                first_name || ' ' || last_name
        END
    ) STORED,
    client_id UUID REFERENCES public.clients(id),
    position VARCHAR(100), -- Cargo
    department VARCHAR(100),
    hire_date DATE,
    termination_date DATE,
    contract_type VARCHAR(50),
    establishment VARCHAR(100),
    birth_date DATE,
    gender VARCHAR(20),
    phone VARCHAR(20),
    address TEXT,
    user_type VARCHAR(50) DEFAULT 'employee', -- 'admin', 'employee', 'client'
    is_active BOOLEAN DEFAULT true,
    must_change_password BOOLEAN DEFAULT false,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    profile_photo_url TEXT,
    contract_url TEXT,
    id_card_url TEXT,
    internal_regulations_url TEXT,
    epp_url TEXT, -- Elementos de Protección Personal
    other_docs_url TEXT,
    last_login TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Campos legacy para migración
    legacy_user_id INTEGER,
    legacy_worker_id INTEGER
);

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON public.users(auth_id);
CREATE INDEX IF NOT EXISTS idx_users_client_id ON public.users(client_id);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON public.users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON public.users(user_type);

-- 3. FUNCIÓN PARA MIGRAR DATOS DE CLIENTE A CLIENTS
-- =====================================================

CREATE OR REPLACE FUNCTION migrate_cliente_to_clients()
RETURNS INTEGER AS $$
DECLARE
    migrated_count INTEGER := 0;
    cliente_record RECORD;
BEGIN
    -- Migrar datos de CLIENTE a clients
    FOR cliente_record IN 
        SELECT * FROM public."CLIENTE" 
        WHERE id_cliente IS NOT NULL
    LOOP
        INSERT INTO public.clients (
            legacy_id,
            tax_id,
            legal_name,
            email,
            phone,
            address,
            city,
            district,
            business_activity,
            activity_code,
            business_start_date,
            legal_representative,
            legal_rep_tax_id,
            logo_url
        ) VALUES (
            cliente_record.id_cliente,
            COALESCE(cliente_record.rut, ''),
            COALESCE(cliente_record.nombre_cliente, 'Sin nombre'),
            NULLIF(cliente_record.email, ''),
            NULLIF(cliente_record.telefono, ''),
            NULLIF(cliente_record.direccion, ''),
            NULLIF(cliente_record.ciudad, ''),
            NULLIF(cliente_record.comuna, ''),
            NULLIF(cliente_record.actividad, ''),
            NULLIF(cliente_record.codigo, ''),
            CASE 
                WHEN cliente_record.fec_ini_actividades IS NOT NULL 
                     AND cliente_record.fec_ini_actividades != '' 
                THEN cliente_record.fec_ini_actividades::DATE
                ELSE NULL
            END,
            NULLIF(cliente_record.representante_legal, ''),
            NULLIF(cliente_record.rut_represente, ''),
            NULLIF(cliente_record.logo, '')
        )
        ON CONFLICT (tax_id) DO NOTHING; -- Evitar duplicados
        
        migrated_count := migrated_count + 1;
    END LOOP;
    
    RETURN migrated_count;
END;
$$ LANGUAGE plpgsql;

-- 4. POLÍTICAS RLS (Row Level Security)
-- =====================================================

-- Habilitar RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Políticas para clients
CREATE POLICY "Users can view clients" ON public.clients
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert clients" ON public.clients
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update clients" ON public.clients
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete clients" ON public.clients
    FOR DELETE USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE auth_id = auth.uid() 
            AND user_type = 'admin'
        )
    );

-- Políticas para users
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (
        auth.uid() = auth_id OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE auth_id = auth.uid() 
            AND user_type IN ('admin', 'manager')
        )
    );

CREATE POLICY "Admins can manage users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE auth_id = auth.uid() 
            AND user_type = 'admin'
        )
    );

-- 5. TRIGGERS PARA UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clients_updated_at 
    BEFORE UPDATE ON public.clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE public.clients IS 'Tabla principal de clientes en inglés (reemplaza CLIENTE)';
COMMENT ON TABLE public.users IS 'Tabla de usuarios del sistema';
COMMENT ON COLUMN public.clients.legacy_id IS 'ID original de la tabla CLIENTE para migración';
COMMENT ON COLUMN public.clients.tax_id IS 'RUT del cliente (Chile)';
COMMENT ON COLUMN public.users.maternal_surname IS 'Apellido materno (específico para Chile)';

-- =====================================================
-- FIN DEL SCRIPT
-- ===================================================== 