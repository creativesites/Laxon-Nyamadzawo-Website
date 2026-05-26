"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const pathname = usePathname();
  const router = useRouter();

  // Detect scrolling to add elevation/shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("laxon-theme");
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = (savedTheme as "light" | "dark") || systemPreference;
    
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("laxon-theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setIsOpen(false);
    
    // If on homepage, smooth scroll to the section
    if (pathname === "/") {
      e.preventDefault();
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const navLinks = [
    { label: "About", target: "about" },
    { label: "Ministry", target: "ministry" },
    { label: "Writings", target: "writings" },
    { label: "Music", target: "music" },
    { label: "Contact", target: "contact" }
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "py-4 shadow-md glass-nav" : "py-6 bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* Monogram Brand */}
        <Link href="/" className="group flex items-center space-x-2">
          <span className="font-serif text-2xl font-bold tracking-wider text-gold-500 group-hover:text-gold-600 transition-colors duration-300">
            LN
          </span>
          <span className="h-4 w-[1px] bg-gold-500/30 group-hover:bg-gold-500 transition-colors duration-300"></span>
          <span className="font-serif text-sm uppercase tracking-widest text-[#1c1c1a] dark:text-[#f4f4f3] opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            Nyamadzawo
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={pathname === "/" ? `#${link.target}` : `/#${link.target}`}
              onClick={(e) => handleNavClick(e, link.target)}
              className="text-sm font-medium tracking-wide text-[#1c1c1a]/85 dark:text-[#f4f4f3]/85 hover:text-gold-500 dark:hover:text-gold-400 transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute bottom-[-4px] left-0 w-0 h-[1.5px] bg-gold-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full border border-gold-500/10 hover:border-gold-500/35 hover:bg-gold-500/5 text-gold-600 dark:text-gold-400 transition-all duration-300 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        {/* Mobile Navbar Controls */}
        <div className="md:hidden flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gold-500/10 text-gold-600 dark:text-gold-400 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[#1c1c1a] dark:text-[#f4f4f3] hover:text-gold-500 focus:outline-none transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Overlay */}
      <div className={`md:hidden fixed top-[72px] left-0 w-full h-[calc(100vh-72px)] bg-[#fcfbf7]/98 dark:bg-[#0f0f0e]/98 backdrop-blur-md z-45 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8 px-6 pb-24">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={pathname === "/" ? `#${link.target}` : `/#${link.target}`}
              onClick={(e) => handleNavClick(e, link.target)}
              className="font-serif text-2xl font-medium tracking-wide text-[#1c1c1a] dark:text-[#f4f4f3] hover:text-gold-500 transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
