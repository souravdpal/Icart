"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, User, X, Sparkles, CartonIcon, ShoppingBag } from "lucide-react";
import SearchPop from "./search-pop";

const links = [
  { href: "/", label: "Home" },
  { href: "/new/prod", label: "Explore", icon: Sparkles },
  { href: "/about", label: "About Us" },
];

type NavbarProps = {
  /** Number of items in the cart. Badge is hidden when 0. */
  cartCount?: number;
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-cyan-500";

const iconButtonClass = `relative flex items-center justify-center rounded-full p-2.5 text-white transition-all duration-200 hover:bg-white/20 active:scale-95 ${focusRing}`;

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add subtle shadow/blur enhancement on page scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close mobile menu with Escape key
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
      "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
      focusRing,
      isActive(href)
        ? "bg-white text-blue-700 shadow-md font-semibold scale-105"
        : "text-white/90 hover:bg-white/15 hover:text-white",
    ].join(" ");

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "p-2 sm:p-3" : "p-3 sm:p-4"
      }`}
    >
      <nav
        aria-label="Main Navigation"
        className="mx-auto max-w-7xl rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-4 py-2.5 shadow-xl shadow-blue-500/10 ring-1 ring-white/20 backdrop-blur-xl sm:px-6"
      >
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo / Brand Indicator */}
          <Link
            href="/"
            className={`group flex items-center gap-2 text-white font-bold tracking-wider text-lg transition-transform active:scale-95 ${focusRing} rounded-lg px-2 py-1`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 ring-1 ring-white/30 backdrop-blur-md transition-transform group-hover:rotate-12">
              <ShoppingBag/>
            </span>
            <span className="hidden sm:inline bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              Icart
            </span>
          </Link>

          {/* Desktop Page Links */}
          <ul className="hidden items-center gap-1.5 md:flex">
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

          {/* Action Buttons: Search, Account, Cart, Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <SearchPop />

            <Link
              href="/u/1/"
              aria-label="Account Dashboard"
              className={iconButtonClass}
            >
              <User className="size-5 transition-transform hover:scale-110" />
            </Link>

            <Link
              href="/cart"
              aria-label={
                cartCount > 0 ? `Cart with ${cartCount} items` : "Empty Cart"
              }
              className={iconButtonClass}
            >
              <ShoppingCart className="size-5 transition-transform hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 animate-pulse items-center justify-center rounded-full bg-white px-1 text-[11px] font-extrabold leading-none text-blue-700 shadow-md ring-2 ring-blue-600">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={`${iconButtonClass} md:hidden`}
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with Smooth Transition */}
        <div
          id="mobile-menu"
          className={`grid transition-all duration-300 ease-in-out md:hidden ${
            open
              ? "grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-white/20"
              : "grid-rows-[0fr] opacity-0 overflow-hidden pt-0"
          }`}
        >
          <ul className="flex flex-col gap-1 overflow-hidden">
            {links.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive(href)
                      ? "bg-white text-blue-700 font-semibold shadow-sm"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {Icon && <Icon className="size-4 opacity-75" />}
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}