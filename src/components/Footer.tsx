"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      label: "Email", 
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ), 
      href: "mailto:info@laxsonnyamadzawo.com" 
    },
    { 
      label: "Facebook", 
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ), 
      href: "https://facebook.com" 
    },
    { 
      label: "YouTube", 
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <path d="m10 15 5-3-5-3z" />
        </svg>
      ), 
      href: "https://youtube.com" 
    },
    { 
      label: "WhatsApp", 
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ), 
      href: "https://wa.me/263771000000" // Replace with real number
    }
  ];

  return (
    <footer className="relative bg-[#f5ebd9]/30 dark:bg-[#0b0b0a] border-t border-gold-500/10 py-16 px-6 md:px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
        
        {/* Left Column - Branding & Signature */}
        <div className="flex flex-col space-y-4">
          <Link href="/" className="font-serif text-xl font-bold tracking-wider text-gold-600 dark:text-gold-500">
            Laxson Nyamadzawo
          </Link>
          <p className="text-sm text-[#1c1c1a]/70 dark:text-[#f4f4f3]/70 font-serif italic max-w-sm mx-auto md:mx-0">
            "But seek first his kingdom and his righteousness, and all these things will be given to you as well."
            <span className="block mt-1 text-xs text-gold-600 dark:text-gold-500 not-italic">— Matthew 6:33</span>
          </p>
        </div>

        {/* Center Column - Family Dedication */}
        <div className="flex flex-col space-y-4 items-center md:items-start">
          <h4 className="font-serif text-sm uppercase tracking-widest text-[#1c1c1a]/60 dark:text-[#f4f4f3]/60 font-semibold">
            Family & Witness
          </h4>
          <p className="text-sm text-[#1c1c1a]/80 dark:text-[#f4f4f3]/80 leading-relaxed max-w-xs text-center md:text-left">
            Blessed with partner <strong className="text-gold-600 dark:text-gold-500 font-semibold">Runako</strong> and daughters <strong className="text-gold-600 dark:text-gold-500 font-semibold">Ethel, Providence</strong>, and <strong className="text-gold-600 dark:text-gold-500 font-semibold">Makanaka Praise</strong>.
          </p>
        </div>

        {/* Right Column - Connect */}
        <div className="flex flex-col space-y-4 items-center md:items-start">
          <h4 className="font-serif text-sm uppercase tracking-widest text-[#1c1c1a]/60 dark:text-[#f4f4f3]/60 font-semibold">
            Let's Connect
          </h4>
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-gold-500/10 hover:border-gold-500/35 hover:bg-gold-500/5 text-gold-600 dark:text-gold-400 transition-all duration-300"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
          <span className="text-xs text-[#1c1c1a]/50 dark:text-[#f4f4f3]/50">
            Active Ministry, Academic Research & Gospel Praise.
          </span>
        </div>

      </div>

      {/* Decorative center divider */}
      <div className="divider-gold my-10 opacity-30"></div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-[#1c1c1a]/50 dark:text-[#f4f4f3]/50 space-y-4 md:space-y-0">
        <p>© {currentYear} Laxson Nyamadzawo. All rights reserved.</p>
        <p className="font-serif italic text-gold-600 dark:text-gold-500">
          "To God be the glory, great things He has done."
        </p>
      </div>
    </footer>
  );
}
