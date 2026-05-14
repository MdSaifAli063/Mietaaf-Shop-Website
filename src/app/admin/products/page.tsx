"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import type { Product } from "@/types";
import { formatInr } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NAV_CATEGORIES } from "@/lib/constants";
import type { CategorySlug } from "@/types";

export default function AdminProductsPage() {
  const [remote, setRemote] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const db = getFirebaseDb();

  async function refresh() {
    if (!db) {
      setLoading(false);
      return;
    }
    const snap = await getDocs(collection(db, "products"));
    const rows = snap.docs.map((d) => {
      const data = d.data() as Product;
      return { ...data, id: d.id };
    });
    setRemote(rows);
    setLoading(false);
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh is stable for mount-only load
  }, [db]);

  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("9999");
  const [categorySlug, setCategorySlug] = useState<CategorySlug>("kurta");
  const [images, setImages] = useState(
    "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800&q=80",
  );
  const [description, setDescription] = useState("");

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!db) {
      toast.error("Configure Firebase to manage products.");
      return;
    }
    const slugClean = slug.trim().toLowerCase().replace(/\s+/g, "-");
    if (!slugClean || !name.trim()) {
      toast.error("Slug and name are required");
      return;
    }
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      toast.error("Invalid price");
      return;
    }
    const imgs = images
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const cat = NAV_CATEGORIES.find((c) => c.slug === categorySlug)!;
    const payload: Product = {
      id: slugClean,
      slug: slugClean,
      name: name.trim(),
      description: description.trim() || "Premium Mietaaf piece.",
      price: priceNum,
      category: cat.label,
      categorySlug,
      sizes: ["M", "L", "XL"],
      colors: [
        { name: "Ivory", hex: "#faf7f2" },
        { name: "Black", hex: "#0a0a0a" },
      ],
      images: imgs.length ? imgs : ["https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=800&q=80"],
      rating: 4.8,
      reviewCount: 0,
      stock: 10,
      fabric: "See product page for fabric composition.",
      tags: ["new"],
      newArrival: true,
    };
    try {
      await setDoc(doc(db, "products", slugClean), payload);
      toast.success("Product saved");
      setSlug("");
      setName("");
      setDescription("");
      await refresh();
    } catch {
      toast.error("Failed to save product");
    }
  }

  async function remove(id: string) {
    if (!db) return;
    if (!confirm("Delete this product from Firestore?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("Deleted");
      await refresh();
    } catch {
      toast.error("Delete failed");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl">Products</h1>
        <p className="text-sm text-muted-foreground">
          Firestore collection <code className="text-xs">products</code>. Storefront seed data
          ships in-repo; extend the product service to merge remote SKUs when you are ready.
        </p>
      </div>
      {!db ? (
        <Card className="border-dashed p-6 text-sm text-muted-foreground">
          Firebase is not configured — add environment variables to enable CRUD.
        </Card>
      ) : null}
      <Card className="space-y-4 border-border/60 p-6">
        <h2 className="font-heading text-xl">Add / overwrite by slug</h2>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={addProduct}>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="royal-sherwani" />
          </div>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
          </div>
          <div className="space-y-2">
            <Label>Price (INR)</Label>
            <Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={categorySlug}
              onValueChange={(v) => setCategorySlug(v as CategorySlug)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NAV_CATEGORIES.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Image URLs (comma separated)</Label>
            <Textarea
              rows={2}
              value={images}
              onChange={(e) => setImages(e.target.value)}
              placeholder="https://..., https://..."
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" className="rounded-full">
              Save to Firestore
            </Button>
          </div>
        </form>
      </Card>
      <Card className="border-border/60 p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Slug</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Loading…
                </TableCell>
              </TableRow>
            ) : remote.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No remote products yet.
                </TableCell>
              </TableRow>
            ) : (
              remote.map((p) => (
                <TableRow key={p.slug}>
                  <TableCell className="font-mono text-xs">{p.slug}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{formatInr(p.price)}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => void remove(p.slug)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
