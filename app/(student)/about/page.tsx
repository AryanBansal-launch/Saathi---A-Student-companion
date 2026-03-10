"use client";

import { motion } from "framer-motion";
import {
  Target,
  Users,
  Heart,
  Shield,
  Zap,
  Award,
  MapPin,
  Building2,
  UtensilsCrossed,
  Bike,
  BookOpen,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const VALUES = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "All vendors are verified. Your safety and satisfaction are our top priorities.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Built by students, for students. We understand your needs because we've been there.",
  },
  {
    icon: Zap,
    title: "Fast & Easy",
    description: "Find what you need in minutes, not days. Simple, intuitive, and efficient.",
  },
  {
    icon: Heart,
    title: "Student-Centric",
    description: "Affordable options, flexible terms, and services designed specifically for student life.",
  },
];

const STATS = [
  { value: "10,000+", label: "Happy Students" },
  { value: "500+", label: "Verified Vendors" },
  { value: "15+", label: "Cities Covered" },
  { value: "8", label: "Service Categories" },
];

const TEAM_VALUES = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To make student life easier by connecting students with trusted, affordable services in their new city. We believe every student deserves a smooth transition and a supportive community.",
  },
  {
    icon: Award,
    title: "Our Vision",
    description: "To become the go-to platform for students across India, creating a seamless ecosystem where finding essential services is effortless and reliable.",
  },
];

const SERVICES_HIGHLIGHT = [
  { icon: Building2, label: "Hostels & PGs" },
  { icon: UtensilsCrossed, label: "Mess & Dabba" },
  { icon: Bike, label: "Bike Rentals" },
  { icon: BookOpen, label: "Books & More" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-28 lg:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-background to-accent/[0.08]" />
        <div className="absolute top-20 left-1/3 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-1/3 w-80 h-80 rounded-full bg-secondary/10 blur-3xl" style={{ animation: "float 7s ease-in-out infinite 1s" }} />
        
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-sm font-medium uppercase tracking-wider text-primary mb-4"
          >
            About Saarthi
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight"
          >
            <span className="text-foreground">Your trusted </span>
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              companion
            </span>
            <span className="text-foreground"> in every new city</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="mt-6 font-body text-lg sm:text-xl text-muted max-w-3xl mx-auto leading-relaxed"
          >
            Moving to a new city for college or work can be overwhelming. Saarthi simplifies the journey by connecting you with verified, affordable services — all in one place.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 sm:py-20 bg-surface/60 border-y border-white/60">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="font-heading text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="font-body text-sm text-muted">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">
              Why we exist
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Mission & Vision
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {TEAM_VALUES.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-2xl bg-surface border border-white/60 p-8 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary mb-5">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="font-heading font-semibold text-foreground text-xl mb-3">
                  {item.title}
                </h3>
                <p className="font-body text-muted leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="px-4 py-20 sm:py-24 bg-surface/50">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">
              What we stand for
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-surface border border-white/60 p-6 shadow-card hover:shadow-card-hover transition-all duration-300 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary mx-auto mb-4">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold text-foreground text-base mb-2">
                  {value.title}
                </h3>
                <p className="font-body text-sm text-muted leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">
              What we offer
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Everything you need in one place
            </h2>
            <p className="font-body text-muted text-lg max-w-2xl mx-auto leading-relaxed">
              From finding the perfect PG to getting your daily meals sorted, we've curated the best services for student life.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {SERVICES_HIGHLIGHT.map((service, i) => (
              <motion.div
                key={service.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-white/40 hover:border-primary/30 hover:shadow-card transition-all duration-300"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary">
                  <service.icon className="h-7 w-7" />
                </div>
                <span className="font-heading font-medium text-foreground text-sm text-center">
                  {service.label}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 btn-primary px-8 py-3.5"
            >
              <Sparkles className="h-5 w-5" />
              Explore All Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-4 py-20 sm:py-24 bg-surface/60 border-t border-white/60">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">
              Our Story
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-6">
              How Saarthi came to be
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 font-body text-muted leading-relaxed"
          >
            <p className="text-base sm:text-lg">
              Saarthi was born from a simple observation: moving to a new city for college or work is exciting, but finding reliable services shouldn't be a nightmare.
            </p>
            <p className="text-base sm:text-lg">
              As students ourselves, we spent countless hours searching for hostels, comparing mess options, and hunting for affordable bike rentals. We realized there had to be a better way — a single platform where students could find everything they need, verified and trusted.
            </p>
            <p className="text-base sm:text-lg">
              Today, Saarthi serves thousands of students across India, helping them settle into their new cities with confidence. From your first day in a new place to your daily needs, we're here to guide you every step of the way.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-white/60 shadow-card text-center"
          >
            <MapPin className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
              Growing across India
            </h3>
            <p className="font-body text-muted leading-relaxed max-w-2xl mx-auto">
              Starting from Delhi and expanding to major student hubs like Mumbai, Bangalore, Pune, and beyond. Wherever students go, Saarthi follows.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-white/60 p-12 sm:p-16 shadow-soft"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Join the Saarthi community
            </h2>
            <p className="font-body text-muted text-lg mb-10">
              Whether you're a student looking for services or a vendor wanting to reach students, we're here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary">
                Get Started
              </Link>
              <Link href="/vendor/register" className="btn-secondary">
                Become a Vendor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
