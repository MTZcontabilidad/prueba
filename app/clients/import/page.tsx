import { ClientImporter } from "@/components/clients/importer/client-importer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClientImportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Import Clients</h1>
      </div>
      
      <ClientImporter />
    </div>
  );
} 