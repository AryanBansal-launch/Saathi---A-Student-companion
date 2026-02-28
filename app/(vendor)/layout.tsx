"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const role = (session?.user as { role?: string })?.role;

  const isVendorRegister = pathname === "/vendor/register";

  useEffect(() => {
    if (isVendorRegister) return;
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }
    if (status === "loading") return;
    if (role !== "vendor" && role !== "admin") {
      router.replace("/");
    }
  }, [status, role, router, isVendorRegister]);

  if (isVendorRegister) {
    return <>{children}</>;
  }

  if (status === "loading" || (status === "authenticated" && role !== "vendor" && role !== "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar role="vendor" />
      <div className="flex-1 lg:pl-64">
        {children}
      </div>
    </div>
  );
}
