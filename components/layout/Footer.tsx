import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Logo from "./Logo";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/search", label: "Search" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

const categories = [
  { href: "/explore?category=hostel", label: "Hostels" },
  { href: "/explore?category=mess", label: "Mess" },
  { href: "/explore?category=bike", label: "Bikes" },
  { href: "/explore?category=accommodation", label: "Accommodation" },
  { href: "/explore?category=books", label: "Books" },
];

const socialLinks = [
  { href: "#", icon: Facebook, label: "Facebook" },
  { href: "#", icon: Twitter, label: "Twitter" },
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Linkedin, label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
          {/* About Saarthi */}
          <div className="lg:col-span-1">
            <Logo size="md" showWordmark href="/" />
            <p className="mt-5 font-body text-sm text-white/75 leading-relaxed max-w-xs">
              Your trusted companion for finding the best student services. From hostels and mess to bikes and books—discover verified listings tailored for campus life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white/95">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-sm text-white/75 hover:text-accent hover:translate-x-0.5 inline-block transition-all duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white/95">
              Categories
            </h3>
            <ul className="mt-5 space-y-3">
              {categories.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-sm text-white/75 hover:text-accent hover:translate-x-0.5 inline-block transition-all duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white/95">
              Contact
            </h3>
            <ul className="mt-5 space-y-3 font-body text-sm text-white/75">
              <li><a href="mailto:support@saarthi.com" className="hover:text-accent transition-colors">support@saarthi.com</a></li>
              <li>+91 98765 43210</li>
            </ul>
            <div className="mt-5 flex gap-2">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-primary hover:scale-105 transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="mt-14 pt-8 border-t border-white/15">
          <p className="font-body text-center text-sm text-white/55">
            © {new Date().getFullYear()} Saarthi. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
