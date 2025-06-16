// =====================================================
// TIPOS TYPESCRIPT PARA LAS NUEVAS TABLAS EN INGLÉS
// =====================================================

// Tipo base para timestamps
interface Timestamps {
  created_at: string;
  updated_at: string;
}

// Tipo base para UUID
type UUID = string;

// =====================================================
// TABLA: clients
// =====================================================
export interface Client extends Timestamps {
  id: UUID;
  
  // Identificación
  tax_id: string;                    // RUT/Tax ID
  legal_name: string;                // Razón social
  trade_name?: string;               // Nombre fantasía
  
  // Información de contacto
  email?: string;
  phone?: string;
  website?: string;
  
  // Dirección
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country: string;
  district_id?: number;
  
  // Información comercial
  business_activity?: string;        // Giro/Actividad
  activity_code?: string;            // Código actividad económica
  business_start_date?: string;      // Fecha inicio actividades
  business_end_date?: string;        // Fecha término giro
  
  // Representante legal
  legal_representative?: string;
  legal_rep_tax_id?: string;
  
  // Configuración
  client_type: 'company' | 'individual';
  is_vat_contributor: boolean;
  logo_url?: string;
  
  // Metadata
  is_active: boolean;
  notes?: string;
  created_by?: UUID;
  
  // Sistema MTZ legacy
  mtz_client_id?: string;
  accounting_company_id?: UUID;
  legacy_id?: number;
}

// =====================================================
// TABLA: users
// =====================================================
export interface User extends Timestamps {
  id: UUID;
  
  // Autenticación
  email: string;
  auth_id?: UUID;
  
  // Información personal
  tax_id?: string;
  first_name: string;
  last_name: string;
  maternal_surname?: string;
  full_name: string;
  
  // Relación con cliente
  client_id?: UUID;
  
  // Información laboral
  position?: string;
  department?: string;
  hire_date?: string;
  termination_date?: string;
  contract_type?: string;
  establishment?: string;
  
  // Información personal adicional
  birth_date?: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  address?: string;
  
  // Configuración y seguridad
  user_type?: 'admin' | 'accountant' | 'client' | 'employee';
  is_active: boolean;
  must_change_password: boolean;
  failed_login_attempts: number;
  locked_until?: string;
  
  // URLs de documentos
  profile_photo_url?: string;
  contract_url?: string;
  id_card_url?: string;
  internal_regulations_url?: string;
  epp_url?: string;
  other_docs_url?: string;
  
  // Metadata
  last_login?: string;
  last_login_ip?: string;
  settings: Record<string, any>;
  
  // Referencias legacy
  legacy_user_id?: number;
  legacy_worker_id?: number;
}

// =====================================================
// TABLA: document_types
// =====================================================
export interface DocumentType {
  id: number;
  code: string;
  name: string;
  description?: string;
  is_electronic: boolean;
  is_active: boolean;
}

// =====================================================
// TABLA: tax_documents
// =====================================================
export interface TaxDocument extends Timestamps {
  id: UUID;
  
  // Identificación del documento
  client_id: UUID;
  document_type_id: number;
  document_number: number;
  folio?: string;
  
  // Fechas
  issue_date: string;
  due_date?: string;
  accounting_date?: string;
  
  // Emisor
  issuer_tax_id: string;
  issuer_name: string;
  issuer_activity?: string;
  issuer_address?: string;
  issuer_district?: string;
  
  // Receptor
  receiver_tax_id: string;
  receiver_name: string;
  receiver_activity?: string;
  receiver_address?: string;
  receiver_district?: string;
  
  // Montos
  exempt_amount: number;
  net_amount: number;
  vat_amount: number;
  total_amount: number;
  
  // Estado y tipo
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  is_purchase: boolean;
  transaction_type?: string;
  payment_method?: string;
  payment_terms?: string;
  
  // Archivos y tracking SII
  xml_url?: string;
  pdf_url?: string;
  sii_track_id?: string;
  sii_status?: string;
  
  // Metadata
  notes?: string;
  reference?: Record<string, any>;
  created_by?: UUID;
  
  // Referencia legacy
  legacy_id?: number;
}

// =====================================================
// TABLA: suppliers
// =====================================================
export interface Supplier extends Timestamps {
  id: UUID;
  client_id?: UUID;
  
  // Identificación
  tax_id: string;
  legal_name: string;
  trade_name?: string;
  
  // Contacto
  contact_name?: string;
  phone?: string;
  email?: string;
  website?: string;
  
  // Dirección
  address?: string;
  city?: string;
  district?: string;
  
  // Clasificación
  supplier_type?: string;
  business_activity?: string;
  
  // Configuración
  is_active: boolean;
  payment_terms?: string;
  credit_limit?: number;
  
  // Metadata
  notes?: string;
  
  // Legacy
  legacy_id?: number;
}

// =====================================================
// TABLA: products_services
// =====================================================
export interface ProductService extends Timestamps {
  id: UUID;
  client_id?: UUID;
  
  // Identificación
  code?: string;
  name: string;
  description?: string;
  
  // Tipo y categoría
  type: 'product' | 'service';
  category?: string;
  
  // Precios
  unit_price?: number;
  cost?: number;
  
  // Inventario (solo productos)
  is_inventoriable: boolean;
  current_stock: number;
  minimum_stock: number;
  
  // Contabilidad
  income_account_id?: number;
  expense_account_id?: number;
  
  // Configuración
  is_active: boolean;
  
  // Legacy
  legacy_id?: number;
}

// =====================================================
// TABLA: chart_of_accounts
// =====================================================
export interface ChartOfAccount extends Timestamps {
  id: UUID;
  client_id?: UUID;
  
  // Identificación
  account_code: string;
  account_name: string;
  
  // Jerarquía
  parent_account_id?: UUID;
  level: number;
  
  // Tipo de cuenta
  account_type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  account_subtype?: string;
  
  // Configuración
  is_active: boolean;
  accepts_movements: boolean;
  requires_cost_center: boolean;
  requires_document: boolean;
  
  // Metadata
  description?: string;
  
  // Legacy
  legacy_id?: number;
}

// =====================================================
// TABLA: accounting_entries
// =====================================================
export interface AccountingEntry extends Timestamps {
  id: UUID;
  client_id: UUID;
  
  // Identificación
  entry_number: number;
  entry_date: string;
  accounting_period: string; // YYYY-MM
  
  // Tipo y descripción
  entry_type: string;
  description: string;
  
  // Referencias
  reference_type?: string;
  reference_id?: UUID;
  reference_number?: string;
  
  // Estado
  status: 'draft' | 'posted' | 'cancelled';
  is_closing_entry: boolean;
  is_adjustment_entry: boolean;
  
  // Metadata
  notes?: string;
  created_by?: UUID;
  posted_at?: string;
  posted_by?: UUID;
  
  // Legacy
  legacy_id?: number;
}

// =====================================================
// TABLA: accounting_entry_details
// =====================================================
export interface AccountingEntryDetail {
  id: UUID;
  entry_id: UUID;
  
  // Cuenta y montos
  account_id: UUID;
  debit_amount: number;
  credit_amount: number;
  
  // Información adicional
  description?: string;
  cost_center?: string;
  
  // Referencias
  document_type?: string;
  document_number?: string;
  document_date?: string;
  
  // Análisis
  analysis_code?: string;
  
  // Metadata
  line_number: number;
  created_at: string;
  
  // Legacy
  legacy_id?: number;
}

// =====================================================
// TABLA: bank_transactions
// =====================================================
export interface BankTransaction extends Timestamps {
  id: UUID;
  client_id: UUID;
  
  // Cuenta bancaria
  bank_account_id: UUID;
  
  // Información de la transacción
  transaction_date: string;
  value_date?: string;
  description: string;
  reference?: string;
  
  // Montos
  amount: number;
  balance?: number;
  
  // Tipo y categorización
  transaction_type?: 'deposit' | 'withdrawal' | 'transfer' | 'fee' | 'interest';
  category?: string;
  
  // Conciliación
  is_reconciled: boolean;
  reconciliation_date?: string;
  accounting_entry_id?: UUID;
  
  // Metadata
  notes?: string;
  imported_at?: string;
  
  // Legacy
  legacy_id?: number;
}

// =====================================================
// TIPOS DE FORMULARIOS Y DTOs
// =====================================================

// Formulario para crear/editar cliente
export interface ClientFormData {
  tax_id: string;
  legal_name: string;
  trade_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  district_id?: number;
  business_activity?: string;
  activity_code?: string;
  business_start_date?: string;
  legal_representative?: string;
  legal_rep_tax_id?: string;
  client_type?: 'company' | 'individual';
  is_vat_contributor?: boolean;
  notes?: string;
}

// Formulario para crear/editar usuario
export interface UserFormData {
  email: string;
  tax_id?: string;
  first_name: string;
  last_name: string;
  maternal_surname?: string;
  phone?: string;
  position?: string;
  department?: string;
  user_type?: 'admin' | 'accountant' | 'client' | 'employee';
  client_id?: UUID;
}

// Formulario para documento tributario
export interface TaxDocumentFormData {
  document_type_id: number;
  document_number: number;
  folio?: string;
  issue_date: string;
  due_date?: string;
  issuer_tax_id: string;
  issuer_name: string;
  receiver_tax_id: string;
  receiver_name: string;
  net_amount: number;
  vat_amount: number;
  total_amount: number;
  is_purchase: boolean;
  payment_method?: string;
  notes?: string;
}

// =====================================================
// TIPOS DE RESPUESTA DE API
// =====================================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// =====================================================
// TIPOS DE FILTROS
// =====================================================

export interface ClientFilters {
  search?: string;
  city?: string;
  client_type?: 'company' | 'individual';
  is_active?: boolean;
  has_email?: boolean;
  has_phone?: boolean;
}

export interface TaxDocumentFilters {
  client_id?: UUID;
  document_type_id?: number;
  date_from?: string;
  date_to?: string;
  status?: string;
  is_purchase?: boolean;
}

export interface UserFilters {
  search?: string;
  client_id?: UUID;
  user_type?: string;
  is_active?: boolean;
}

// =====================================================
// ENUMS Y CONSTANTES
// =====================================================

export const USER_TYPES = {
  ADMIN: 'admin',
  ACCOUNTANT: 'accountant',
  CLIENT: 'client',
  EMPLOYEE: 'employee'
} as const;

export const DOCUMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
} as const;

export const ACCOUNT_TYPES = {
  ASSET: 'asset',
  LIABILITY: 'liability',
  EQUITY: 'equity',
  INCOME: 'income',
  EXPENSE: 'expense'
} as const;

export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  TRANSFER: 'transfer',
  FEE: 'fee',
  INTEREST: 'interest'
} as const;

// =====================================================
// TIPOS DE BASE DE DATOS (Database)
// =====================================================

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: Client;
        Insert: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'full_name'>;
        Update: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at' | 'full_name'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      tax_documents: {
        Row: TaxDocument;
        Insert: Omit<TaxDocument, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TaxDocument, 'id' | 'created_at' | 'updated_at'>>;
      };
      suppliers: {
        Row: Supplier;
        Insert: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Supplier, 'id' | 'created_at' | 'updated_at'>>;
      };
      products_services: {
        Row: ProductService;
        Insert: Omit<ProductService, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ProductService, 'id' | 'created_at' | 'updated_at'>>;
      };
      chart_of_accounts: {
        Row: ChartOfAccount;
        Insert: Omit<ChartOfAccount, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ChartOfAccount, 'id' | 'created_at' | 'updated_at'>>;
      };
      accounting_entries: {
        Row: AccountingEntry;
        Insert: Omit<AccountingEntry, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AccountingEntry, 'id' | 'created_at' | 'updated_at'>>;
      };
      bank_transactions: {
        Row: BankTransaction;
        Insert: Omit<BankTransaction, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<BankTransaction, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Views: {
      // Agregar vistas según necesidad
    };
    Functions: {
      // Agregar funciones según necesidad
    };
    Enums: {
      user_type: 'admin' | 'accountant' | 'client' | 'employee';
      client_type: 'company' | 'individual';
      document_status: 'pending' | 'approved' | 'rejected' | 'cancelled';
      account_type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
      transaction_type: 'deposit' | 'withdrawal' | 'transfer' | 'fee' | 'interest';
    };
  };
};
