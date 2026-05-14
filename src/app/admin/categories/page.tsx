import { CATEGORIES } from "@/lib/data/categories";
import { Card } from "@/components/ui/card";

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl">Categories</h1>
      <p className="text-sm text-muted-foreground">
        Canonical categories are defined in code for routing. Mirror these documents in
        Firestore collection <code className="text-xs">categories</code> for CMS flexibility.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <Card key={c.slug} className="border-border/60 p-4">
            <p className="font-heading text-lg">{c.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">/{c.slug}</p>
            <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
