"use client";

import Link from "next/link";

interface LogoProps {
  /** "sm" for navbar, "md" for auth/footer, "lg" for hero */
  size?: "sm" | "md" | "lg";
  /** Show wordmark "Saarthi" next to icon */
  showWordmark?: boolean;
  /** Use as link to home (default true) */
  href?: string | null;
  /** Optional class for wrapper */
  className?: string;
}

const sizeMap = {
  sm: { icon: 32, text: "text-xl" },
  md: { icon: 40, text: "text-2xl" },
  lg: { icon: 48, text: "text-3xl" },
};

export default function Logo({
  size = "sm",
  showWordmark = true,
  href = "/",
  className = "",
}: LogoProps) {
  const { icon: iconSize, text } = sizeMap[size];

  const content = (
    <>
      {/* Logo mark: guide badge — rounded square + path/destination */}
      <span className="relative flex-shrink-0" aria-hidden>
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          <defs>
            <linearGradient id="saarthi-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6C63FF" />
              <stop offset="100%" stopColor="#FF6584" />
            </linearGradient>
          </defs>
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="10"
            fill="url(#saarthi-logo-grad)"
          />
          {/* Curved path (guide) + dot (you) */}
          <path
            d="M11 28c2-4 6-6 10-6 4 0 8 2 10 6"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
          <circle cx="20" cy="14" r="4" fill="white" />
        </svg>
      </span>
      {showWordmark && (
        <span
          className={`font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent ${text} tracking-tight`}
        >
          Saarthi
        </span>
      )}
    </>
  );

  const wrapperClass = `inline-flex items-center gap-2.5 transition-all hover:opacity-90 ${className}`;

  if (href) {
    return (
      <Link href={href} className={wrapperClass}>
        {content}
      </Link>
    );
  }

  return <span className={wrapperClass}>{content}</span>;
}
