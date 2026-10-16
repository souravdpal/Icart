"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, User, X } from "lucide-react";
import SearchPop from "./search-pop";
import { v4 as uuidv4 } from 'uuid'

const links = [
  { href: "/", label: "Home" },
  { href: "/new/prod", label: "Explore new products" },
  { href: "/about", label: "About us" },
];

type NavbarProps = {
  /** Number of items in the cart. Badge is hidden when 0. */
  cartCount?: number;
};

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const iconBtn = `relative rounded-full p-2 text-white transition-colors hover:bg-white/20 ${focusRing}`;

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [tempId, SetTempID] = useState("")

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    SetTempID(uuidv4())


  }, [])
  // Close the mobile menu with Escape
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    [
      "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
      focusRing,
      isActive(href)
        ? "bg-white text-blue-700 shadow-sm"
        : "text-white hover:bg-white/20",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 p-2">
      <nav
        aria-label="Main"
        className="rounded-2xl bg-linear-to-r from-cyan-500 to-blue-500 px-4 py-3 shadow-lg ring-1 ring-white/20 sm:px-6"
      >
        <div className="flex items-center justify-between gap-4">
          {/* Page links (desktop) */}
          <ul className="hidden items-center gap-1 md:flex">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={linkClass(href)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions: search, account, cart, menu toggle */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <SearchPop />

            <Link
              href={`/u/${tempId}`}
              aria-label="Account"
              className={iconBtn}
            >
              <User className="size-6" />
            </Link>
            <Link
              href="/cart"
              aria-label={
                cartCount > 0 ? `Cart, ${cartCount} items` : "Cart"
              }
              className={iconBtn}
            >
              <ShoppingCart className="size-6" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs font-bold leading-5 text-blue-700 shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={`${iconBtn} md:hidden`}
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Page links (mobile) */}
        {open && (
          <ul
            id="mobile-menu"
            className="mt-3 flex flex-col gap-1 border-t border-white/25 pt-3 md:hidden"
          >
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
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