// Tipos generados automáticamente de Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Tipos base para las nuevas tablas en inglés
export interface Database {
  public: {
    Tables: {
      // Nueva tabla clients (reemplaza CLIENTE)
      clients: {
        Row: {
          id: string
          tax_id: string
          legal_name: string
          trade_name: string | null
          email: string | null
          phone: string | null
          website: string | null
          address: string | null
          city: string | null
          state: string | null
          postal_code: string | null
          country: string
          district_id: number | null
          business_activity: string | null
          activity_code: string | null
          business_start_date: string | null
          business_end_date: string | null
          legal_representative: string | null
          legal_rep_tax_id: string | null
          client_type: string
          is_vat_contributor: boolean
          logo_url: string | null
          is_active: boolean
          notes: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          mtz_client_id: string | null
          accounting_company_id: string | null
          legacy_id: number | null
        }
        Insert: Omit<Database['public']['Tables']['clients']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
      }
      
      // Nueva tabla users (reemplaza usuarios)
      users: {
        Row: {
          id: string
          email: string
          auth_id: string | null
          password_hash: string | null
          tax_id: string | null
          first_name: string
          last_name: string
          maternal_surname: string | null
          full_name: string
          client_id: string | null
          position: string | null
          department: string | null
          hire_date: string | null
          termination_date: string | null
          contract_type: string | null
          establishment: string | null
          birth_date: string | null
          gender: string | null
          phone: string | null
          address: string | null
          user_type: string | null
          is_active: boolean
          must_change_password: boolean
          failed_login_attempts: number
          locked_until: string | null
          profile_photo_url: string | null
          contract_url: string | null
          id_card_url: string | null
          internal_regulations_url: string | null
          epp_url: string | null
          other_docs_url: string | null
          last_login: string | null
          last_login_ip: string | null
          settings: Json
          created_at: string
          updated_at: string
          legacy_user_id: number | null
          legacy_worker_id: number | null
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'full_name' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      
      // Tabla legacy CLIENTE (para compatibilidad)
      CLIENTE: {
        Row: {
          id_cliente: number
          nombre_cliente: string | null
          rut: string | null
          direccion: string | null
          ciudad: string | null
          comuna: string | null
          telefono: string | null
          email: string | null
          fec_ini_actividades: string | null
          actividad: string | null
          codigo: string | null
          representante_legal: string | null
          rut_represente: string | null
          logo: string | null
        }
        Insert: Database['public']['Tables']['CLIENTE']['Row']
        Update: Partial<Database['public']['Tables']['CLIENTE']['Row']>
      }
      
      // Otras tablas necesarias
      document_types: {
        Row: {
          id: number
          code: string
          name: string
          description: string | null
          is_electronic: boolean
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['document_types']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['document_types']['Insert']>
      }
      
      tax_documents: {
        Row: {
          id: string
          client_id: string
          document_type_id: number
          document_number: number
          folio: string | null
          issue_date: string
          due_date: string | null
          accounting_date: string | null
          issuer_tax_id: string
          issuer_name: string
          issuer_activity: string | null
          issuer_address: string | null
          issuer_district: string | null
          receiver_tax_id: string
          receiver_name: string
          receiver_activity: string | null
          receiver_address: string | null
          receiver_district: string | null
          exempt_amount: number
          net_amount: number
          vat_amount: number
          total_amount: number
          status: string
          is_purchase: boolean
          transaction_type: string | null
          payment_method: string | null
          payment_terms: string | null
          xml_url: string | null
          pdf_url: string | null
          sii_track_id: string | null
          sii_status: string | null
          notes: string | null
          reference: Json | null
          created_at: string
          updated_at: string
          created_by: string | null
          legacy_id: number | null
        }
        Insert: Omit<Database['public']['Tables']['tax_documents']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tax_documents']['Insert']>
      }
      
      suppliers: {
        Row: {
          id: string
          client_id: string | null
          tax_id: string
          legal_name: string
          trade_name: string | null
          contact_name: string | null
          phone: string | null
          email: string | null
          website: string | null
          address: string | null
          city: string | null
          district: string | null
          supplier_type: string | null
          business_activity: string | null
          is_active: boolean
          payment_terms: string | null
          credit_limit: number | null
          notes: string | null
          created_at: string
          updated_at: string
          legacy_id: number | null
        }
        Insert: Omit<Database['public']['Tables']['suppliers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['suppliers']['Insert']>
      }
      
      products_services: {
        Row: {
          id: string
          client_id: string | null
          code: string | null
          name: string
          description: string | null
          type: 'product' | 'service'
          category: string | null
          unit_price: number | null
          cost: number | null
          is_inventoriable: boolean
          current_stock: number
          minimum_stock: number
          income_account_id: number | null
          expense_account_id: number | null
          is_active: boolean
          created_at: string
          updated_at: string
          legacy_id: number | null
        }
        Insert: Omit<Database['public']['Tables']['products_services']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products_services']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Tipos simplificados para uso en la aplicación
export type Client = Database['public']['Tables']['clients']['Row']
export type ClientInsert = Database['public']['Tables']['clients']['Insert']
export type ClientUpdate = Database['public']['Tables']['clients']['Update']

export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

// Tipo legacy para compatibilidad temporal
export type Cliente = Database['public']['Tables']['CLIENTE']['Row']
