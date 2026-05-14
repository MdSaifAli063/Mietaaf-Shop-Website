"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { getFirebaseDb } from "@/firebase/client";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatInr } from "@/lib/format";

type OrderRow = {
  id: string;
  customerName?: string;
  total?: number;
  status?: string;
};

export default function AdminOrdersPage() {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const db = getFirebaseDb();

  useEffect(() => {
    if (!db) return;
    void (async () => {
      try {
        const q = query(collection(db, "orders"), limit(50));
        const snap = await getDocs(q);
        setRows(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Record<string, unknown>),
          })) as OrderRow[],
        );
      } catch {
        setRows([]);
      }
    })();
  }, [db]);

  if (!db) {
    return (
      <Card className="border-dashed p-6 text-sm text-muted-foreground">
        Firebase not configured.
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-3xl">Orders</h1>
      <Card className="border-border/60 p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No orders synced yet. Checkout creates documents when Firebase is live.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.id}</TableCell>
                  <TableCell>{r.customerName}</TableCell>
                  <TableCell>{r.total != null ? formatInr(r.total) : "—"}</TableCell>
                  <TableCell>{r.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
