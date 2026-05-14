"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useAuth } from "@/context/auth-context";
import { getFirebaseDb } from "@/firebase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PageEnter } from "@/components/motion/page-enter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileSchema = z.object({
  displayName: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, profile, loading, firebaseReady, refreshProfile } = useAuth();
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        displayName: profile.displayName ?? "",
        phone: profile.phone ?? "",
        address: profile.address ?? "",
        city: profile.city ?? "",
        state: profile.state ?? "",
        pincode: profile.pincode ?? "",
      });
    }
  }, [profile, form]);

  async function onSubmit(data: ProfileForm) {
    const db = getFirebaseDb();
    if (!user || !db) {
      toast.error("Sign in and configure Firebase to save profile.");
      return;
    }
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName: data.displayName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
        },
        { merge: true },
      );
      toast.success("Profile saved");
      await refreshProfile();
    } catch {
      toast.error("Could not save profile");
    }
  }

  if (!firebaseReady) {
    return (
      <PageEnter>
        <div className="mx-auto max-w-lg px-4 py-20 text-center text-muted-foreground">
          Add Firebase environment variables to enable authentication and profile sync.
        </div>
      </PageEnter>
    );
  }

  if (!loading && !user) {
    return (
      <PageEnter>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <p className="font-heading text-2xl">Sign in to view profile</p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/login">Go to login</Link>
          </Button>
        </div>
      </PageEnter>
    );
  }

  return (
    <PageEnter>
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl">Profile</h1>
        <Card className="mt-8 space-y-6 border-border/60 p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.photoURL ?? undefined} />
              <AvatarFallback>
                {(profile?.displayName ?? user?.email ?? "?").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{profile?.displayName ?? user?.displayName}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display name</Label>
              <Input id="displayName" {...form.register("displayName")} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...form.register("phone")} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" {...form.register("address")} className="rounded-xl" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...form.register("city")} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" {...form.register("state")} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" {...form.register("pincode")} className="rounded-xl" />
              </div>
            </div>
            <Button type="submit" className="rounded-full" disabled={form.formState.isSubmitting}>
              Save changes
            </Button>
          </form>
        </Card>
      </div>
    </PageEnter>
  );
}
