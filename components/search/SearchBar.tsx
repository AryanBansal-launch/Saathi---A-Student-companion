"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const POPULAR_CATEGORIES = [
  "cheap mess near IIT Delhi",
  "hostel under ₹5000",
  "PG in Hauz Khas",
  "bike rental",
  "furniture near campus",
];

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  defaultQuery?: string;
  onSearch?: (query: string) => void;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchBar({
  placeholder = "Search listings...",
  className = "",
  defaultQuery = "",
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setQuery(defaultQuery);
  }, [defaultQuery]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  const handleSubmit = useCallback(
    (e: React.FormEvent, searchQuery?: string) => {
      e.preventDefault();
      const q = (searchQuery ?? query).trim();
      if (!q) return;

      setIsOpen(false);
      onSearch?.(q);
      router.push(`/search?q=${encodeURIComponent(q)}`);
    },
    [query, router, onSearch]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: string) => {
      setQuery(suggestion);
      handleSubmit(
        { preventDefault: () => {} } as React.FormEvent,
        suggestion
      );
    },
    [handleSubmit]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showSuggestions = isOpen && (query.length > 0 || debouncedQuery.length === 0);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-muted pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-white/60 bg-surface text-foreground placeholder:text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm font-body"
            aria-autocomplete="list"
            aria-expanded={showSuggestions}
            aria-controls="search-suggestions"
          />
        </div>
      </form>

      <p className="mt-2 text-xs text-muted font-body">
        Try: &quot;cheap mess near IIT Delhi under ₹3000&quot;
      </p>

      <AnimatePresence>
        {showSuggestions && (
          <motion.ul
            id="search-suggestions"
            role="listbox"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 py-2 rounded-xl bg-surface border border-white/60 shadow-xl z-50 overflow-hidden"
          >
            {POPULAR_CATEGORIES.map((suggestion, i) => (
              <li key={suggestion} role="option">
                <button
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setFocusedIndex(i)}
                  className={`w-full px-4 py-2.5 text-left text-sm font-body hover:bg-primary/10 transition-colors ${
                    focusedIndex === i ? "bg-primary/10" : ""
                  }`}
                >
                  <span className="text-foreground">{suggestion}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
