"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { databaseService, Writing } from "@/lib/supabase";
import { ArrowLeft, Clock, Calendar, BookOpen, Share2 } from "lucide-react";

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [writing, setWriting] = useState<Writing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      if (!slug) return;
      try {
        const article = await databaseService.getWritingBySlug(slug);
        setWriting(article);
      } catch (err) {
        console.error("Failed to load article:", err);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [slug]);

  // A custom, lightweight renderer that converts basic Markdown structures to premium React components
  const renderContent = (rawText: string) => {
    if (!rawText) return null;
    
    const lines = rawText.split("\n");
    let inList = false;
    let listItems: string[] = [];
    const elements: React.ReactNode[] = [];

    const flushList = (key: number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="list-disc pl-6 my-6 space-y-3 text-base text-[#1c1c1a]/85 dark:text-[#f4f4f3]/85 font-sans leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={`li-${idx}`} dangerouslySetInnerHTML={{ __html: parseInlineStyles(item) }} />
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const parseInlineStyles = (text: string) => {
      // Bold syntax: **text**
      let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-gold-600 dark:text-gold-400'>$1</strong>");
      // Italic syntax: *text*
      formatted = formatted.replace(/\*(.*?)\*/g, "<em class='italic font-serif'>$1</em>");
      return formatted;
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Heading 2: ## Heading
      if (trimmed.startsWith("## ")) {
        flushList(index);
        inList = false;
        elements.push(
          <h2 key={index} className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-gold-600 dark:text-gold-400 mt-12 mb-6 border-b border-gold-500/10 pb-2">
            {trimmed.substring(3)}
          </h2>
        );
      }
      // Heading 3: ### Heading
      else if (trimmed.startsWith("### ")) {
        flushList(index);
        inList = false;
        elements.push(
          <h3 key={index} className="font-serif text-xl md:text-2xl font-semibold tracking-tight text-[#1c1c1a] dark:text-[#f4f4f3] mt-8 mb-4">
            {trimmed.substring(4)}
          </h3>
        );
      }
      // List items starting with *
      else if (trimmed.startsWith("* ")) {
        inList = true;
        listItems.push(trimmed.substring(2));
      }
      // List items starting with numbers (e.g. 1. )
      else if (/^\d+\.\s/.test(trimmed)) {
        flushList(index);
        inList = false;
        const text = trimmed.replace(/^\d+\.\s/, "");
        elements.push(
          <div key={index} className="flex items-start space-x-3 my-4 font-sans text-base text-[#1c1c1a]/85 dark:text-[#f4f4f3]/85 leading-relaxed">
            <span className="font-bold text-gold-600 dark:text-gold-400 mt-0.5">•</span>
            <p dangerouslySetInnerHTML={{ __html: parseInlineStyles(text) }} />
          </div>
        );
      }
      // Simple table support
      else if (trimmed.startsWith("|")) {
        flushList(index);
        inList = false;
        // Ignore table separator rows like | :--- | :--- |
        if (trimmed.includes("---")) return;

        const cells = trimmed.split("|").map(c => c.trim()).filter(c => c);
        const isHeader = index === 0 || lines[index - 1]?.trim() === ""; // simple heuristic
        
        elements.push(
          <div key={index} className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse border border-gold-500/10 font-sans text-sm">
              <tbody>
                <tr className="border-b border-gold-500/10 hover:bg-gold-500/5">
                  {cells.map((cell, idx) => (
                    <td key={idx} className={`p-4 border-r border-gold-500/10 ${isHeader ? "font-bold text-gold-600 dark:text-gold-400 bg-gold-500/5" : ""}`} dangerouslySetInnerHTML={{ __html: parseInlineStyles(cell) }} />
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        );
      }
      // Normal Paragraphs
      else if (trimmed.length > 0) {
        if (!inList) {
          elements.push(
            <p
              key={index}
              className="my-5 font-sans text-base md:text-lg text-[#1c1c1a]/85 dark:text-[#f4f4f3]/85 leading-relaxed tracking-wide"
              dangerouslySetInnerHTML={{ __html: parseInlineStyles(trimmed) }}
            />
          );
        } else {
          listItems.push(trimmed);
        }
      } else {
        flushList(index);
        inList = false;
      }
    });

    flushList(lines.length);
    return elements;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#fcfbf7] dark:bg-[#0f0f0e]">
          <div className="w-10 h-10 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!writing) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 flex flex-col items-center justify-center bg-[#fcfbf7] dark:bg-[#0f0f0e]">
          <div className="max-w-md text-center space-y-6">
            <BookOpen size={64} className="text-gold-500/40 mx-auto" />
            <h1 className="font-serif text-3xl font-bold text-[#1c1c1a] dark:text-[#f4f4f3]">
              Article Not Found
            </h1>
            <p className="text-sm text-[#1c1c1a]/60 dark:text-[#f4f4f3]/60 font-sans">
              The article you are searching for might have been moved or unpublished.
            </p>
            <Link
              href="/writings"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-500 text-white text-xs font-semibold uppercase tracking-wider hover:bg-gold-600 transition-colors"
            >
              <ArrowLeft size={14} />
              Return to Writings
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Format date helper
  const formattedDate = new Date(writing.published_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#fcfbf7] dark:bg-[#0c0c0b] pt-32 pb-24 px-6 md:px-12">
        <article className="max-w-3xl mx-auto space-y-10 animate-fade-in-up">
          
          {/* Upper Breadcrumb & Action Row */}
          <div className="flex items-center justify-between border-b border-gold-500/10 pb-6">
            <Link
              href="/writings"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-600 dark:text-gold-400 hover:text-gold-700 transition-colors font-sans"
            >
              <ArrowLeft size={14} />
              All Writings
            </Link>
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Article link copied to clipboard!");
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-600 dark:text-gold-400 hover:text-gold-700 transition-colors cursor-pointer font-sans"
            >
              <Share2 size={14} />
              Share Essay
            </button>
          </div>

          {/* Article Header */}
          <div className="space-y-6 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-md bg-gold-500/5 border border-gold-500/10 text-xs font-semibold font-sans uppercase tracking-widest text-gold-600 dark:text-gold-400">
              {writing.category}
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-[#1c1c1a] dark:text-[#f4f4f3] leading-tight">
              {writing.title}
            </h1>
            
            {/* Meta tags details */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-[#1c1c1a]/55 dark:text-[#f4f4f3]/55 font-semibold font-sans uppercase tracking-widest pt-2">
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {writing.reading_time} Min Read
              </span>
            </div>
          </div>

          {/* Decorative Divider */}
          <div className="divider-gold opacity-30"></div>

          {/* Main Article Body (Distraction-Free Reading Pane) */}
          <div className="prose dark:prose-invert max-w-none pt-4 pb-12">
            {renderContent(writing.content)}
          </div>

          {/* Decorative divider & signoff */}
          <div className="border-t border-gold-500/10 pt-10 text-center space-y-4">
            <p className="font-serif italic text-gold-600 dark:text-gold-400 text-sm">
              "To God be the glory, great things He has done."
            </p>
            <p className="text-xs uppercase tracking-widest font-sans font-semibold text-[#1c1c1a]/40 dark:text-[#f4f4f3]/40">
              Pastor Laxson Nyamadzawo
            </p>
          </div>

        </article>
      </main>

      <Footer />
    </>
  );
}
