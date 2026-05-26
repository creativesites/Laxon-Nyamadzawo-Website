"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { databaseService, Writing } from "@/lib/supabase";
import { Search, BookOpen, Clock, ArrowLeft, ChevronRight } from "lucide-react";

export default function WritingsHub() {
  const [allWritings, setAllWritings] = useState<Writing[]>([]);
  const [filteredWritings, setFilteredWritings] = useState<Writing[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Doctrine", "Ministry", "Resources", "Reflection"];

  // Load writings
  useEffect(() => {
    async function fetchWritings() {
      const data = await databaseService.getWritings();
      setAllWritings(data);
      setFilteredWritings(data);
    }
    fetchWritings();
  }, []);

  // Handle live filtering and search query
  useEffect(() => {
    let result = allWritings;

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(w => w.category === selectedCategory);
    }

    // Filter by Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(w => 
        w.title.toLowerCase().includes(query) || 
        w.excerpt.toLowerCase().includes(query)
      );
    }

    setFilteredWritings(result);
  }, [searchQuery, selectedCategory, allWritings]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-radial from-[#fcfbf7] via-[#f9f5ea] to-[#f5ebd9]/20 dark:from-[#131312] dark:via-[#0f0f0e] dark:to-[#090908] pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-12 animate-fade-in-up">
          
          {/* Back button and breadcrumb */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-600 dark:text-gold-400 hover:text-gold-700 transition-colors font-sans"
            >
              <ArrowLeft size={14} />
              Back to Home
            </Link>
          </div>

          {/* Page Header */}
          <div className="text-center md:text-left space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-[#1c1c1a] dark:text-[#f4f4f3]">
              Theological Writings & Research
            </h1>
            <p className="text-base text-[#1c1c1a]/70 dark:text-[#f4f4f3]/70 font-sans max-w-2xl leading-relaxed">
              Explore academic articles, doctrine summaries, and reflections on shepherding, culture, and biblical truth in the contemporary African church context.
            </p>
          </div>

          {/* Filtering Tools Panel */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-y border-gold-500/10 py-6">
            
            {/* Category selection */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4.5 py-2.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 cursor-pointer ${
                    selectedCategory === category
                      ? "bg-gold-500 text-white border-gold-500 shadow-md shadow-gold-500/10"
                      : "border-gold-500/10 bg-white/40 dark:bg-zinc-900/30 text-[#1c1c1a]/80 dark:text-[#f4f4f3]/80 hover:border-gold-500/40"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search writings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gold-500/10 focus:border-gold-500 focus:outline-hidden bg-white/40 dark:bg-zinc-900/30 text-sm font-sans"
              />
              <Search className="absolute left-3.5 top-3.5 text-gold-500/50" size={16} />
            </div>

          </div>

          {/* Dynamic Grid Results */}
          {filteredWritings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWritings.map((writing) => (
                <article
                  key={writing.id}
                  className="p-8 rounded-2xl border border-gold-500/10 bg-[#fcfbf7]/40 dark:bg-[#121211]/30 hover:border-gold-500/30 hover:shadow-lg hover:shadow-gold-500/3 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    
                    {/* Category & Read Time */}
                    <div className="flex items-center justify-between text-xs text-[#1c1c1a]/55 dark:text-[#f4f4f3]/55 font-semibold font-sans uppercase tracking-widest">
                      <span className="px-2.5 py-1 rounded-md bg-gold-500/5 border border-gold-500/10 text-gold-600 dark:text-gold-400">
                        {writing.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {writing.reading_time} Min Read
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-lg font-bold text-[#1c1c1a] dark:text-[#f4f4f3] leading-snug hover:text-gold-600 dark:hover:text-gold-400 transition-colors">
                      <Link href={`/writings/${writing.slug}`}>
                        {writing.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-[#1c1c1a]/70 dark:text-[#f4f4f3]/70 leading-relaxed font-sans line-clamp-4">
                      {writing.excerpt}
                    </p>

                  </div>

                  <Link
                    href={`/writings/${writing.slug}`}
                    className="mt-6 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold-600 dark:text-gold-400 hover:text-gold-700 font-sans group"
                  >
                    Read Full Article
                    <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/20 dark:bg-zinc-900/20 backdrop-blur-xs rounded-2xl border border-gold-500/5">
              <BookOpen size={48} className="text-gold-500/30 mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-[#1c1c1a] dark:text-[#f4f4f3] mb-1">
                No Writings Found
              </h3>
              <p className="text-sm text-[#1c1c1a]/60 dark:text-[#f4f4f3]/60 font-sans">
                Try adjusting your search criteria or category filter.
              </p>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
