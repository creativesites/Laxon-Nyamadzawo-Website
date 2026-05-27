"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { databaseService, Writing } from "@/lib/supabase";

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [writing, setWriting] = useState<Writing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    databaseService.getWritingBySlug(slug).then((a) => { setWriting(a); setLoading(false); }).catch(() => setLoading(false));
  }, [slug]);

  const renderContent = (raw: string) => {
    if (!raw) return null;
    const lines = raw.split("\n");
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flush = (key: number) => {
      if (listItems.length > 0) {
        elements.push(<ul key={`ul-${key}`} className="list-disc pl-6 my-6 space-y-2 text-gray-600 leading-relaxed">{listItems.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: inline(item) }} />)}</ul>);
        listItems = [];
      }
    };
    const inline = (t: string) => t.replace(/\*\*(.*?)\*\*/g, "<strong class='font-semibold text-charcoal'>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>");

    lines.forEach((line, i) => {
      const t = line.trim();
      if (t.startsWith("## ")) { flush(i); elements.push(<h2 key={i} className="font-serif text-2xl md:text-3xl font-bold text-charcoal mt-14 mb-5 pb-3 border-b border-zaoga-200">{t.substring(3)}</h2>); }
      else if (t.startsWith("### ")) { flush(i); elements.push(<h3 key={i} className="font-serif text-xl md:text-2xl font-semibold text-charcoal mt-10 mb-4">{t.substring(4)}</h3>); }
      else if (t.startsWith("* ")) { listItems.push(t.substring(2)); }
      else if (/^\d+\.\s/.test(t)) { flush(i); elements.push(<p key={i} className="flex gap-3 my-3 text-gray-600 leading-relaxed"><span className="text-zaoga-500 font-bold">•</span><span dangerouslySetInnerHTML={{ __html: inline(t.replace(/^\d+\.\s/, "")) }} /></p>); }
      else if (t.length > 0) { flush(i); elements.push(<p key={i} className="my-4 text-gray-600 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: inline(t) }} />); }
      else { flush(i); }
    });
    flush(lines.length);
    return elements;
  };

  if (loading) return (<><Navbar /><div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-zaoga-200 border-t-zaoga-500 rounded-full animate-spin" /></div><Footer /></>);
  if (!writing) return (<><Navbar /><main className="min-h-screen pt-40 pb-24 px-6 flex flex-col items-center justify-center"><span className="text-6xl mb-6 opacity-30">📖</span><h1 className="font-serif text-3xl font-bold text-charcoal mb-3">Article Not Found</h1><p className="text-gray-400 text-sm mb-8">This article may have been moved or unpublished.</p><Link href="/writings" className="btn-primary">Return to Writings</Link></main><Footer /></>);

  return (
    <>
      <Navbar />
      {/* Header */}
      <section className="relative pt-32 pb-16 bg-charcoal">
        <div className="max-w-3xl mx-auto text-center px-6">
          <span className="inline-block px-4 py-1.5 bg-zaoga-500 text-white text-[10px] font-semibold uppercase tracking-widest rounded mb-6">{writing.category}</span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white leading-tight mb-6">{writing.title}</h1>
          <div className="flex items-center justify-center gap-6 text-xs text-white/50 font-semibold uppercase tracking-widest">
            <span>{new Date(writing.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span>·</span>
            <span>{writing.reading_time} min read</span>
          </div>
        </div>
      </section>

      <main className="py-16 px-6 lg:px-8">
        <article className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
            <Link href="/writings" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zaoga-600 hover:text-zaoga-700 transition-colors">← All Writings</Link>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }} className="text-xs font-semibold uppercase tracking-wider text-zaoga-600 hover:text-zaoga-700 transition-colors cursor-pointer">Share →</button>
          </div>
          <div className="prose max-w-none">{renderContent(writing.content)}</div>
          <div className="border-t border-gray-200 mt-16 pt-10 text-center space-y-3">
            <p className="font-serif italic text-zaoga-600 text-sm">&ldquo;To God be the glory, great things He has done.&rdquo;</p>
            <p className="text-xs uppercase tracking-widest font-semibold text-gray-400">Pastor Laxson Nyamadzawo</p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
