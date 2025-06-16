import { ClientImporter } from "@/components/clients/importer/client-importer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ClientImportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/clients" className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Link>
        <h1 className="text-2xl font-bold">Import Clients</h1>
      </div>
      
      <ClientImporter />
    </div>
  );
} 