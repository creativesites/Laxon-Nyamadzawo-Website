"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { databaseService, Writing } from "@/lib/supabase";

export default function WritingsHub() {
  const [allWritings, setAllWritings] = useState<Writing[]>([]);
  const [filtered, setFiltered] = useState<Writing[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", "Doctrine", "Ministry", "Resources", "Reflection"];

  useEffect(() => { databaseService.getWritings().then((d) => { setAllWritings(d); setFiltered(d); }); }, []);

  useEffect(() => {
    let result = allWritings;
    if (category !== "All") result = result.filter((w) => w.category === category);
    if (search.trim()) { const q = search.toLowerCase(); result = result.filter((w) => w.title.toLowerCase().includes(q) || w.excerpt.toLowerCase().includes(q)); }
    setFiltered(result);
  }, [search, category, allWritings]);

  return (
    <>
      <Navbar />
      {/* Page Header */}
      <section className="relative pt-32 pb-20 bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/ministry_bible.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <span className="inline-flex items-center gap-3 text-gold-400 text-xs font-semibold uppercase tracking-[4px] mb-4">
            <span className="w-10 h-px bg-gold-400" />Blog<span className="w-10 h-px bg-gold-400" />
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-4">Theological Writings</h1>
          <p className="text-white/60 max-w-xl mx-auto">Academic articles, doctrine summaries, and reflections on shepherding, culture, and biblical truth.</p>
        </div>
      </section>

      <main className="py-16 px-6 lg:px-8 bg-cream min-h-[60vh]">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                    category === c ? "bg-gold-500 text-white border-gold-500" : "border-gray-200 text-gray-500 hover:border-gold-400 hover:text-gold-600"
                  }`}>{c}</button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <input type="text" placeholder="Search writings..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold-500 transition-all" />
              <svg className="absolute left-3 top-3.5 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((w) => (
                <article key={w.id} className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm card-hover group">
                  <div className="relative h-48 bg-gradient-to-br from-gold-100 to-warm-gray flex items-center justify-center">
                    <span className="text-5xl opacity-20">📖</span>
                    <div className="absolute top-4 left-4"><span className="px-3 py-1 bg-gold-500 text-white text-[10px] font-semibold uppercase tracking-widest rounded">{w.category}</span></div>
                  </div>
                  <div className="p-7 space-y-3">
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
                      <span>{w.reading_time} min read</span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-charcoal leading-snug group-hover:text-gold-600 transition-colors">
                      <Link href={`/writings/${w.slug}`}>{w.title}</Link>
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{w.excerpt}</p>
                    <Link href={`/writings/${w.slug}`} className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold-600 hover:text-gold-700 mt-2 group/link">
                      Read Article <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg border border-gray-100">
              <span className="text-5xl mb-4 block opacity-30">📖</span>
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">No Writings Found</h3>
              <p className="text-sm text-gray-400">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
