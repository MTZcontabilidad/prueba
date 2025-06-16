"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@/lib/supabase/types";
import { ClientService } from "@/lib/services/client.service";
import { ClientFormData } from "@/lib/schemas/client.schema";
import { ClientForm } from "@/components/clients/client-form";
import { DeleteConfirmDialog } from "@/components/clients/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  User,
  FileText,
  Briefcase
} from "lucide-react";
import toast from "react-hot-toast";

interface ClientDetailProps {
  client: Client;
}

export function ClientDetail({ client: initialClient }: ClientDetailProps) {
  const router = useRouter();
  const [client, setClient] = useState(initialClient);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleUpdate = async (data: ClientFormData) => {
    try {
      const updatedClient = await ClientService.update(client.id, data);
      setClient(updatedClient);
      return updatedClient;
    } catch (error) {
      console.error("Error updating client:", error);
      throw error;
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await ClientService.delete(client.id);
      toast.success("Cliente eliminado exitosamente");
      router.push("/clients");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Error al eliminar el cliente");
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/clients")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{client.legal_name || "Sin nombre"}</h1>
            {client.trade_name && (
              <p className="text-sm text-muted-foreground">{client.trade_name}</p>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowEditForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>
      
      {/* Información del cliente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información básica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5 text-blue-500" />
              Información Básica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">RUT</p>
              <p className="font-mono">{client.tax_id || "No especificado"}</p>
            </div>
            
            {client.activity_code && (
              <div>
                <p className="text-sm font-medium text-gray-500">Código de Actividad</p>
                <p>{client.activity_code}</p>
              </div>
            )}
            
            {client.business_activity && (
              <div>
                <p className="text-sm font-medium text-gray-500">Actividad</p>
                <Badge variant="secondary" className="mt-1">
                  <Briefcase className="mr-1 h-3 w-3" />
                  {client.business_activity}
                </Badge>
              </div>
            )}
            
            {client.business_start_date && (
              <div>
                <p className="text-sm font-medium text-gray-500">Fecha inicio actividades</p>
                <p className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                  {new Date(client.business_start_date).toLocaleDateString('es-CL')}
                </p>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-gray-500">Tipo de Cliente</p>
              <Badge variant={client.client_type === 'company' ? 'default' : 'secondary'}>
                {client.client_type === 'company' ? 'Empresa' : 'Persona'}
              </Badge>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Contribuyente IVA</p>
              <Badge variant={client.is_vat_contributor ? 'default' : 'secondary'}>
                {client.is_vat_contributor ? 'Sí' : 'No'}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Información de contacto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5 text-green-500" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              {client.email ? (
                <a 
                  href={`mailto:${client.email}`}
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <Mail className="mr-1 h-4 w-4" />
                  {client.email}
                </a>
              ) : (
                <p className="text-gray-400">No especificado</p>
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Teléfono</p>
              {client.phone ? (
                <a 
                  href={`tel:${client.phone}`}
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <Phone className="mr-1 h-4 w-4" />
                  {client.phone}
                </a>
              ) : (
                <p className="text-gray-400">No especificado</p>
              )}
            </div>
            
            {client.website && (
              <div>
                <p className="text-sm font-medium text-gray-500">Sitio Web</p>
                <a 
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  {client.website}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Ubicación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-orange-500" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Dirección</p>
              <p>{client.address || "No especificada"}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Ciudad</p>
                <p>{client.city || "No especificada"}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Región</p>
                <p>{client.state || "No especificada"}</p>
              </div>
            </div>
            
            {client.postal_code && (
              <div>
                <p className="text-sm font-medium text-gray-500">Código Postal</p>
                <p>{client.postal_code}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Representante legal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-purple-500" />
              Representante Legal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Nombre</p>
              <p>{client.legal_representative || "No especificado"}</p>
            </div>
            
            {client.legal_rep_tax_id && (
              <div>
                <p className="text-sm font-medium text-gray-500">RUT</p>
                <p className="font-mono">{client.legal_rep_tax_id}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Notas */}
        {client.notes && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-indigo-500" />
                Notas/Observaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{client.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Modales */}
      <ClientForm
        client={client}
        open={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSuccess={(updatedClient) => {
          setClient(updatedClient);
          setShowEditForm(false);
        }}
        onSubmit={handleUpdate}
      />
      
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        clientName={client.legal_name || ""}
        loading={isDeleting}
      />
    </div>
  );
}