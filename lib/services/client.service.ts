import { createClient } from '@/lib/supabase/client';
import { Client, ClientInsert, ClientUpdate } from '@/lib/supabase/types';

export class ClientService {
  /**
   * Obtener todos los clientes con filtros opcionales
   */
  static async getAll(filters?: {
    searchTerm?: string;
    city?: string;
    activity?: string;
    page?: number;
    perPage?: number;
  }) {
    const supabase = createClient();
    let query = supabase.from('clients').select('*', { count: 'exact' });

    // Aplicar filtros
    if (filters?.searchTerm) {
      query = query.or(
        `legal_name.ilike.%${filters.searchTerm}%,tax_id.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%`
      );
    }

    if (filters?.city && filters.city !== 'all') {
      query = query.eq('city', filters.city);
    }

    if (filters?.activity && filters.activity !== 'all') {
      query = query.eq('business_activity', filters.activity);
    }

    // Solo clientes activos por defecto
    query = query.eq('is_active', true);

    // Ordenar por fecha de creación descendente
    query = query.order('created_at', { ascending: false });

    // Paginación
    if (filters?.page && filters?.perPage) {
      const from = (filters.page - 1) * filters.perPage;
      const to = from + filters.perPage - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page: filters?.page || 1,
      perPage: filters?.perPage || 20,
      totalPages: Math.ceil((count || 0) / (filters?.perPage || 20))
    };
  }

  /**
   * Obtener un cliente por ID
   */
  static async getById(id: string): Promise<Client | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Crear un nuevo cliente
   */
  static async create(clientData: ClientInsert): Promise<Client> {
    const supabase = createClient();
    
    // Preparar datos con valores por defecto
    const dataToInsert: ClientInsert = {
      ...clientData,
      is_active: true,
      client_type: clientData.client_type || 'company',
      is_vat_contributor: clientData.is_vat_contributor ?? true,
      country: clientData.country || 'CL'
    };

    const { data, error } = await supabase
      .from('clients')
      .insert(dataToInsert)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Actualizar un cliente existente
   */
  static async update(id: string, clientData: ClientUpdate): Promise<Client> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('clients')
      .update({
        ...clientData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Eliminar un cliente (soft delete)
   */
  static async delete(id: string): Promise<void> {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('clients')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Exportar clientes a CSV
   */
  static async exportToCSV(): Promise<string> {
    const { data } = await this.getAll({ perPage: 10000 });
    
    if (!data || data.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    const headers = [
      'RUT',
      'Razón Social',
      'Nombre Fantasía',
      'Email',
      'Teléfono',
      'Dirección',
      'Ciudad',
      'Actividad',
      'Representante Legal',
      'Fecha Inicio Actividades'
    ];

    const rows = data.map(client => [
      client.tax_id || '',
      client.legal_name || '',
      client.trade_name || '',
      client.email || '',
      client.phone || '',
      client.address || '',
      client.city || '',
      client.business_activity || '',
      client.legal_representative || '',
      client.business_start_date || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(cell => {
          // Escapar valores que contengan comas o comillas
          if (cell.includes(',') || cell.includes('"')) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        }).join(',')
      )
    ].join('\n');

    return '\ufeff' + csvContent; // BOM para UTF-8
  }

  /**
   * Obtener estadísticas de clientes
   */
  static async getStats() {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    const clients = data || [];
    
    return {
      total: clients.length,
      withEmail: clients.filter(c => c.email && c.email.trim() !== '').length,
      withPhone: clients.filter(c => c.phone && c.phone.trim() !== '').length,
      cities: [...new Set(clients.map(c => c.city).filter(Boolean))],
      activities: [...new Set(clients.map(c => c.business_activity).filter(Boolean))]
    };
  }

  /**
   * Verificar si existe un cliente con el RUT dado
   */
  static async existsByTaxId(taxId: string, excludeId?: string): Promise<boolean> {
    const supabase = createClient();
    
    let query = supabase
      .from('clients')
      .select('id')
      .eq('tax_id', taxId);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data && data.length > 0);
  }

  /**
   * Buscar clientes por término
   */
  static async search(term: string, limit: number = 10): Promise<Client[]> {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('is_active', true)
      .or(`legal_name.ilike.%${term}%,tax_id.ilike.%${term}%,email.ilike.%${term}%`)
      .limit(limit)
      .order('legal_name');

    if (error) throw error;
    return data || [];
  }
}
