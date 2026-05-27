"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zaoga-950 text-white mt-auto border-t border-white/5 relative overflow-hidden">
      {/* Subtle ambient gradient overlay for a premium dark-mode app aesthetic */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-zaoga-500/5 blur-[80px] pointer-events-none rounded-full" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="block group active:scale-[0.98] transition-transform origin-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 relative flex items-center justify-center bg-white/5 rounded-xl p-1.5 border border-white/10 shadow-inner">
                  <img
                    src="/images/logo-square.png"
                    alt="Laxson Nyamadzawo Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-white tracking-tight group-hover:text-gold-300 transition-colors">
                  Laxson Nyamadzawo
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-gold-400 bg-gold-400/10 px-2.5 py-1 rounded-full">
                District Pastor & Theologian
              </span>
            </Link>
            
            <p className="text-sm text-white/50 leading-relaxed font-light">
              Shepherding minister, chaplain, and gospel songwriter dedicated to
              the glory of God through pastoral care, theological education, and
              African gospel praise music in Zambia and Zimbabwe.
            </p>

            {/* Tactile App-Like Social Tiles */}
            <div className="flex gap-2.5 pt-2">
              {[
                {
                  label: "Facebook",
                  href: "https://facebook.com",
                  icon: (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  ),
                },
                {
                  label: "YouTube",
                  href: "https://youtube.com",
                  icon: (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M23 9.71a8.5 8.5 0 0 0-.91-4.13 2.92 2.92 0 0 0-1.72-1A78.36 78.36 0 0 0 12 4.27a78.45 78.45 0 0 0-8.34.3 2.87 2.87 0 0 0-1.46.74c-.9.83-1 2.25-1.1 3.45a48.29 48.29 0 0 0 0 6.48 9.55 9.55 0 0 0 .3 2 3.14 3.14 0 0 0 .71 1.36 2.86 2.86 0 0 0 1.49.78 45.18 45.18 0 0 0 6.5.33c3.5.05 6.57 0 10.2-.28a2.88 2.88 0 0 0 1.53-.78 2.49 2.49 0 0 0 .61-1 10.58 10.58 0 0 0 .52-3.4c.04-.56.04-3.94.04-4.54zM9.74 14.85V8.66l5.92 3.11c-1.97 1.03-3.94 2.06-5.92 3.08z" />
                    </svg>
                  ),
                },
                {
                  label: "Email",
                  href: "mailto:info@laxsonnyamadzawo.com",
                  icon: (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:border-gold-400/40 hover:text-gold-300 hover:bg-white/10 active:scale-95 transition-all duration-200"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="text-[11px] font-bold uppercase tracking-[3px] text-white/40">
              Navigation
            </h4>
            <ul className="space-y-3 font-light">
              {[
                { label: "About Pastor Laxson", href: "/#about" },
                { label: "Areas of Ministry", href: "/#ministry" },
                { label: "Theological Writings", href: "/writings" },
                { label: "Gospel Music", href: "/#music" },
                { label: "Contact", href: "/#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-gold-300 transition-colors duration-200 block py-1 md:py-0 active:translate-x-1 transition-transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Family & Witness */}
          <div className="space-y-5">
            <h4 className="text-[11px] font-bold uppercase tracking-[3px] text-white/40">
              Family & Witness
            </h4>
            <p className="text-sm text-white/70 leading-relaxed font-light">
              Blessed with partner{" "}
              <strong className="text-gold-300 font-medium">Runako</strong> and
              daughters{" "}
              <strong className="text-gold-300 font-medium">Ethel</strong>,{" "}
              <strong className="text-gold-300 font-medium">Providence</strong>, and{" "}
              <strong className="text-gold-300 font-medium">Makanaka Praise</strong>.
            </p>
            <div className="pt-2 border-t border-white/5 space-y-1">
              <p className="text-sm text-white/90 font-medium">
                District Pastor, Chilenje District
              </p>
              <p className="text-xs text-white/50 font-light">
                Lusaka, Zambia
              </p>
              <p className="text-xs text-white/50 font-light">
                ZAOGA Forward in Faith Ministries International
              </p>
            </div>
            
            <div className="pt-2">
              <a 
                href="https://fifmi.org/watch-ezekiel-tv/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-2 px-4 rounded-xl transition-all duration-200 active:scale-95"
              >
                <img 
                  src="/images/ezekieltvlogo.png" 
                  alt="Ezekiel TV" 
                  className="h-7 w-auto object-contain flex-shrink-0" 
                />
                <span className="text-xs text-white/80 font-medium">Watch Live</span>
              </a>
            </div>
          </div>

          {/* Scripture Quote */}
          <div className="space-y-5">
            <h4 className="text-[11px] font-bold uppercase tracking-[3px] text-white/40">
              The Anchor Word
            </h4>
            <div className="relative p-5 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 shadow-inner">
              <blockquote className="text-sm text-white/80 leading-relaxed italic font-light">
                &ldquo;But seek first his kingdom and his righteousness, and all
                these things will be given to you as well.&rdquo;
              </blockquote>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold-400 mt-4 block">
                — Matthew 6:33 (NIV)
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[11px] text-white/40 font-light tracking-wide">
            © {currentYear} Pastor Laxson Nyamadzawo. All rights reserved.
          </p>
          <p className="text-[11px] text-white/30 font-serif italic tracking-wide">
            To God be the glory, great things He has done.
          </p>
        </div>
      </div>
    </footer>
  );
}