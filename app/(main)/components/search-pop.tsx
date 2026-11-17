"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ArrowRight } from "lucide-react";

type Product = {
  id: string;
  title: string;
  category: string;
  price: number;
  image?: string;
};

export default function SearchPop() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Wraps both form and dropdown

  const close = () => {
    setOpen(false);
    setQuery("");
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  // Focus input on open
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Close when clicking outside the entire search container
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Fetch live autocomplete suggestions with debounce
  useEffect(() => {
    if (!open || !query.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      inputRef.current?.focus();
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
    close();
  };

  // Handle clicking a suggestion item directly
  const handleSelectProduct = (id: string) => {
    router.push(`/prod/${id}`);
    close();
  };

  // Keyboard navigation & Enter redirection
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0 && suggestions[selectedIndex]) {
      e.preventDefault();
      handleSelectProduct(suggestions[selectedIndex].id);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search products"
        className="rounded-full p-2.5 text-white transition-all duration-200 hover:bg-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-cyan-500"
      >
        <Search className="size-5 transition-transform hover:scale-110" />
      </button>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <form
        onSubmit={submit}
        role="search"
        className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-3.5 pr-1.5 text-slate-900 shadow-xl ring-2 ring-white/90 transition-all duration-300 ease-out focus-within:ring-cyan-300"
      >
        <Search className="size-4 shrink-0 text-slate-400" />
        
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          aria-label="Search products"
          enterKeyHint="search"
          className="w-44 bg-transparent text-sm outline-none placeholder:text-slate-400 sm:w-72"
        />

        {loading && <Loader2 className="size-4 animate-spin text-cyan-600 shrink-0" />}

        <button
          type="button"
          onClick={close}
          aria-label="Close search"
          className="rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="size-4" />
        </button>
      </form>

      {/* Live Suggestions Dropdown */}
      {open && query.trim().length > 0 && (
        <div className="absolute right-0 mt-2 w-72 sm:w-96 overflow-hidden rounded-2xl bg-white/95 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Suggestions
            </div>

            {suggestions.length > 0 ? (
              <ul className="space-y-0.5">
                {suggestions.map((item, idx) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectProduct(item.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                        idx === selectedIndex ? "bg-cyan-50 text-cyan-900" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="size-9 rounded-lg object-cover ring-1 ring-slate-200 shrink-0" 
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500">₹{item.price} • {item.category}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : !loading ? (
              <div className="px-4 py-6 text-center text-sm text-slate-500">
                No products found matching &quot;{query}&quot;
              </div>
            ) : null}

            {/* View full search results button */}
            <div className="mt-2 border-t border-slate-100 pt-2">
              <button
                type="button"
                onClick={submit}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50"
              >
                <span>View all results for &quot;{query}&quot;</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}