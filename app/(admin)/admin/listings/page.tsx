"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { List, Loader2, Check, Trash2 } from "lucide-react";

export default function AdminListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "pending">("pending");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchListings = () => {
    setLoading(true);
    const url = filter === "pending"
      ? "/api/admin/listings/pending"
      : "/api/listings?limit=100";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const list = data.list ?? data.listings ?? [];
        setListings(Array.isArray(list) ? list : []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, [filter]);

  const handleApprove = async (id: string) => {
    const res = await fetch(`/api/admin/listings/${id}/approve`, {
      method: "PUT",
    });
    if (res.ok) fetchListings();
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this listing? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      if (res.ok) fetchListings();
      else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to remove listing");
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <List className="h-8 w-8 text-primary" />
            Manage Listings
          </h1>
          <p className="font-body text-muted mt-1">
            Approve or remove listings
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filter === "pending" ? "bg-primary text-white" : "bg-muted/20 text-muted hover:bg-muted/30"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              filter === "all" ? "bg-primary text-white" : "bg-muted/20 text-muted hover:bg-muted/30"
            }`}
          >
            All
          </button>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-surface border border-white/50 shadow-md overflow-hidden"
        >
          {listings.length === 0 ? (
            <div className="p-12 text-center font-body text-muted">
              No listings found
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing: any) => (
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
                        <div className="flex items-center justify-end gap-2">
                          {!listing.approved && (
                            <button
                              onClick={() => handleApprove(listing._id)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/20 text-green-700 font-medium hover:bg-accent/30"
                            >
                              <Check className="h-4 w-4" />
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleRemove(listing._id)}
                            disabled={deletingId === listing._id}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50"
                            title="Remove listing"
                          >
                            {deletingId === listing._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
