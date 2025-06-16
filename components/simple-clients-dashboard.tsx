"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { CyberButton, CyberCard, CyberInput, CyberBadge } from "@/components/ui/cyber-ui";
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  Search,
  Plus,
  Download,
  RefreshCw,
  Loader2,
  ArrowLeft,
  Sparkles,
  Eye,
  Edit
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Client {
  id: string;
  tax_id: string;
  legal_name: string;
  trade_name?: string;
  email?: string;
  phone?: string;
  city?: string;
  business_activity?: string;
  is_active: boolean;
}

export function SimpleClientsDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    console.log("Estoy aca")
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      // Intentar con tabla clients primero
      let { data } = await supabase
        .from('clients')
        .select('*')
        .order('legal_name', { ascending: true });
      
      // Si falla, usar tabla CLIENTE legacy
      if (!data || data.length === 0) {
        const { data: legacyData, error: legacyError } = await supabase
          .from('CLIENTE')
          .select('*')
          .order('nombre_cliente', { ascending: true });
        
        if (!legacyError && legacyData) {
          // Convertir datos legacy al formato nuevo
          data = legacyData.map(cliente => ({
            id: cliente.id_cliente?.toString() || '',
            tax_id: cliente.rut || '',
            legal_name: cliente.nombre_cliente || 'Sin nombre',
            email: cliente.email || undefined,
            phone: cliente.telefono || undefined,
            city: cliente.ciudad || undefined,
            business_activity: cliente.actividad || undefined,
            is_active: true
          }));
        }
      }
      
      if (data) {
        setClients(data);
        console.log("data", data)
        toast.success(`${data.length} clientes cargados`);
      }
      
    } catch (err) {
      console.error('Error:', err);
      toast.error('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    !searchTerm || [
      client.legal_name,
      client.tax_id,
      client.email,
      client.city,
      client.business_activity
    ].some(field => 
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const stats = {
    total: clients.length,
    withEmail: clients.filter(c => c.email).length,
    withPhone: clients.filter(c => c.phone).length,
    cities: [...new Set(clients.map(c => c.city).filter(Boolean))].length
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="circuit-pattern absolute inset-0 opacity-20" />
        <div className="relative z-10 flex flex-col items-center justify-center py-16 space-y-4">
          <div className="glow-pulse flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
          <p className="text-gray-400">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background effects */}
      <div className="circuit-pattern absolute inset-0 opacity-20" />

      {/* Floating orbs */}
      <div className="float-gentle absolute left-20 top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div
        className="float-gentle absolute bottom-20 right-20 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl"
        style={{ animationDelay: '2s' }}
      />

      <div className="relative z-10 p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="glow-multi rounded-lg border border-gray-700 bg-gray-800/50 p-2 text-gray-300 transition-all duration-300 hover:text-cyan-400"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-glow-intense bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent">
                Gestión de Clientes
              </h1>
              <p className="mt-2 text-gray-400">Administra tu cartera de clientes</p>
            </div>
          </div>

          <div className="flex gap-3">
            <CyberButton onClick={() => router.push('/clients/import')} variant="primary">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </CyberButton>
            <CyberButton onClick={fetchClients} variant="secondary">
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </CyberButton>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <CyberCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Clientes</p>
                <p className="text-glow text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="glow-pulse flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CyberCard>

          <CyberCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Con Email</p>
                <p className="text-glow text-2xl font-bold text-white">{stats.withEmail}</p>
              </div>
              <div className="glow-pulse flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-teal-600">
                <Mail className="h-6 w-6 text-white" />
              </div>
            </div>
          </CyberCard>

          <CyberCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Con Teléfono</p>
                <p className="text-glow text-2xl font-bold text-white">{stats.withPhone}</p>
              </div>
              <div className="glow-pulse flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-600">
                <Phone className="h-6 w-6 text-white" />
              </div>
            </div>
          </CyberCard>

          <CyberCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ciudades</p>
                <p className="text-glow text-2xl font-bold text-white">{stats.cities}</p>
              </div>
              <div className="glow-pulse flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </div>
          </CyberCard>
        </div>

        {/* Search */}
        <CyberCard className="p-6">
          <h3 className="text-glow mb-4 flex items-center gap-2 text-xl font-semibold text-white">
            <Search className="h-5 w-5 text-cyan-400" />
            Buscar Clientes
          </h3>
          <CyberInput
            placeholder="Buscar por nombre, RUT, email, ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </CyberCard>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <CyberCard key={client.id} className="p-6 hover:border-cyan-400/50 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="glow-pulse flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-glow font-semibold text-white truncate max-w-[200px]">
                      {client.legal_name}
                    </h4>
                    <p className="text-sm text-gray-400">{client.tax_id}</p>
                  </div>
                </div>
                <CyberBadge variant={client.is_active ? "success" : "danger"}>
                  {client.is_active ? "Activo" : "Inactivo"}
                </CyberBadge>
              </div>

              <div className="space-y-2 mb-4">
                {client.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Mail className="h-4 w-4 text-cyan-400" />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Phone className="h-4 w-4 text-cyan-400" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.city && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MapPin className="h-4 w-4 text-cyan-400" />
                    <span>{client.city}</span>
                  </div>
                )}
                {client.business_activity && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Building2 className="h-4 w-4 text-cyan-400" />
                    <span className="truncate">{client.business_activity}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <CyberButton size="sm" variant="secondary" className="flex-1">
                  <Eye className="mr-1 h-3 w-3" />
                  Ver
                </CyberButton>
                <CyberButton size="sm" variant="primary" className="flex-1">
                  <Edit className="mr-1 h-3 w-3" />
                  Editar
                </CyberButton>
              </div>
            </CyberCard>
          ))}
        </div>

        {filteredClients.length === 0 && !loading && (
          <CyberCard className="p-12 text-center">
            <div className="glow-pulse mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-gray-500 to-gray-600">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-glow text-xl font-semibold text-white mb-2">
              {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm 
                ? "Intenta con otros términos de búsqueda" 
                : "Comienza agregando tu primer cliente"
              }
            </p>
            {!searchTerm && (
              <CyberButton onClick={() => router.push('/clients/import')}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Cliente
              </CyberButton>
            )}
          </CyberCard>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CyberButton 
            onClick={() => router.push('/clients/import')}
            className="p-4 h-auto flex-col gap-2"
            variant="primary"
          >
            <Plus className="h-6 w-6" />
            <span>Importar Clientes</span>
          </CyberButton>
          
          <CyberButton 
            onClick={() => {/* Exportar lógica */}}
            className="p-4 h-auto flex-col gap-2"
            variant="secondary"
          >
            <Download className="h-6 w-6" />
            <span>Exportar Datos</span>
          </CyberButton>
          
          <CyberButton 
            onClick={() => router.push('/reports')}
            className="p-4 h-auto flex-col gap-2"
            variant="success"
          >
            <Sparkles className="h-6 w-6" />
            <span>Generar Reporte</span>
          </CyberButton>
        </div>
      </div>
    </div>
  );
} 