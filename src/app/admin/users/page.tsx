import { Card } from "@/components/ui/card";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl">Users</h1>
      <Card className="border-border/60 p-6 text-sm text-muted-foreground">
        User profiles live in Firestore under the path{" "}
        <code className="rounded bg-muted px-1 text-xs">users/&lt;uid&gt;</code>. Grant admin via{" "}
        <code className="rounded bg-muted px-1 text-xs">role: &quot;admin&quot;</code> on that
        document or list emails in{" "}
        <code className="rounded bg-muted px-1 text-xs">NEXT_PUBLIC_ADMIN_EMAILS</code> in your
        environment file.
      </Card>
    </div>
  );
}
