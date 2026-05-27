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
          <Link href="/" className="block">
            <img
              src="/images/logo-horizontal.png"
              alt="Laxson Nyamadzawo"
              className="h-14 md:h-18 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) =>
              link.href ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[12px] font-semibold uppercase tracking-[2px] transition-colors duration-300 hover:text-zaoga-500 ${
                    scrolled ? "text-charcoal/80" : "text-white/90"
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={link.action}
                  className={`text-[12px] font-semibold uppercase tracking-[2px] transition-colors duration-300 hover:text-zaoga-500 cursor-pointer ${
                    scrolled ? "text-charcoal/80" : "text-white/90"
                  }`}
                >
                  {link.label}
                </button>
              )
            )}
            <a 
              href="https://fifmi.org/watch-ezekiel-tv/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full sm:w-auto py-4 px-6 flex items-center justify-center gap-3.5 group transition-all duration-200 active:scale-95"
            >
              <img 
                src="/images/ezekieltvlogo.png" 
                alt="Ezekiel TV" 
                className="h-10 w-auto object-contain flex-shrink-0" // Taller height (40px), renders in full color
              />
              <span className={`font-semibold transition-colors text-base relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:transition-all after:duration-300 group-hover:after:w-full ${
                scrolled 
                  ? "text-charcoal/90 group-hover:text-charcoal after:bg-zaoga-500" 
                  : "text-white/90 group-hover:text-white after:bg-white/50"
              }`}>
                Watch Ezekiel TV
              </span>
            </a>
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
           <a 
            href="https://fifmi.org/watch-ezekiel-tv/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full sm:w-auto py-4 px-6 flex items-center justify-center gap-3.5 group transition-all duration-200 active:scale-95"
          >
            <img 
              src="/images/ezekieltvlogo.png" 
              alt="Ezekiel TV" 
              className="h-10 w-auto object-contain flex-shrink-0" // Taller height (40px), renders in full color
            />
            <span className="font-semibold text-charcoal/90 group-hover:text-charcoal transition-colors text-base relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-zaoga-500 after:transition-all after:duration-300 group-hover:after:w-full">
              Watch Ezekiel TV
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
