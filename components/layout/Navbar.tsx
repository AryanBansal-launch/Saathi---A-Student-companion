"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  LogOut,
  Heart,
  LayoutDashboard,
  Shield,
  Search,
  Home,
  Compass,
  ChevronDown,
  Package,
} from "lucide-react";
import type { UserRole } from "@/types";
import Logo from "./Logo";

interface SessionUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: UserRole;
}

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/build-package", label: "Build package", icon: Package },
  { href: "/search", label: "Search", icon: Search },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const user = session?.user as SessionUser | undefined;
  const isVendor = user?.role === "vendor";
  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/90 border-b border-white/40 shadow-soft">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <Logo size="sm" showWordmark href="/" className="hover:scale-[1.02]" />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-foreground/80 hover:text-primary font-body text-sm font-medium transition-colors hover:bg-primary/5"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          {isVendor && (
            <Link
              href="/dashboard"
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-primary font-body text-sm font-medium transition-colors hover:bg-primary/10 border border-primary/20"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin/dashboard"
              className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-primary font-body text-sm font-medium transition-colors hover:bg-primary/10 border border-primary/20"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </div>

        {/* Right side - Auth */}
        <div className="hidden md:flex items-center gap-4">
          {status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-muted/30" />
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-surface/80 transition-colors border border-transparent hover:border-primary/20"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="font-body text-sm font-medium text-foreground max-w-[120px] truncate">
                  {user?.name || "Account"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                      aria-hidden="true"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-surface/95 backdrop-blur-xl shadow-lg border border-white/20 py-1 z-50"
                    >
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 transition-colors"
                      >
                        <User className="h-4 w-4 text-muted" />
                        Profile
                      </Link>
                      <Link
                        href="/saved"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 transition-colors"
                      >
                        <Heart className="h-4 w-4 text-muted" />
                        Saved
                      </Link>
                      {isVendor && (
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-muted" />
                          Dashboard
                        </Link>
                      )}
                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-primary/5 transition-colors"
                        >
                          <Shield className="h-4 w-4 text-muted" />
                          Admin
                        </Link>
                      )}
                      <hr className="my-1 border-muted/20" />
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-secondary hover:bg-secondary/5 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-foreground hover:bg-primary/5 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-primary to-primary/90 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25 transition-all hover:opacity-95"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-foreground hover:bg-primary/10 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/20 bg-white/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 font-body"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              {isVendor && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-primary font-medium hover:bg-primary/10 font-body border border-primary/20"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-primary font-medium hover:bg-primary/10 font-body border border-primary/20"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
              {session ? (
                <>
                  <hr className="border-muted/20 my-2" />
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-foreground hover:bg-primary/10"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/saved"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-foreground hover:bg-primary/10"
                  >
                    <Heart className="h-4 w-4" />
                    Saved
                  </Link>
                  {isVendor && (
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg text-foreground hover:bg-primary/10"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 rounded-lg text-foreground hover:bg-primary/10"
                    >
                      <Shield className="h-4 w-4" />
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 rounded-lg text-secondary hover:bg-secondary/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <hr className="border-muted/20 my-2" />
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-foreground hover:bg-primary/10"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-primary text-white font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
