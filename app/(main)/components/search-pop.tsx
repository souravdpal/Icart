"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchPop() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // focus the input when it opens
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`); // change to your search route
    close();
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search products"
        className="rounded-full p-2 transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <Search className="size-6" />
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      className="flex items-center gap-2 rounded-full border-2 border-blue-300 bg-white py-1 pl-3 pr-1 text-black shadow-md"
    >
      <Search className="size-5 shrink-0 text-gray-500" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && close()}
        placeholder="Search for products"
        aria-label="Search for products"
        className="w-32 bg-transparent text-sm outline-none sm:w-64"
      />
      <button
        type="button"
        onClick={close}
        aria-label="Close search"
        className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
      >
        <X className="size-4" />
      </button>
    </form>
  );
}