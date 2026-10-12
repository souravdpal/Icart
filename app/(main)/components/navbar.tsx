"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, X } from "lucide-react";
import SearchPop from "./search-pop";

const links = [
  { href: "/", label: "Home" },
  { href: "/new/prod", label: "Explore new products" },
  { href: "/about", label: "About us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) =>
    [
      "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
      pathname === href
        ? "bg-white text-blue-700 shadow-sm"
        : "text-white hover:bg-white/20",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 p-2">
      <nav
        aria-label="Main"
        className="rounded-2xl bg-linear-to-r from-cyan-500 to-blue-500 px-4 py-3 shadow-md sm:px-6"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Page links (desktop) */}
          <ul className="hidden items-center gap-2 md:flex">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={pathname === href ? "page" : undefined}
                  className={linkClass(href)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2 text-white">
            <SearchPop />
            <Link
              href="/cart"
              aria-label="Cart"
              className="rounded-full p-2 transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ShoppingCart className="size-6" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="rounded-full p-2 transition-colors hover:bg-white/20 md:hidden"
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Page links (mobile) */}
        {open && (
          <ul id="mobile-menu" className="mt-3 flex flex-col gap-1 md:hidden">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === href ? "page" : undefined}
                  className={`block ${linkClass(href)}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}