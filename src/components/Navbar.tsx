"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileOpen(false);
    if (pathname === "/") {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = `/#${sectionId}`;
    }
  };

  const navLinks = [
    { label: "Home", action: () => handleNavClick("hero") },
    { label: "About", action: () => handleNavClick("about") },
    { label: "Ministry", action: () => handleNavClick("ministry") },
    { label: "Writings", href: "/writings" },
    { label: "Music", action: () => handleNavClick("music") },
    { label: "Contact", action: () => handleNavClick("contact") },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg font-bold transition-all duration-300 ${
                scrolled
                  ? "bg-gold-500 text-white"
                  : "bg-white/20 backdrop-blur-sm text-white border border-white/30"
              }`}
            >
              L
            </div>
            <div className="flex flex-col">
              <span
                className={`font-serif text-lg font-bold tracking-wide transition-colors duration-300 ${
                  scrolled ? "text-charcoal" : "text-white"
                }`}
              >
                Laxson Nyamadzawo
              </span>
              <span
                className={`text-[10px] font-semibold uppercase tracking-[3px] transition-colors duration-300 ${
                  scrolled ? "text-gold-600" : "text-gold-300"
                }`}
              >
                Pastor & Theologian
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.href ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[13px] font-semibold uppercase tracking-[2px] transition-colors duration-300 hover:text-gold-500 ${
                    scrolled ? "text-charcoal/80" : "text-white/90"
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={link.action}
                  className={`text-[13px] font-semibold uppercase tracking-[2px] transition-colors duration-300 hover:text-gold-500 cursor-pointer ${
                    scrolled ? "text-charcoal/80" : "text-white/90"
                  }`}
                >
                  {link.label}
                </button>
              )
            )}
          </nav>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex flex-col gap-1.5 cursor-pointer"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                mobileOpen
                  ? "rotate-45 translate-y-2 bg-charcoal"
                  : scrolled
                  ? "bg-charcoal"
                  : "bg-white"
              }`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                mobileOpen
                  ? "opacity-0"
                  : scrolled
                  ? "bg-charcoal"
                  : "bg-white"
              }`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                mobileOpen
                  ? "-rotate-45 -translate-y-2 bg-charcoal"
                  : scrolled
                  ? "bg-charcoal"
                  : "bg-white"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 bg-white ${
          mobileOpen ? "max-h-96 border-b border-gray-100" : "max-h-0"
        }`}
      >
        <div className="px-6 py-6 space-y-1">
          {navLinks.map((link) =>
            link.href ? (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm font-semibold uppercase tracking-[2px] text-charcoal/80 hover:text-gold-500 transition-colors border-b border-gray-50"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                onClick={link.action}
                className="block w-full text-left py-3 text-sm font-semibold uppercase tracking-[2px] text-charcoal/80 hover:text-gold-500 transition-colors cursor-pointer border-b border-gray-50"
              >
                {link.label}
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
