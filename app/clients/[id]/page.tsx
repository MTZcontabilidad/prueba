import { ClientDetailWrapper } from "@/components/clients/client-detail-wrapper";

interface ClientDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = await params;
  return <ClientDetailWrapper clientId={id} />;
} 