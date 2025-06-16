-- =====================================================
-- SCRIPT DE MIGRACIÓN: UNIFICACIÓN DE TABLAS A INGLÉS
-- =====================================================
-- IMPORTANTE: Ejecutar en ambiente de desarrollo primero
-- Hacer backup completo antes de ejecutar en producción
-- =====================================================

-- FASE 1: CREAR NUEVAS TABLAS
-- =====================================================

-- 1. Tabla principal de clientes (unifica CLIENTE + clientes + companies)
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identificación
    tax_id VARCHAR(20) NOT NULL UNIQUE,
    legal_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    
    -- Información de contacto
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),
    
    -- Dirección
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(2) DEFAULT 'CL',
    district_id INT, -- comuna_id
    
    -- Información comercial
    business_activity TEXT,
    activity_code VARCHAR(20),
    business_start_date DATE,
    business_end_date DATE,
    
    -- Representante legal
    legal_representative VARCHAR(255),
    legal_rep_tax_id VARCHAR(20),
    
    -- Configuración
    client_type VARCHAR(20) DEFAULT 'company',
    is_vat_contributor BOOLEAN DEFAULT true,
    logo_url TEXT,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    
    -- Sistema MTZ legacy
    mtz_client_id VARCHAR(50),
    accounting_company_id UUID,
    legacy_id BIGINT -- Para mantener referencia al id original
);

-- 2. Tabla unificada de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Autenticación
    email VARCHAR(255) NOT NULL UNIQUE,
    auth_id UUID,
    password_hash TEXT, -- Solo para usuarios legacy
    
    -- Información personal
    tax_id VARCHAR(20) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    maternal_surname VARCHAR(100),
    full_name VARCHAR(255) GENERATED ALWAYS AS 
        (first_name || ' ' || last_name || COALESCE(' ' || maternal_surname, '')) STORED,
    
    -- Relación con cliente
    client_id UUID REFERENCES clients(id),
    
    -- Información laboral
    position VARCHAR(100),
    department VARCHAR(100),
    hire_date DATE,
    termination_date DATE,
    contract_type VARCHAR(50),
    establishment VARCHAR(100),
    
    -- Información personal adicional
    birth_date DATE,
    gender VARCHAR(10),
    phone VARCHAR(50),
    address TEXT,
    
    -- Configuración y seguridad
    user_type VARCHAR(20), -- admin/accountant/client/employee
    is_active BOOLEAN DEFAULT true,
    must_change_password BOOLEAN DEFAULT false,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMPTZ,
    
    -- URLs de documentos
    profile_photo_url TEXT,
    contract_url TEXT,
    id_card_url TEXT,
    internal_regulations_url TEXT,
    epp_url TEXT,
    other_docs_url TEXT,
    
    -- Metadata
    last_login TIMESTAMPTZ,
    last_login_ip INET,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Referencias legacy
    legacy_user_id BIGINT,
    legacy_worker_id INT
);

-- 3. Tipos de documentos
CREATE TABLE IF NOT EXISTS document_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_electronic BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true
);

-- 4. Documentos tributarios
CREATE TABLE IF NOT EXISTS tax_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identificación del documento
    client_id UUID REFERENCES clients(id) NOT NULL,
    document_type_id INT REFERENCES document_types(id) NOT NULL,
    document_number BIGINT NOT NULL,
    folio VARCHAR(50),
    
    -- Fechas
    issue_date DATE NOT NULL,
    due_date DATE,
    accounting_date DATE,
    
    -- Emisor
    issuer_tax_id VARCHAR(20) NOT NULL,
    issuer_name VARCHAR(255) NOT NULL,
    issuer_activity TEXT,
    issuer_address TEXT,
    issuer_district VARCHAR(100),
    
    -- Receptor
    receiver_tax_id VARCHAR(20) NOT NULL,
    receiver_name VARCHAR(255) NOT NULL,
    receiver_activity TEXT,
    receiver_address TEXT,
    receiver_district VARCHAR(100),
    
    -- Montos
    exempt_amount DECIMAL(15,2) DEFAULT 0,
    net_amount DECIMAL(15,2) DEFAULT 0,
    vat_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    
    -- Estado y tipo
    status VARCHAR(20) DEFAULT 'pending',
    is_purchase BOOLEAN NOT NULL DEFAULT false,
    transaction_type VARCHAR(20),
    payment_method VARCHAR(50),
    payment_terms VARCHAR(50),
    
    -- Archivos y tracking SII
    xml_url TEXT,
    pdf_url TEXT,
    sii_track_id VARCHAR(100),
    sii_status VARCHAR(50),
    
    -- Metadata
    notes TEXT,
    reference JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    
    -- Referencia legacy
    legacy_id BIGINT,
    
    UNIQUE(client_id, document_type_id, document_number, is_purchase)
);

-- 5. Proveedores
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id),
    
    -- Identificación
    tax_id VARCHAR(20) NOT NULL,
    legal_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    
    -- Contacto
    contact_name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    
    -- Dirección
    address TEXT,
    city VARCHAR(100),
    district VARCHAR(100),
    
    -- Clasificación
    supplier_type VARCHAR(50),
    business_activity VARCHAR(255),
    
    -- Configuración
    is_active BOOLEAN DEFAULT true,
    payment_terms VARCHAR(50),
    credit_limit DECIMAL(15,2),
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Legacy
    legacy_id BIGINT,
    
    UNIQUE(client_id, tax_id)
);

-- 6. Productos y servicios
CREATE TABLE IF NOT EXISTS products_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id),
    
    -- Identificación
    code VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Tipo y categoría
    type VARCHAR(20) NOT NULL CHECK (type IN ('product', 'service')),
    category VARCHAR(100),
    
    -- Precios
    unit_price DECIMAL(15,2),
    cost DECIMAL(15,2),
    
    -- Inventario (solo productos)
    is_inventoriable BOOLEAN DEFAULT false,
    current_stock INT DEFAULT 0,
    minimum_stock INT DEFAULT 0,
    
    -- Contabilidad
    income_account_id BIGINT,
    expense_account_id BIGINT,
    
    -- Configuración
    is_active BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Legacy
    legacy_id BIGINT,
    
    UNIQUE(client_id, code)
);

-- 7. Plan de cuentas
CREATE TABLE IF NOT EXISTS chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id),
    
    -- Identificación
    account_code VARCHAR(20) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    
    -- Jerarquía
    parent_account_id UUID REFERENCES chart_of_accounts(id),
    level INT NOT NULL DEFAULT 1,
    
    -- Tipo de cuenta
    account_type VARCHAR(50) NOT NULL, -- asset, liability, equity, income, expense
    account_subtype VARCHAR(50),
    
    -- Configuración
    is_active BOOLEAN DEFAULT true,
    accepts_movements BOOLEAN DEFAULT true,
    requires_cost_center BOOLEAN DEFAULT false,
    requires_document BOOLEAN DEFAULT false,
    
    -- Metadata
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Legacy
    legacy_id BIGINT,
    
    UNIQUE(client_id, account_code)
);

-- 8. Asientos contables
CREATE TABLE IF NOT EXISTS accounting_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) NOT NULL,
    
    -- Identificación
    entry_number BIGINT NOT NULL,
    entry_date DATE NOT NULL,
    accounting_period VARCHAR(7) NOT NULL, -- YYYY-MM
    
    -- Tipo y descripción
    entry_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    
    -- Referencias
    reference_type VARCHAR(50),
    reference_id UUID,
    reference_number VARCHAR(50),
    
    -- Estado
    status VARCHAR(20) DEFAULT 'draft', -- draft, posted, cancelled
    is_closing_entry BOOLEAN DEFAULT false,
    is_adjustment_entry BOOLEAN DEFAULT false,
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    posted_at TIMESTAMPTZ,
    posted_by UUID,
    
    -- Legacy
    legacy_id BIGINT,
    
    UNIQUE(client_id, entry_number)
);

-- 9. Detalle de asientos
CREATE TABLE IF NOT EXISTS accounting_entry_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id UUID REFERENCES accounting_entries(id) NOT NULL,
    
    -- Cuenta y montos
    account_id UUID REFERENCES chart_of_accounts(id) NOT NULL,
    debit_amount DECIMAL(15,2) DEFAULT 0,
    credit_amount DECIMAL(15,2) DEFAULT 0,
    
    -- Información adicional
    description TEXT,
    cost_center VARCHAR(50),
    
    -- Referencias
    document_type VARCHAR(50),
    document_number VARCHAR(50),
    document_date DATE,
    
    -- Análisis
    analysis_code VARCHAR(50),
    
    -- Metadata
    line_number INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Legacy
    legacy_id BIGINT,
    
    CONSTRAINT check_amounts CHECK (
        (debit_amount > 0 AND credit_amount = 0) OR 
        (debit_amount = 0 AND credit_amount > 0)
    )
);

-- 10. Movimientos bancarios
CREATE TABLE IF NOT EXISTS bank_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) NOT NULL,
    
    -- Cuenta bancaria
    bank_account_id UUID NOT NULL,
    
    -- Información de la transacción
    transaction_date DATE NOT NULL,
    value_date DATE,
    description TEXT NOT NULL,
    reference VARCHAR(100),
    
    -- Montos
    amount DECIMAL(15,2) NOT NULL,
    balance DECIMAL(15,2),
    
    -- Tipo y categorización
    transaction_type VARCHAR(50), -- deposit, withdrawal, transfer, fee, interest
    category VARCHAR(100),
    
    -- Conciliación
    is_reconciled BOOLEAN DEFAULT false,
    reconciliation_date DATE,
    accounting_entry_id UUID REFERENCES accounting_entries(id),
    
    -- Metadata
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    imported_at TIMESTAMPTZ,
    
    -- Legacy
    legacy_id BIGINT,
    
    UNIQUE(bank_account_id, transaction_date, reference)
);

-- FASE 2: MIGRACIÓN DE DATOS
-- =====================================================

-- Migrar datos de CLIENTE + clientes + companies a clients
INSERT INTO clients (
    tax_id,
    legal_name,
    trade_name,
    email,
    phone,
    address,
    city,
    district_id,
    business_activity,
    activity_code,
    business_start_date,
    legal_representative,
    legal_rep_tax_id,
    logo_url,
    is_active,
    notes,
    created_at,
    updated_at,
    mtz_client_id,
    legacy_id
)
SELECT DISTINCT ON (COALESCE(c1.rut, c2.rut, co.rut))
    COALESCE(c1.rut, c2.rut, co.rut) as tax_id,
    COALESCE(c1.nombre_cliente, c2.razon_social, co.name) as legal_name,
    COALESCE(c2.nombre_fantasia, co.name) as trade_name,
    COALESCE(c1.email, c2.email, co.email) as email,
    COALESCE(c1.telefono, c2.telefono, co.phone) as phone,
    COALESCE(c1.direccion, c2.direccion, co.address) as address,
    COALESCE(c1.ciudad, c2.comuna_id::text) as city,
    c2.comuna_id as district_id,
    COALESCE(c1.actividad, c2.giro) as business_activity,
    COALESCE(c1.codigo, c2.codigo_actividad_economica) as activity_code,
    COALESCE(c1.fec_ini_actividades::date, c2.fecha_inicio_actividades) as business_start_date,
    COALESCE(c1.representante_legal, co.legal_representative) as legal_representative,
    c1.rut_represente as legal_rep_tax_id,
    COALESCE(c1.logo, c2.logo_url) as logo_url,
    COALESCE(c2.activo, true) as is_active,
    c2.observaciones as notes,
    COALESCE(c2.created_at, co.created_at, NOW()) as created_at,
    COALESCE(c2.updated_at, co.updated_at, NOW()) as updated_at,
    co.client_id as mtz_client_id,
    c1.id_cliente as legacy_id
FROM "CLIENTE" c1
FULL OUTER JOIN clientes c2 ON c1.rut = c2.rut
FULL OUTER JOIN companies co ON c1.rut = co.rut OR c2.rut = co.rut
WHERE c1.rut IS NOT NULL OR c2.rut IS NOT NULL OR co.rut IS NOT NULL;

-- Migrar usuarios + workers a users
INSERT INTO users (
    email,
    tax_id,
    first_name,
    last_name,
    maternal_surname,
    client_id,
    position,
    department,
    hire_date,
    termination_date,
    contract_type,
    establishment,
    birth_date,
    gender,
    phone,
    address,
    user_type,
    is_active,
    password_hash,
    must_change_password,
    failed_login_attempts,
    locked_until,
    last_login,
    last_login_ip,
    profile_photo_url,
    contract_url,
    id_card_url,
    created_at,
    updated_at,
    legacy_user_id,
    legacy_worker_id
)
-- Primero usuarios
SELECT 
    u.email,
    u.rut as tax_id,
    SPLIT_PART(p.nombre, ' ', 1) as first_name,
    SPLIT_PART(p.nombre, ' ', 2) as last_name,
    SPLIT_PART(p.nombre, ' ', 3) as maternal_surname,
    (SELECT id FROM clients WHERE legacy_id = u.id_cliente LIMIT 1) as client_id,
    NULL as position,
    NULL as department,
    NULL as hire_date,
    NULL as termination_date,
    NULL as contract_type,
    NULL as establishment,
    NULL as birth_date,
    NULL as gender,
    p.telefono as phone,
    p.direccion as address,
    u.tipo as user_type,
    u.activo as is_active,
    u.password_hash,
    u.debe_cambiar_password as must_change_password,
    u.intentos_fallidos as failed_login_attempts,
    u.bloqueado_hasta as locked_until,
    u.last_login,
    u.ip_ultimo_acceso as last_login_ip,
    NULL as profile_photo_url,
    NULL as contract_url,
    NULL as id_card_url,
    u.created_at,
    u.updated_at,
    u.id as legacy_user_id,
    NULL as legacy_worker_id
FROM usuarios u
LEFT JOIN personas p ON u.persona_id = p.id
UNION ALL
-- Luego workers
SELECT
    w.email,
    w.rut as tax_id,
    w.first_name,
    w.paternal_surname as last_name,
    w.maternal_surname,
    w.company_id as client_id,
    w.position,
    w.department,
    w.hire_date,
    w.termination_date,
    w.contract_type,
    w.establishment,
    w.birth_date,
    w.gender,
    w.phone,
    w.address,
    'employee' as user_type,
    CASE WHEN w.status = 'active' THEN true ELSE false END as is_active,
    NULL as password_hash,
    false as must_change_password,
    0 as failed_login_attempts,
    NULL as locked_until,
    NULL as last_login,
    NULL as last_login_ip,
    w.profile_photo_url,
    w.contract_url,
    w.id_card_url,
    w.created_at,
    w.updated_at,
    NULL as legacy_user_id,
    w.id as legacy_worker_id
FROM workers w;

-- Migrar tipos de documento
INSERT INTO document_types (code, name, description)
SELECT DISTINCT 
    codigo,
    nombre,
    descripcion
FROM tipos_documento
WHERE NOT EXISTS (
    SELECT 1 FROM document_types dt WHERE dt.code = tipos_documento.codigo
);

-- Migrar documentos tributarios
INSERT INTO tax_documents (
    client_id,
    document_type_id,
    document_number,
    folio,
    issue_date,
    due_date,
    issuer_tax_id,
    issuer_name,
    issuer_activity,
    issuer_address,
    issuer_district,
    receiver_tax_id,
    receiver_name,
    receiver_activity,
    receiver_address,
    receiver_district,
    exempt_amount,
    net_amount,
    vat_amount,
    total_amount,
    status,
    is_purchase,
    transaction_type,
    payment_method,
    payment_terms,
    xml_url,
    pdf_url,
    sii_track_id,
    sii_status,
    notes,
    reference,
    created_at,
    updated_at,
    legacy_id
)
SELECT
    (SELECT id FROM clients WHERE legacy_id = dt.cliente_id LIMIT 1) as client_id,
    dt.tipo_documento_id as document_type_id,
    dt.numero as document_number,
    dt.folio,
    dt.fecha_emision as issue_date,
    dt.fecha_vencimiento as due_date,
    dt.rut_emisor as issuer_tax_id,
    dt.razon_social_emisor as issuer_name,
    dt.giro_emisor as issuer_activity,
    dt.direccion_emisor as issuer_address,
    dt.comuna_emisor as issuer_district,
    dt.rut_receptor as receiver_tax_id,
    dt.razon_social_receptor as receiver_name,
    dt.giro_receptor as receiver_activity,
    dt.direccion_receptor as receiver_address,
    dt.comuna_receptor as receiver_district,
    dt.monto_exento as exempt_amount,
    dt.monto_neto as net_amount,
    dt.monto_iva as vat_amount,
    dt.monto_total as total_amount,
    dt.estado as status,
    dt.es_compra as is_purchase,
    dt.tipo_transaccion as transaction_type,
    dt.forma_pago as payment_method,
    dt.condicion_pago as payment_terms,
    dt.xml_url,
    dt.pdf_url,
    dt.sii_track_id,
    dt.sii_estado as sii_status,
    dt.observaciones as notes,
    dt.referencia as reference,
    dt.created_at,
    dt.updated_at,
    dt.id as legacy_id
FROM documentos_tributarios dt;

-- FASE 3: CREAR ÍNDICES
-- =====================================================

-- Índices para clients
CREATE INDEX idx_clients_tax_id ON clients(tax_id);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_active ON clients(is_active);
CREATE INDEX idx_clients_created_at ON clients(created_at);

-- Índices para users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tax_id ON users(tax_id);
CREATE INDEX idx_users_client_id ON users(client_id);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_users_type ON users(user_type);

-- Índices para tax_documents
CREATE INDEX idx_tax_documents_client_id ON tax_documents(client_id);
CREATE INDEX idx_tax_documents_issue_date ON tax_documents(issue_date);
CREATE INDEX idx_tax_documents_status ON tax_documents(status);
CREATE INDEX idx_tax_documents_is_purchase ON tax_documents(is_purchase);

-- FASE 4: CREAR POLÍTICAS RLS
-- =====================================================

-- Habilitar RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas para clients
CREATE POLICY "Users can view their own client" ON clients
    FOR SELECT USING (
        id IN (
            SELECT client_id FROM users WHERE auth_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all clients" ON clients
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth_id = auth.uid() 
            AND user_type = 'admin'
        )
    );

-- Políticas para users
CREATE POLICY "Users can view themselves" ON users
    FOR SELECT USING (auth_id = auth.uid());

CREATE POLICY "Users can view colleagues" ON users
    FOR SELECT USING (
        client_id IN (
            SELECT client_id FROM users WHERE auth_id = auth.uid()
        )
    );

-- Políticas para tax_documents
CREATE POLICY "Users can view their client documents" ON tax_documents
    FOR SELECT USING (
        client_id IN (
            SELECT client_id FROM users WHERE auth_id = auth.uid()
        )
    );

-- FASE 5: ACTUALIZAR FOREIGN KEYS
-- =====================================================

-- Actualizar referencias en otras tablas
-- (Agregar según necesidad específica del sistema)

-- FASE 6: CREAR VISTAS DE COMPATIBILIDAD (TEMPORAL)
-- =====================================================

-- Vista para mantener compatibilidad con CLIENTE
CREATE OR REPLACE VIEW "CLIENTE" AS
SELECT 
    legacy_id as id_cliente,
    legal_name as nombre_cliente,
    tax_id as rut,
    address as direccion,
    city as ciudad,
    district_id::text as comuna,
    phone as telefono,
    email,
    business_start_date::text as fec_ini_actividades,
    business_activity as actividad,
    activity_code as codigo,
    legal_representative as representante_legal,
    legal_rep_tax_id as rut_represente,
    logo_url as logo
FROM clients
WHERE legacy_id IS NOT NULL;

-- Vista para mantener compatibilidad con usuarios
CREATE OR REPLACE VIEW usuarios_legacy AS
SELECT
    legacy_user_id as id,
    tax_id as rut,
    password_hash,
    user_type as tipo,
    NULL as id_referencia,
    (SELECT legacy_id FROM clients WHERE id = users.client_id) as id_cliente,
    email,
    is_active as activo,
    created_at,
    updated_at,
    last_login,
    NULL as persona_id,
    must_change_password as debe_cambiar_password,
    failed_login_attempts as intentos_fallidos,
    locked_until as bloqueado_hasta,
    last_login_ip as ip_ultimo_acceso,
    settings as configuracion
FROM users
WHERE legacy_user_id IS NOT NULL;

-- FASE 7: VALIDACIÓN
-- =====================================================

-- Verificar que la migración fue exitosa
SELECT 
    'clients' as table_name,
    COUNT(*) as record_count,
    COUNT(DISTINCT tax_id) as unique_tax_ids
FROM clients
UNION ALL
SELECT 
    'users',
    COUNT(*),
    COUNT(DISTINCT COALESCE(email, tax_id))
FROM users
UNION ALL
SELECT 
    'tax_documents',
    COUNT(*),
    COUNT(DISTINCT document_number)
FROM tax_documents;

-- Verificar integridad referencial
SELECT 
    'Clients sin usuarios' as check_type,
    COUNT(*) as count
FROM clients c
WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.client_id = c.id)
UNION ALL
SELECT 
    'Documentos sin cliente',
    COUNT(*)
FROM tax_documents td
WHERE client_id IS NULL;

-- =====================================================
-- FIN DEL SCRIPT DE MIGRACIÓN
-- =====================================================
-- IMPORTANTE: 
-- 1. Revisar los resultados de validación
-- 2. Actualizar el código de la aplicación
-- 3. Probar exhaustivamente
-- 4. Una vez validado, eliminar tablas legacy
-- =====================================================
