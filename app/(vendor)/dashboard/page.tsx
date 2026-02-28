"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Eye,
  MessageCircle,
  List,
  Plus,
  Loader2,
  ArrowRight,
} from "lucide-react";

export default function VendorDashboardPage() {
  const [stats, setStats] = useState({
    totalListings: 0,
    activeListings: 0,
    pendingListings: 0,
    totalViews: 0,
  });
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/listings?mine=1").then((r) => r.json()),
      fetch("/api/admin/analytics").then((r) => (r.ok ? r.json() : {})).catch(() => ({})),
    ])
      .then(([listingsRes, analyticsRes]) => {
        const mine = listingsRes.listings ?? [];
        setRecentListings(mine.slice(0, 5));
        const approved = mine.filter((l: any) => l.approved).length;
        const pending = mine.filter((l: any) => !l.approved).length;
        setStats({
          totalListings: mine.length,
          activeListings: approved,
          pendingListings: pending,
          totalViews: typeof (analyticsRes as any).totalViews === 'number' ? (analyticsRes as any).totalViews : 0,
        });
      })
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
    { label: "Total Listings", value: stats.totalListings, icon: List, color: "primary" },
    { label: "Active", value: stats.activeListings, icon: List, color: "accent" },
    { label: "Pending Approval", value: stats.pendingListings, icon: MessageCircle, color: "secondary" },
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
          Vendor Dashboard
        </h1>
        <p className="font-body text-muted mt-1">
          Manage your listings and track performance
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-surface border border-white/50 shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-muted text-sm">{card.label}</p>
                <p className="font-heading text-2xl font-bold text-foreground mt-1">
                  {card.value}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <card.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-surface border border-white/50 shadow-md overflow-hidden"
      >
        <div className="p-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Recent Listings
          </h2>
          <Link
            href="/listings/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-white font-heading font-semibold px-4 py-2.5 hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Listing
          </Link>
        </div>
        {recentListings.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-body text-muted mb-4">No listings yet</p>
            <Link
              href="/listings/new"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              <Plus className="h-5 w-5" />
              Create your first listing
            </Link>
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
                  <th className="text-left py-3 px-6 font-heading text-sm font-medium text-foreground">
                    Status
                  </th>
                  <th className="text-right py-3 px-6 font-heading text-sm font-medium text-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentListings.map((listing) => (
                  <tr key={listing._id} className="border-b border-muted/10 hover:bg-muted/5">
                    <td className="py-4 px-6 font-body text-foreground">
                      {listing.title}
                    </td>
                    <td className="py-4 px-6 font-body text-muted capitalize">
                      {listing.category}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          listing.approved
                            ? "bg-accent/20 text-green-700"
                            : "bg-secondary/20 text-secondary"
                        }`}
                      >
                        {listing.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/listings/${listing._id}/edit`}
                        className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
                      >
                        Edit
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
