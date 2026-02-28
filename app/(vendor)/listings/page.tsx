"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { List, Plus, Pencil, Trash2, Loader2 } from "lucide-react";

export default function VendorListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = () => {
    setLoading(true);
    fetch("/api/listings?mine=1")
      .then((r) => r.json())
      .then((data) => {
        const list = data.listings ?? [];
        setListings(list);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
    if (res.ok) fetchListings();
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

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
            My Listings
          </h1>
          <p className="font-body text-muted mt-1">
            Manage and edit your listings
          </p>
        </div>
        <Link
          href="/listings/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-white font-heading font-semibold px-5 py-2.5 hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Listing
        </Link>
      </motion.div>

      {listings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-surface border border-white/50 shadow-md p-12 text-center"
        >
          <p className="font-body text-muted mb-4">You haven&apos;t added any listings yet.</p>
          <Link
            href="/listings/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-white font-heading font-semibold px-5 py-3 hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create your first listing
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-surface border border-white/50 shadow-md overflow-hidden"
        >
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
                    Price
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
                {listings.map((listing) => (
                  <tr key={listing._id} className="border-b border-muted/10 hover:bg-muted/5">
                    <td className="py-4 px-6 font-body text-foreground">
                      {listing.title}
                    </td>
                    <td className="py-4 px-6 font-body text-muted capitalize">
                      {listing.category}
                    </td>
                    <td className="py-4 px-6 font-body">
                      ₹{listing.price}
                      {listing.priceUnit === "month" && "/mo"}
                      {listing.priceUnit === "day" && "/day"}
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
                    <td className="py-4 px-6 text-right flex items-center justify-end gap-2">
                      <Link
                        href={`/listings/${listing._id}/edit`}
                        className="p-2 rounded-lg text-primary hover:bg-primary/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(listing._id)}
                        className="p-2 rounded-lg text-secondary hover:bg-secondary/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
