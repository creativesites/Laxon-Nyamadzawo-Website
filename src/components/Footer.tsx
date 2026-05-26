"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-white mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="block">
              <h3 className="font-serif text-2xl font-bold text-white">
                Laxson Nyamadzawo
              </h3>
              <span className="text-[10px] font-semibold uppercase tracking-[3px] text-gold-500">
                Pastor & Theologian
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Shepherding minister, chaplain, and gospel songwriter dedicated to
              the glory of God through pastoral care, theological education, and
              African gospel praise music.
            </p>
            <div className="flex gap-3">
              {[
                {
                  label: "Facebook",
                  href: "https://facebook.com",
                  icon: (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  ),
                },
                {
                  label: "YouTube",
                  href: "https://youtube.com",
                  icon: (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M23 9.71a8.5 8.5 0 0 0-.91-4.13 2.92 2.92 0 0 0-1.72-1A78.36 78.36 0 0 0 12 4.27a78.45 78.45 0 0 0-8.34.3 2.87 2.87 0 0 0-1.46.74c-.9.83-1 2.25-1.1 3.45a48.29 48.29 0 0 0 0 6.48 9.55 9.55 0 0 0 .3 2 3.14 3.14 0 0 0 .71 1.36 2.86 2.86 0 0 0 1.49.78 45.18 45.18 0 0 0 6.5.33c3.5.05 6.57 0 10.2-.28a2.88 2.88 0 0 0 1.53-.78 2.49 2.49 0 0 0 .61-1 10.58 10.58 0 0 0 .52-3.4c.04-.56.04-3.94.04-4.54zM9.74 14.85V8.66l5.92 3.11c-1.97 1.03-3.94 2.06-5.92 3.08z" />
                    </svg>
                  ),
                },
                {
                  label: "Email",
                  href: "mailto:info@laxsonnyamadzawo.com",
                  icon: (
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
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
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:border-gold-500 hover:text-gold-500 transition-all duration-300"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xs font-semibold uppercase tracking-[3px] text-gold-500">
              Quick Links
            </h4>
            <ul className="space-y-3">
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
                    className="text-sm text-white/50 hover:text-gold-400 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Family & Witness */}
          <div className="space-y-6">
            <h4 className="text-xs font-semibold uppercase tracking-[3px] text-gold-500">
              Family & Witness
            </h4>
            <p className="text-sm text-white/50 leading-relaxed">
              Blessed with partner{" "}
              <strong className="text-gold-400">Runako</strong> and
              daughters{" "}
              <strong className="text-gold-400">Ethel</strong>,{" "}
              <strong className="text-gold-400">Providence</strong>, and{" "}
              <strong className="text-gold-400">Makanaka Praise</strong>.
            </p>
            <p className="text-sm text-white/50 leading-relaxed">
              ZAOGA Forward in Faith Ministries International.
            </p>
          </div>

          {/* Scripture */}
          <div className="space-y-6">
            <h4 className="text-xs font-semibold uppercase tracking-[3px] text-gold-500">
              Daily Word
            </h4>
            <blockquote className="text-sm text-white/50 leading-relaxed italic border-l-2 border-gold-500/30 pl-4">
              &ldquo;But seek first his kingdom and his righteousness, and all
              these things will be given to you as well.&rdquo;
            </blockquote>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-500/70">
              — Matthew 6:33 (NIV)
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {currentYear} Pastor Laxson Nyamadzawo. All rights reserved.
          </p>
          <p className="text-xs text-white/30 font-serif italic">
            To God be the glory, great things He has done.
          </p>
        </div>
      </div>
    </footer>
  );
}
