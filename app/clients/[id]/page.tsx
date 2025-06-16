import { ClientDetailWrapper } from "@/components/clients/client-detail-wrapper";

interface ClientDetailPageProps {
  params: {
    id: string;
  };
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  return <ClientDetailWrapper clientId={params.id} />;
} 