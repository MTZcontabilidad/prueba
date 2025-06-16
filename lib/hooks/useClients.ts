"use client";

import { useState, useEffect, useCallback } from 'react';
import { ClientService } from '@/lib/services/client.service';
import { Client, ClientInsert, ClientUpdate } from '@/lib/supabase/types';
import { ClientFormData } from '@/lib/schemas/client.schema';
import toast from 'react-hot-toast';

interface UseClientsOptions {
  filters?: {
    searchTerm?: string;
    city?: string;
    activity?: string;
  };
  pageSize?: number;
}

interface UseClientsReturn {
  clients: Client[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  fetchClients: () => Promise<void>;
  createClient: (data: ClientFormData) => Promise<Client>;
  updateClient: (id: string, data: ClientFormData) => Promise<Client>;
  deleteClient: (id: string) => Promise<void>;
  setPage: (page: number) => void;
  setFilters: (filters: UseClientsOptions['filters']) => void;
}

export function useClients(options: UseClientsOptions = {}): UseClientsReturn {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState(options.filters || {});
  
  const pageSize = options.pageSize || 20;

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await ClientService.getAll({
        ...filters,
        page,
        perPage: pageSize
      });
      
      setClients(result.data);
      setTotal(result.total);
    } catch (err: unknown) {
      console.error('Error fetching clients:', err);
      setError((err instanceof Error ? err.message : String(err)) || 'Error al cargar clientes');
      toast.error('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const createClient = async (data: ClientFormData): Promise<Client> => {
    try {
      // Verificar si el RUT ya existe
      const exists = await ClientService.existsByTaxId(data.tax_id);
      if (exists) {
        throw new Error('Ya existe un cliente con este RUT');
      }
      
      const newClient = await ClientService.create(data as ClientInsert);
      
      // Actualizar la lista local
      setClients(prev => [newClient, ...prev]);
      setTotal(prev => prev + 1);
      
      toast.success('Cliente creado exitosamente');
      return newClient;
    } catch (err: unknown) {
      console.error('Error creating client:', err);
      const message = (err instanceof Error ? err.message : String(err)) || 'Error al crear el cliente';
      toast.error(message);
      throw new Error(message);
    }
  };

  const updateClient = async (id: string, data: ClientFormData): Promise<Client> => {
    try {
      // Verificar si el RUT ya existe (excluyendo el cliente actual)
      if (data.tax_id) {
        const exists = await ClientService.existsByTaxId(data.tax_id, id);
        if (exists) {
          throw new Error('Ya existe otro cliente con este RUT');
        }
      }
      
      const updatedClient = await ClientService.update(id, data as ClientUpdate);
      
      // Actualizar la lista local
      setClients(prev => 
        prev.map(client => client.id === id ? updatedClient : client)
      );
      
      toast.success('Cliente actualizado exitosamente');
      return updatedClient;
    } catch (err: unknown) {
      console.error('Error updating client:', err);
      const message = (err instanceof Error ? err.message : String(err)) || 'Error al actualizar el cliente';
      toast.error(message);
      throw new Error(message);
    }
  };

  const deleteClient = async (id: string): Promise<void> => {
    try {
      await ClientService.delete(id);
      
      // Actualizar la lista local
      setClients(prev => prev.filter(client => client.id !== id));
      setTotal(prev => prev - 1);
      
      toast.success('Cliente eliminado exitosamente');
      
      // Si no quedan clientes en la página actual y no es la primera página
      if (clients.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (err: unknown) {
      console.error('Error deleting client:', err);
      const message = (err instanceof Error ? err.message : String(err)) || 'Error al eliminar el cliente';
      toast.error(message);
      throw new Error(message);
    }
  };

  return {
    clients,
    loading,
    error,
    pagination: {
      page,
      perPage: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    },
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    setPage,
    setFilters: (newFilters) => {
      setFilters(newFilters || {});
      setPage(1); // Reset to first page when filters change
    }
  };
}
