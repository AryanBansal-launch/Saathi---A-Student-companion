"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Loader2, Trash2 } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => (r.ok ? r.json() : { users: [] }))
      .then((data) => setUsers(data.users ?? []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this user? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) setUsers((prev) => prev.filter((u) => u._id !== id));
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
        className="mb-8"
      >
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Manage Users
        </h1>
        <p className="font-body text-muted mt-1">
          View and manage platform users
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl bg-surface border border-white/50 shadow-md overflow-hidden"
      >
        {users.length === 0 ? (
          <div className="p-12 text-center font-body text-muted">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-muted/20 bg-muted/5">
                  <th className="text-left py-3 px-6 font-heading text-sm font-medium text-foreground">
                    Name
                  </th>
                  <th className="text-left py-3 px-6 font-heading text-sm font-medium text-foreground">
                    Email
                  </th>
                  <th className="text-left py-3 px-6 font-heading text-sm font-medium text-foreground">
                    Role
                  </th>
                  <th className="text-right py-3 px-6 font-heading text-sm font-medium text-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user._id} className="border-b border-muted/10 hover:bg-muted/5">
                    <td className="py-4 px-6 font-body text-foreground">
                      {user.name}
                    </td>
                    <td className="py-4 px-6 font-body text-muted">
                      {user.email}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 rounded-lg text-secondary hover:bg-secondary/10"
                        title="Remove user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
