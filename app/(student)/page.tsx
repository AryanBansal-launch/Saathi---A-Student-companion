"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  UtensilsCrossed,
  Bike,
  Home,
  Shirt,
  Armchair,
  BookOpen,
  Wrench,
  MapPin,
  Search,
  CheckCircle2,
  ArrowRight,
  Quote,
  Package,
  Navigation,
} from "lucide-react";
import RecommendationStrip from "@/components/ai/RecommendationStrip";
import LocationBanner from "@/components/location/LocationBanner";
import { useLocationContext } from "@/contexts/LocationContext";

const CATEGORY_INFO: Record<
  string,
  { icon: typeof Building2; label: string; slug: string }
> = {
  hostel: { icon: Building2, label: "Hostels & PGs", slug: "hostel" },
  mess: { icon: UtensilsCrossed, label: "Mess & Dabba", slug: "mess" },
  bike: { icon: Bike, label: "Bike Rental", slug: "bike" },
  accommodation: { icon: Home, label: "Accommodation", slug: "accommodation" },
  laundry: { icon: Shirt, label: "Laundry", slug: "laundry" },
  furniture: { icon: Armchair, label: "Furniture", slug: "furniture" },
  books: { icon: BookOpen, label: "Books", slug: "books" },
  other: { icon: Wrench, label: "Other", slug: "other" },
};

const POPULAR_CITIES = ["Delhi", "Mumbai", "Bangalore", "Pune", "Hyderabad", "Chennai"];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Choose your city",
    description: "Tell us where you're moving to and we'll show you the best options.",
    icon: MapPin,
  },
  {
    step: 2,
    title: "Browse services",
    description: "Explore hostels, mess, bikes, and more — all verified and trusted.",
    icon: Search,
  },
  {
    step: 3,
    title: "Connect & settle in",
    description: "Contact vendors directly and get settled in your new city.",
    icon: CheckCircle2,
  },
];

const TESTIMONIALS = [
  {
    name: "Priya S.",
    role: "IIT Delhi, 2nd year",
    text: "Found my perfect PG in Hauz Khas within a week. Saarthi made the whole process so easy!",
    avatar: "P",
  },
  {
    name: "Rahul M.",
    role: "BITS Pilani",
    text: "The mess recommendations were spot on. No more hunting for decent food near campus.",
    avatar: "R",
  },
  {
    name: "Ananya K.",
    role: "DU North Campus",
    text: "Bike rental, laundry, furniture — everything in one place. This app is a lifesaver!",
    avatar: "A",
  },
];

export default function HomePage() {
  const [cityInput, setCityInput] = useState("");
  const { city: detectedCity, requestLocation, loading } = useLocationContext();

  useEffect(() => {
    if (detectedCity && !cityInput) {
      setCityInput(detectedCity);
    }
  }, [detectedCity, cityInput]);

  return (
    <div className="min-h-screen">
      <LocationBanner />
      
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 sm:py-32 lg:py-40">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-background to-secondary/[0.06]" />
        <div className="absolute top-24 left-1/4 w-80 h-80 rounded-full bg-primary/15 blur-3xl animate-float" />
        <div className="absolute bottom-24 right-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" style={{ animation: "float 8s ease-in-out infinite 1s" }} />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-sm font-medium uppercase tracking-wider text-primary mb-4"
          >
            Your guide in a new city
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
          >
            <span className="text-foreground">New city. New start. </span>
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              We&apos;ve got your back.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="mt-6 font-body text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed"
          >
            Find hostels, mess, bikes, and everything you need — all in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center max-w-xl mx-auto"
          >
            <div className="relative w-full sm:max-w-sm">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder={detectedCity ? detectedCity : "Enter your city..."}
                list="cities"
                className="w-full pl-12 pr-14 py-3.5 rounded-2xl border-2 border-white/80 bg-surface text-foreground placeholder:text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-card font-body transition-all"
              />
              {!detectedCity && !loading && (
                <button
                  onClick={requestLocation}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                  title="Detect my location"
                >
                  <Navigation className="h-4 w-4" />
                </button>
              )}
              <datalist id="cities">
                {POPULAR_CITIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <Link
              href={cityInput.trim() ? `/explore?city=${encodeURIComponent(cityInput.trim())}` : "/explore"}
              className="btn-primary w-full sm:w-auto px-8 py-3.5"
            >
              Explore Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-sm font-medium uppercase tracking-wider text-primary mb-3"
          >
            Browse by category
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-14"
          >
            What are you looking for?
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {Object.entries(CATEGORY_INFO).map(([key, { icon: Icon, label, slug }], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/explore?category=${slug}`}
                  className="block group"
                >
                  <motion.div
                    whileHover={{ scale: 1.03, y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-surface border border-white/60 shadow-card hover:shadow-card-hover hover:border-primary/25 transition-all duration-300"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary group-hover:from-primary/25 group-hover:to-accent/25 transition-colors duration-300">
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="font-heading font-medium text-foreground text-sm text-center leading-snug">
                      {label}
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Build package CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14"
          >
            <Link href="/build-package" className="block group">
              <div className="flex flex-wrap items-center justify-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border-2 border-primary/20 hover:border-primary/40 shadow-card hover:shadow-card-hover transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary group-hover:bg-primary/30 transition-colors">
                  <Package className="h-6 w-6" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-heading font-semibold text-foreground text-lg">
                    Build me the best package
                  </p>
                  <p className="font-body text-sm text-muted mt-0.5">
                    Set your city, budget & veg/non-veg — get 2–3 curated combos (PG + food + laundry + bike).
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-20 sm:py-24 bg-surface/60 border-y border-white/60">
        <div className="mx-auto max-w-5xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-sm font-medium uppercase tracking-wider text-primary mb-3"
          >
            Simple steps
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-14"
          >
            How it works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white mb-4 shadow-lg">
                  <item.icon className="h-8 w-8" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-white font-heading font-bold text-sm">
                  {item.step}
                </span>
                <h3 className="font-heading font-semibold text-foreground text-lg mb-2">
                  {item.title}
                </h3>
                <p className="font-body text-muted text-sm leading-relaxed">
                  {item.description}
                </p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <RecommendationStrip city={detectedCity || cityInput || "Delhi"} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-20 sm:py-24 bg-surface/50">
        <div className="mx-auto max-w-6xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-sm font-medium uppercase tracking-wider text-primary mb-3"
          >
            Testimonials
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-14"
          >
            What students are saying
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.article
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-surface border border-white/60 p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <Quote className="h-10 w-10 text-primary/20 mb-4" />
                <p className="font-body text-foreground/90 mb-6 leading-relaxed">
                  &quot;{t.text}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 font-heading font-bold text-primary">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-foreground">{t.name}</p>
                    <p className="font-body text-sm text-muted">{t.role}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-24 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-white/60 p-12 sm:p-16 shadow-soft"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Ready to explore?
            </h2>
            <p className="font-body text-muted text-lg mb-10">
              Join thousands of students who found their perfect setup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary">
                Sign Up
              </Link>
              <Link href="/vendor/register" className="btn-secondary">
                List as Vendor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
