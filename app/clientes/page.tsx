import { ClientesTable } from "@/components/clientes-table";

export default function ClientesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Clientes</h1>
          <p className="text-muted-foreground">
            Administra y visualiza todos tus clientes registrados
          </p>
        </div>
        
        <ClientesTable />
      </div>
    </div>
  );
} 