"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, ClientFormData } from "@/lib/schemas/client.schema";
import { Client } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
;
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Save, X } from "lucide-react";
import toast from "react-hot-toast";

interface ClientFormProps {
  client?: Client | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (client: Client) => void;
  onSubmit: (data: ClientFormData) => Promise<Client>;
}

export function ClientForm({
  client,
  open,
  onClose,
  onSuccess,
  onSubmit
}: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      tax_id: client?.tax_id || "",
      legal_name: client?.legal_name || "",
      trade_name: client?.trade_name || "",
      email: client?.email || "",
      phone: client?.phone || "",
      website: client?.website || "",
      address: client?.address || "",
      city: client?.city || "",
      state: client?.state || "",
      postal_code: client?.postal_code || "",
      business_activity: client?.business_activity || "",
      activity_code: client?.activity_code || "",
      business_start_date: client?.business_start_date || "",
      legal_representative: client?.legal_representative || "",
      legal_rep_tax_id: client?.legal_rep_tax_id || "",
      client_type: client?.client_type as "company" | "individual" || "company",
      is_vat_contributor: client?.is_vat_contributor ?? true,
      notes: client?.notes || ""
    }
  });

  const handleSubmit = async (data: ClientFormData) => {
    try {
      setIsSubmitting(true);
      const result = await onSubmit(data);
      toast.success(client ? "Cliente actualizado exitosamente" : "Cliente creado exitosamente");
      onSuccess(result);
      form.reset();
    } catch (error: any) {
      console.error("Error al guardar cliente:", error);
      toast.error(error.message || "Error al guardar el cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRut = (value: string) => {
    // Eliminar caracteres no válidos
    let rut = value.replace(/[^0-9kK]/g, '');
    
    // Formatear
    if (rut.length > 1) {
      const dv = rut.slice(-1);
      const numero = rut.slice(0, -1);
      
      // Agregar puntos
      const numeroFormateado = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      
      return `${numeroFormateado}-${dv}`;
    }
    
    return rut;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {client ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {client 
              ? "Actualiza la información del cliente" 
              : "Completa el formulario para registrar un nuevo cliente"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información Básica</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tax_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RUT *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="12.345.678-9"
                          onChange={(e) => {
                            const formatted = formatRut(e.target.value);
                            field.onChange(formatted);
                          }}
                          disabled={!!client}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legal_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razón Social *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Empresa S.A." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trade_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Fantasía</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="Nombre comercial" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="business_activity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giro/Actividad</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="Venta de productos" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Información de contacto */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información de Contacto</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} type="email" placeholder="contacto@empresa.cl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="+56 9 1234 5678" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sitio Web</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="https://www.empresa.cl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Dirección */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dirección</h3>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ""} placeholder="Av. Principal 123, Oficina 456" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="Santiago" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Región</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="Metropolitana" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código Postal</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="7500000" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Representante Legal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Representante Legal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="legal_representative"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} placeholder="Juan Pérez González" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="legal_rep_tax_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RUT Representante</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          placeholder="12.345.678-9"
                          onChange={(e) => {
                            const formatted = formatRut(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Configuración */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configuración</h3>
              
              <FormField
                control={form.control}
                name="is_vat_contributor"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Contribuyente IVA
                      </FormLabel>
                      <FormDescription>
                        Marcar si el cliente es contribuyente de IVA
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas/Observaciones</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        value={field.value || ""} 
                        placeholder="Información adicional..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {client ? "Actualizar" : "Crear"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
