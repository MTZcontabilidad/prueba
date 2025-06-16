"use client";

import { useState, useEffect, useCallback} from "react";
import { ClientService } from "@/lib/services/client.service";
import { Client } from "@/lib/supabase/types";
import { ClientFormData } from "@/lib/schemas/client.schema";
import { ClientForm } from "@/components/clients/client-form";
import { DeleteConfirmDialog } from "@/components/clients/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, Mail, Phone, MapPin, Filter, Download, Edit, MoreVertical, UserCheck, Briefcase, RefreshCw, Loader2, Plus, Trash2, ChevronLeft, ChevronRight, FileSpreadsheet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { useClients } from "@/lib/hooks/useClients";

export function ClientsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  
  // Estado para los modales
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Hook personalizado para manejar clientes
  const {
    clients,
    loading,
    error,
    pagination,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    setPage,
    setFilters
  } = useClients({
    filters: {
      searchTerm,
      city: selectedCity,
      activity: selectedActivity
    }
  });
  
  // Manejar cambios en filtros
  const handleFiltersChange = useCallback(() => {
    setFilters({
      searchTerm,
      city: selectedCity,
      activity: selectedActivity
    });
    setPage(1);
  }, [searchTerm, selectedCity, selectedActivity, setFilters, setPage]);
  
  // Efecto para aplicar filtros cuando cambien
  useEffect(() => {
    console.log("Estoy aca")
    const timeoutId = setTimeout(() => {
      handleFiltersChange();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [handleFiltersChange]);
  
  // Obtener estadísticas (simplificado)
  const stats = {
    total: pagination.total,
    withEmail: clients.filter(c => c.email && c.email.trim() !== '').length,
    withPhone: clients.filter(c => c.phone && c.phone.trim() !== '').length,
    cities: [...new Set(clients.map(c => c.city).filter(Boolean))],
    activities: [...new Set(clients.map(c => c.business_activity).filter(Boolean))]
  };
  
  // Funciones CRUD
  const handleCreate = async (data: ClientFormData) => {
    const newClient = await createClient(data);
    return newClient;
  };
  
  const handleUpdate = async (data: ClientFormData) => {
    if (!selectedClient) throw new Error("No hay cliente seleccionado");
    const updatedClient = await updateClient(selectedClient.id, data);
    return updatedClient;
  };
  
  const handleDelete = async () => {
    if (!clientToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteClient(clientToDelete.id);
      toast.success("Cliente eliminado exitosamente");
      setShowDeleteDialog(false);
      setClientToDelete(null);
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      toast.error("Error al eliminar el cliente");
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setShowForm(true);
  };
  
  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setShowDeleteDialog(true);
  };
  
  const exportToCSV = async () => {
    try {
      const csvContent = await ClientService.exportToCSV();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Archivo CSV descargado exitosamente");
    } catch (error) {
      console.error("Error al exportar:", error);
      toast.error("Error al exportar los datos");
    }
  };

  if (loading && clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
        </div>
        <p className="text-lg font-medium text-gray-600">Cargando información de clientes...</p>
      </div>
    );
  }

  if (error && clients.length === 0) {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Error al cargar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchClients} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gestión de Clientes
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra y visualiza todos tus clientes registrados
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setSelectedClient(null);
              setShowForm(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
          <Button variant="outline" onClick={() => setViewMode(viewMode === "cards" ? "table" : "cards")}>
            {viewMode === "cards" ? "Vista Tabla" : "Vista Tarjetas"}
          </Button>
          <Button onClick={exportToCSV} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/clients/import'}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Importar
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Página {pagination.page} de {pagination.totalPages}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Email</CardTitle>
            <Mail className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.withEmail}</div>
            <p className="text-xs text-muted-foreground">
              En esta página
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Teléfono</CardTitle>
            <Phone className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.withPhone}</div>
            <p className="text-xs text-muted-foreground">
              En esta página
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ciudades</CardTitle>
            <MapPin className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.cities.length}</div>
            <p className="text-xs text-muted-foreground">
              En esta página
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5 text-blue-500" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas las ciudades</option>
              {/* Aquí deberías cargar las ciudades únicas de la BD */}
            </select>

            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas las actividades</option>
              {/* Aquí deberías cargar las actividades únicas de la BD */}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Contenido */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "cards" | "table")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cards">Vista Tarjetas</TabsTrigger>
          <TabsTrigger value="table">Vista Tabla</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-4">
          {clients.length === 0 ? (
            <Card className="text-center py-12 shadow-lg">
              <CardContent>
                <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <p className="text-xl font-medium text-gray-900 mb-2">No se encontraron clientes</p>
                <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client) => (
                  <Card key={client.id} className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-l-4 border-l-blue-400">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-bold text-gray-800">
                            {client.legal_name || 'Sin nombre'}
                          </CardTitle>
                          <CardDescription className="flex items-center text-blue-600">
                            <UserCheck className="mr-1 h-3 w-3" />
                            RUT: {client.tax_id}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEdit(client)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(client)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        {client.email && (
                          <div className="flex items-center text-sm">
                            <Mail className="mr-2 h-3 w-3 text-green-500" />
                            <span className="truncate">{client.email}</span>
                          </div>
                        )}
                        
                        {client.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="mr-2 h-3 w-3 text-purple-500" />
                            <span className="font-mono">{client.phone}</span>
                          </div>
                        )}
                        
                        {client.city && (
                          <div className="flex items-center text-sm">
                            <MapPin className="mr-2 h-3 w-3 text-orange-500" />
                            <span>{client.city}</span>
                          </div>
                        )}
                        
                        {client.business_activity && (
                          <div className="flex items-center text-sm">
                            <Briefcase className="mr-2 h-3 w-3 text-indigo-500" />
                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                              {client.business_activity}
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 pt-3 border-t border-gray-100">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 hover:bg-blue-50 hover:border-blue-300"
                          onClick={() => handleEdit(client)}
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 hover:bg-red-50 hover:border-red-300 text-red-600"
                          onClick={() => handleDeleteClick(client)}
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Paginación */}
              <div className="flex justify-center items-center space-x-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <span className="text-sm text-gray-600">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Lista de Clientes</CardTitle>
              <CardDescription>
                Mostrando {clients.length} de {pagination.total} clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="text-left p-4 font-semibold text-gray-700">Cliente</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Contacto</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Ubicación</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Actividad</th>
                      <th className="text-left p-4 font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client, index) => (
                      <tr key={client.id} className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="p-4">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {client.legal_name || 'Sin nombre'}
                            </div>
                            <div className="text-sm text-gray-500 font-mono">
                              RUT: {client.tax_id || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            {client.email && (
                              <div className="flex items-center text-sm">
                                <Mail className="mr-1 h-3 w-3 text-green-500" />
                                <span className="truncate max-w-48">{client.email}</span>
                              </div>
                            )}
                            {client.phone && (
                              <div className="flex items-center text-sm">
                                <Phone className="mr-1 h-3 w-3 text-purple-500" />
                                <span className="font-mono">{client.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            {client.city && (
                              <div className="font-medium text-gray-700">{client.city}</div>
                            )}
                            {client.state && (
                              <div className="text-gray-500">{client.state}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          {client.business_activity && (
                            <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                              {client.business_activity}
                            </Badge>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-blue-100"
                              onClick={() => handleEdit(client)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="hover:bg-red-100 text-red-600"
                              onClick={() => handleDeleteClick(client)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Paginación */}
              <div className="flex justify-center items-center space-x-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <span className="text-sm text-gray-600">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Modales */}
      <ClientForm
        client={selectedClient}
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedClient(null);
        }}
        onSuccess={() => {
          setShowForm(false);
          setSelectedClient(null);
        }}
        onSubmit={selectedClient ? handleUpdate : handleCreate}
      />
      
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setClientToDelete(null);
        }}
        onConfirm={handleDelete}
        clientName={clientToDelete?.legal_name || ""}
        loading={isDeleting}
      />
    </div>
  );
}
