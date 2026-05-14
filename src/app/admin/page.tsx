"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card } from "@/components/ui/card";
import { DUMMY_PRODUCTS } from "@/lib/data/products";

const chartData = DUMMY_PRODUCTS.slice(0, 6).map((p) => ({
  name: p.name.slice(0, 10),
  popularity: p.popularity ?? 50,
}));

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of catalogue momentum (sample analytics UI).
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "SKU count", value: DUMMY_PRODUCTS.length },
          { label: "Wedding SKUs", value: DUMMY_PRODUCTS.filter((p) => p.wedding).length },
          { label: "Premium SKUs", value: DUMMY_PRODUCTS.filter((p) => p.categorySlug === "premium-collection").length },
          { label: "Avg. rating", value: "4.8" },
        ].map((s) => (
          <Card key={s.label} className="border-border/60 p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
            <p className="mt-2 font-heading text-3xl">{s.value}</p>
          </Card>
        ))}
      </div>
      <Card className="border-border/60 p-4">
        <p className="mb-4 text-sm font-medium">Popularity index</p>
        <div className="h-72 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="popularity" fill="#b8860b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
