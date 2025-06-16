"use client";

import { useEffect, useState } from "react";
import { ClientDetail } from "./client-detail";
import { ClientService } from "@/lib/services/client.service";
import { Client } from "@/lib/supabase/types";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ClientDetailWrapperProps {
  clientId: string;
}

export function ClientDetailWrapper({ clientId }: ClientDetailWrapperProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const clientData = await ClientService.getById(clientId);
        setClient(clientData);
      } catch (err) {
        console.error("Error fetching client:", err);
        setError("Error al cargar el cliente");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-muted-foreground">Cargando cliente...</p>
      </div>
    );
  }

  if (error || !client) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6 text-center">
          <p className="text-red-600 mb-4">{error || "Cliente no encontrado"}</p>
        </CardContent>
      </Card>
    );
  }

  return <ClientDetail client={client} />;
} 