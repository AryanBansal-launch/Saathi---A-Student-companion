"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, MapPin, Phone, Mail, Loader2, Save } from "lucide-react";
import type { IUser } from "@/types";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    budget: "",
    categories: [] as string[],
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status !== "authenticated") return;

    fetch("/api/users/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setUser(data);
          setForm({
            name: data.name ?? "",
            phone: data.phone ?? "",
            city: data.city ?? "",
            budget: data.preferences?.budget?.toString() ?? "",
            categories: data.preferences?.categories ?? [],
          });
        }
      })
      .finally(() => setLoading(false));
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          city: form.city,
          preferences: {
            budget: form.budget ? Number(form.budget) : undefined,
            categories: form.categories,
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-surface border border-white/50 shadow-lg p-6 sm:p-8"
        >
          <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
            <User className="h-8 w-8 text-primary" />
            Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl border border-muted/30 bg-background px-4 py-3 font-body text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted" />
                Email
              </label>
              <input
                type="email"
                value={session?.user?.email ?? ""}
                disabled
                className="w-full rounded-xl border border-muted/30 bg-muted/10 px-4 py-3 font-body text-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted" />
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-xl border border-muted/30 bg-background px-4 py-3 font-body text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted" />
                City
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className="w-full rounded-xl border border-muted/30 bg-background px-4 py-3 font-body text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. Delhi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Budget (₹/month)
              </label>
              <input
                type="number"
                min={0}
                value={form.budget}
                onChange={(e) => setForm((f) => ({ ...f, budget: e.target.value }))}
                className="w-full rounded-xl border border-muted/30 bg-background px-4 py-3 font-body text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. 10000"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-white font-heading font-semibold py-3 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
