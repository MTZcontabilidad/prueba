"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Tipo para los datos del cliente - ajusta según tu estructura de BD
interface Cliente {
  id: string;
  nombre: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo?: boolean;
}

export function ClientesTable() {

  const [clientes, setClientes] = useState<Cliente[]>([]);
  console.log(clientes);

  useEffect(() => {
    const fetchClientes = async () => {
      const supabase = createClient();
      const { data: clientesData, error } = await supabase.from('CLIENTE').select("*");
      
      if (error) {
        console.error('Error fetching clientes:', error);
        return;
      }

      if (clientesData) {
        setClientes(clientesData);
      }
    };

    fetchClientes();
  }, []);

  return (
<h1>
  Hola
</h1>
  );
}