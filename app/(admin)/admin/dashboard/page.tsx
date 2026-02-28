"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Store,
  List,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

interface AnalyticsResponse {
  totalUsers?: number;
  totalVendors?: number;
  totalListings?: number;
  pendingListings?: number;
  totalReviews?: number;
}

interface PendingResponse {
  list?: unknown[];
  listings?: unknown[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalListings: 0,
    pendingListings: 0,
    totalReviews: 0,
  });
  const [pendingListings, setPendingListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/analytics").then((r) => (r.ok ? r.json() : {}) as Promise<AnalyticsResponse>),
      fetch("/api/admin/listings/pending").then((r) => (r.ok ? r.json() : { list: [] }) as Promise<PendingResponse>),
    ])
      .then(([analytics, pending]) => {
        setStats({
          totalUsers: analytics.totalUsers ?? 0,
          totalVendors: analytics.totalVendors ?? 0,
          totalListings: analytics.totalListings ?? 0,
          pendingListings: analytics.pendingListings ?? 0,
          totalReviews: analytics.totalReviews ?? 0,
        });
        setPendingListings((pending.listings ?? pending.list ?? []) as any[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, href: "/admin/users" },
    { label: "Vendors", value: stats.totalVendors, icon: Store },
    { label: "Total Listings", value: stats.totalListings, icon: List, href: "/admin/listings" },
    { label: "Pending Approval", value: stats.pendingListings, icon: AlertCircle, color: "secondary" },
    { label: "Reviews", value: stats.totalReviews, icon: List },
  ];

  return (
    <div className="p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          Admin Dashboard
        </h1>
        <p className="font-body text-muted mt-1">
          Platform overview and moderation
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            {card.href ? (
              <Link href={card.href}>
                <div className="rounded-2xl bg-surface border border-white/50 shadow-md p-6 hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-body text-muted text-sm">{card.label}</p>
                      <p className="font-heading text-2xl font-bold text-foreground mt-1">
                        {card.value}
                      </p>
                    </div>
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${card.color === "secondary" ? "bg-secondary/10" : "bg-primary/10"}`}>
                      <card.icon className={`h-6 w-6 ${card.color === "secondary" ? "text-secondary" : "text-primary"}`} />
                    </div>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-2xl bg-surface border border-white/50 shadow-md p-6 h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body text-muted text-sm">{card.label}</p>
                    <p className="font-heading text-2xl font-bold text-foreground mt-1">
                      {card.value}
                    </p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${card.color === "secondary" ? "bg-secondary/10" : "bg-primary/10"}`}>
                    <card.icon className={`h-6 w-6 ${card.color === "secondary" ? "text-secondary" : "text-primary"}`} />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-surface border border-white/50 shadow-md overflow-hidden"
      >
        <div className="p-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Pending Listings
          </h2>
          <Link
            href="/admin/listings"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            View all
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        {pendingListings.length === 0 ? (
          <div className="p-12 text-center font-body text-muted">
            No pending listings
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-muted/20 bg-muted/5">
                  <th className="text-left py-3 px-6 font-heading text-sm font-medium text-foreground">
                    Title
                  </th>
                  <th className="text-left py-3 px-6 font-heading text-sm font-medium text-foreground">
                    Category
                  </th>
                  <th className="text-right py-3 px-6 font-heading text-sm font-medium text-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingListings.slice(0, 5).map((listing: any) => (
                  <tr key={listing._id} className="border-b border-muted/10">
                    <td className="py-4 px-6 font-body text-foreground">
                      {listing.title}
                    </td>
                    <td className="py-4 px-6 font-body text-muted capitalize">
                      {listing.category}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/listings?approve=${listing._id}`}
                        className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
                      >
                        Approve
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
