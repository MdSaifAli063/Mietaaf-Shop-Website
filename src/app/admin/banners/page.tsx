import { BANNERS } from "@/lib/data/banners";
import { Card } from "@/components/ui/card";

export default function AdminBannersPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl">Banners</h1>
      <p className="text-sm text-muted-foreground">
        Homepage carousel reads from <code className="text-xs">lib/data/banners.ts</code> by
        default. Store banner metadata in Firestore <code className="text-xs">banners</code> and
        wire a client provider when you need non-developer edits.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {BANNERS.map((b) => (
          <Card key={b.id} className="overflow-hidden border-border/60">
            <div
              className="h-32 bg-cover bg-center"
              style={{ backgroundImage: `url(${b.image})` }}
            />
            <div className="p-4">
              <p className="font-medium">{b.title}</p>
              <p className="text-xs text-muted-foreground">{b.subtitle}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
