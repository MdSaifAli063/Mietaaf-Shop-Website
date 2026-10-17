import { FabricManager } from "@/components/admin/fabric-manager";

export default async function AdminFabricDesignsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <FabricManager key={slug} catalogueSlug={slug} />;
}
