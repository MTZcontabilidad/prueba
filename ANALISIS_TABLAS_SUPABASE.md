# 🔍 ANÁLISIS DE TABLAS SUPABASE - PROPUESTA DE UNIFICACIÓN EN INGLÉS

## 📊 ESTADO ACTUAL

### 1. **Problema Principal: Duplicación y Nomenclatura Mixta**

El sistema tiene múltiples tablas con propósitos similares y nombres mezclados español/inglés:

| Tabla Actual | Registros | Idioma | Propósito |
|--------------|-----------|---------|-----------|
| **CLIENTE** | 127 | Español (mayúsculas) | Tabla principal de clientes |
| **clientes** | 127 | Español | Duplicado de CLIENTE con más campos |
| **companies** | 134 | Inglés | Similar a clientes pero en inglés |
| **empresa** | 1 | Español | Información de empresa única |
| **empresas_contables** | - | Español | Empresas contables del sistema |

### 2. **Tablas de Usuarios Duplicadas**

| Tabla Actual | Registros | Propósito |
|--------------|-----------|-----------|
| **usuarios** | 127 | Usuarios del sistema (relacionado con CLIENTE) |
| **workers** | 71 | Trabajadores (relacionado con companies) |
| **profiles** | 2 | Perfiles de Supabase Auth |

### 3. **Otras Tablas con Nombres en Español**

- `documentos_tributarios` → Tax documents
- `proveedores` → Suppliers  
- `productos_servicios` → Products/Services
- `asientos_contables` → Accounting entries
- `plan_cuentas` → Chart of accounts
- `movimientos_bancarios` → Bank transactions
- `declaraciones_iva` → VAT declarations
- `periodos_contables` → Accounting periods

## 🎯 PROPUESTA DE UNIFICACIÓN

### 1. **Tabla Principal: `clients` (unificar CLIENTE + clientes + companies)**

```sql
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Identificación
    tax_id VARCHAR(20) NOT NULL UNIQUE, -- RUT/Tax ID
    legal_name VARCHAR(255) NOT NULL,   -- Razón social
    trade_name VARCHAR(255),            -- Nombre fantasía
    
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
    
    -- Información comercial
    business_activity TEXT,             -- Giro/Actividad
    activity_code VARCHAR(20),          -- Código actividad económica
    business_start_date DATE,           -- Fecha inicio actividades
    business_end_date DATE,             -- Fecha término giro
    
    -- Representante legal
    legal_representative VARCHAR(255),
    legal_rep_tax_id VARCHAR(20),
    
    -- Configuración
    client_type VARCHAR(20) DEFAULT 'company', -- company/individual
    is_vat_contributor BOOLEAN DEFAULT true,
    logo_url TEXT,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    -- Sistema MTZ
    mtz_client_id VARCHAR(50), -- ID del sistema MTZ legacy
    accounting_company_id UUID -- Empresa contable asignada
);
```

### 2. **Tabla de Usuarios: `users` (unificar usuarios + workers)**

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Autenticación
    email VARCHAR(255) NOT NULL UNIQUE,
    auth_id UUID REFERENCES auth.users(id),
    
    -- Información personal
    tax_id VARCHAR(20) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    
    -- Relación con cliente
    client_id UUID REFERENCES clients(id),
    
    -- Información laboral
    position VARCHAR(100),
    department VARCHAR(100),
    hire_date DATE,
    termination_date DATE,
    contract_type VARCHAR(50),
    
    -- Contacto
    phone VARCHAR(50),
    address TEXT,
    
    -- Configuración
    user_type VARCHAR(20), -- admin/accountant/client/employee
    is_active BOOLEAN DEFAULT true,
    must_change_password BOOLEAN DEFAULT false,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMPTZ,
    
    -- Metadata
    last_login TIMESTAMPTZ,
    last_login_ip INET,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. **Renombrar Tablas Principales**

| Tabla Actual | Nueva Tabla | Descripción |
|--------------|-------------|-------------|
| `documentos_tributarios` | `tax_documents` | Documentos tributarios |
| `proveedores` | `suppliers` | Proveedores |
| `productos_servicios` | `products_services` | Productos y servicios |
| `asientos_contables` | `accounting_entries` | Asientos contables |
| `plan_cuentas` | `chart_of_accounts` | Plan de cuentas |
| `movimientos_bancarios` | `bank_transactions` | Movimientos bancarios |
| `declaraciones_iva` | `vat_declarations` | Declaraciones IVA |
| `periodos_contables` | `accounting_periods` | Períodos contables |
| `comunas` | `districts` | Comunas/Distritos |
| `regiones` | `regions` | Regiones |
| `tipos_documento` | `document_types` | Tipos de documento |

### 4. **Estructura de Documentos Tributarios**

```sql
CREATE TABLE tax_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identificación del documento
    client_id UUID REFERENCES clients(id) NOT NULL,
    document_type_id INT REFERENCES document_types(id) NOT NULL,
    document_number BIGINT NOT NULL,
    folio VARCHAR(50),
    
    -- Fechas
    issue_date DATE NOT NULL,
    due_date DATE,
    
    -- Emisor
    issuer_tax_id VARCHAR(20) NOT NULL,
    issuer_name VARCHAR(255) NOT NULL,
    issuer_activity TEXT,
    issuer_address TEXT,
    
    -- Receptor
    receiver_tax_id VARCHAR(20) NOT NULL,
    receiver_name VARCHAR(255) NOT NULL,
    receiver_activity TEXT,
    receiver_address TEXT,
    
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
    
    -- Archivos y tracking
    xml_url TEXT,
    pdf_url TEXT,
    sii_track_id VARCHAR(100),
    sii_status VARCHAR(50),
    
    -- Metadata
    notes TEXT,
    reference JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(client_id, document_type_id, document_number, is_purchase)
);
```

## 📋 PLAN DE MIGRACIÓN

### Fase 1: Crear nuevas tablas en inglés
1. Crear todas las tablas nuevas con estructura mejorada
2. Mantener las tablas antiguas temporalmente

### Fase 2: Migrar datos
1. Migrar datos de `CLIENTE` + `clientes` + `companies` → `clients`
2. Migrar `usuarios` + `workers` → `users`
3. Migrar todas las demás tablas a sus equivalentes en inglés

### Fase 3: Actualizar aplicación
1. Actualizar todos los queries en el código
2. Actualizar tipos TypeScript
3. Probar exhaustivamente

### Fase 4: Limpieza
1. Eliminar tablas antiguas
2. Actualizar vistas y funciones

## 🔑 VENTAJAS DE LA UNIFICACIÓN

1. **Consistencia**: Todo en inglés, sin duplicados
2. **Mantenibilidad**: Estructura clara y única
3. **Escalabilidad**: Mejor diseño para crecer
4. **Performance**: Menos JOINs innecesarios
5. **Claridad**: Nombres descriptivos y estándar

## ⚠️ CONSIDERACIONES IMPORTANTES

1. **Backup completo** antes de cualquier migración
2. **Validar relaciones** entre tablas
3. **Actualizar políticas RLS**
4. **Migrar en ambiente de prueba primero**
5. **Plan de rollback** en caso de problemas

---

**Recomendación**: Implementar esta migración en un ambiente de desarrollo primero, validar completamente y luego aplicar en producción con un mantenimiento programado.
