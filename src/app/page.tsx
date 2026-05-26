"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { databaseService, Writing, MusicTrack } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Music, 
  Heart, 
  GraduationCap, 
  Send, 
  CheckCircle,
  Play,
  FileText
} from "lucide-react";

export default function Home() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [music, setMusic] = useState<MusicTrack[]>([]);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  
  // Contact form state
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      const writingsData = await databaseService.getWritings();
      // Take the top 3 featured writings for the homepage
      setWritings(writingsData.slice(0, 3));
      
      const musicData = await databaseService.getMusicTracks();
      setMusic(musicData);
    }
    loadData();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    try {
      await databaseService.submitMessage(formData.name, formData.email, formData.message);
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error("Failed to submit:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 md:px-12 overflow-hidden bg-radial from-[#fcfbf7] via-[#f9f5ea] to-[#f5ebd9]/30 dark:from-[#131312] dark:via-[#0f0f0e] dark:to-[#090908]">
        {/* Background ambient gold glows */}
        <div className="absolute top-[20%] left-[10%] w-72 h-72 rounded-full bg-gold-500/5 dark:bg-gold-500/3 blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-gold-500/10 dark:bg-gold-500/3 blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center z-10 animate-fade-in-up mt-12">
          
          {/* Accent Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-600 dark:text-gold-400 mb-8">
            <Sparkles size={14} className="animate-spin-slow" />
            <span className="text-xs uppercase tracking-widest font-semibold font-sans">
              Faith · Ministry · Music
            </span>
          </div>

          {/* Name & Titles */}
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-[#1c1c1a] dark:text-[#f4f4f3] mb-6">
            Laxson <span className="text-gold-500 dark:text-gold-400">Nyamadzawo</span>
          </h1>
          <p className="text-lg md:text-xl font-medium uppercase tracking-widest text-[#1c1c1a]/70 dark:text-[#f4f4f3]/70 mb-10">
            Minister · Theologian · Songwriter
          </p>

          {/* Matthew 6:33 quote */}
          <div className="relative max-w-2xl mx-auto px-6 py-8 rounded-2xl bg-white/20 dark:bg-zinc-900/20 backdrop-blur-xs border border-gold-500/5 shadow-xs mb-12">
            <p className="font-serif text-xl md:text-2xl italic leading-relaxed text-[#1c1c1a]/95 dark:text-[#f4f4f3]/95">
              "But seek first his kingdom and his righteousness, and all these things will be given to you as well."
            </p>
            <p className="mt-3 text-xs uppercase tracking-widest font-semibold text-gold-600 dark:text-gold-400 font-sans">
              — Matthew 6:33
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#about"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gold-500 text-white font-medium hover:bg-gold-600 shadow-md shadow-gold-500/10 hover:shadow-gold-500/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              Discover More
              <ArrowRight size={18} />
            </a>
            <a
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-[#1c1c1a]/15 dark:border-[#f4f4f3]/15 hover:border-gold-500 text-[#1c1c1a] dark:text-[#f4f4f3] hover:text-gold-500 dark:hover:text-gold-400 font-medium transition-all duration-300 flex items-center justify-center cursor-pointer"
            >
              Get in Touch
            </a>
          </div>

        </div>

        {/* Scroll Hint */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity duration-300">
          <span className="text-[10px] uppercase tracking-widest font-semibold mb-2">Scroll</span>
          <div className="w-5 h-8 rounded-full border-2 border-gold-500/30 flex justify-center p-1">
            <div className="w-1 h-2 bg-gold-500 rounded-full animate-bounce"></div>
          </div>
        </div>

      </section>

      {/* 2. ABOUT ME SECTION */}
      <section id="about" className="py-24 px-6 md:px-12 bg-white dark:bg-[#0c0c0b] scroll-mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Visual Emblem/Placeholder */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-72 h-96 md:w-80 md:h-110 rounded-2xl overflow-hidden border-2 border-gold-500/20 p-2 bg-[#fcfbf7] dark:bg-zinc-900 shadow-2xl flex items-center justify-center">
              
              {/* Gold abstract geometry representing faith */}
              <div className="absolute inset-0 bg-radial from-gold-500/10 to-transparent"></div>
              
              {/* Elegant SVG Cross emblem as a placeholder until real photos arrive */}
              <div className="relative text-center p-8 flex flex-col items-center">
                <div className="w-16 h-28 border-4 border-gold-500/20 rounded-full flex items-center justify-center mb-6">
                  <div className="w-[4px] h-20 bg-gold-500 rounded-full"></div>
                  <div className="absolute w-12 h-[4px] bg-gold-500 rounded-full"></div>
                </div>
                <h4 className="font-serif text-xl font-bold text-gold-600 dark:text-gold-400">
                  Laxson Nyamadzawo
                </h4>
                <p className="text-xs uppercase tracking-widest text-[#1c1c1a]/60 dark:text-[#f4f4f3]/60 mt-2">
                  "Rooted in Faith, Called to Serve"
                </p>
              </div>

              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-gold-500"></div>
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-gold-500"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-gold-500"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-gold-500"></div>
            </div>
          </div>

          {/* Right Column: Bio */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 dark:text-gold-400 font-sans">
              About Me
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#1c1c1a] dark:text-[#f4f4f3]">
              Rooted in Faith,<br />Called to Serve
            </h2>
            
            <p className="text-base text-[#1c1c1a]/80 dark:text-[#f4f4f3]/80 leading-relaxed font-sans">
              I am Laxson Nyamadzawo — a minister, theologian, and songwriter whose life is shaped by a deep and active Christian faith. Rooted in the rich heritage of Zimbabwe and the broader African Christian tradition, I am devoted to the proclamation of the Gospel and the building up of God's people.
            </p>
            <p className="text-base text-[#1c1c1a]/80 dark:text-[#f4f4f3]/80 leading-relaxed font-sans">
              My work spans pastoral ministry, chaplaincy, academic theological writing, and gospel music — particularly in the Congolese rhumba tradition. I am blessed with my partner Runako and our daughters Ethel, Providence, and Makanaka Praise.
            </p>
            <p className="text-base text-[#1c1c1a]/80 dark:text-[#f4f4f3]/80 leading-relaxed font-sans">
              Everything I do flows from one conviction: that Jesus Christ is Lord, and that His kingdom is worth giving everything for.
            </p>

            {/* Keyword Pill Badges */}
            <div className="flex flex-wrap gap-2 pt-4">
              {["Theology", "Chaplaincy", "Gospel Music", "Pastoral Care", "Zimbabwe", "Lingala"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-full text-xs font-semibold tracking-wide border border-gold-500/10 bg-gold-500/5 text-gold-600 dark:text-gold-400 hover:border-gold-500/30 transition-all duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 3. AREAS OF MINISTRY SECTION */}
      <section id="ministry" className="py-24 px-6 md:px-12 bg-[#fcfbf7] dark:bg-[#0f0f0e] border-t border-gold-500/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 dark:text-gold-400 font-sans">
            Areas of Ministry
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#1c1c1a] dark:text-[#f4f4f3] mt-2">
            Serving Faithfully Across Callings
          </h2>
          <div className="w-16 h-[2px] bg-gold-500 mx-auto mt-4"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Pastoral Care */}
          <div className="glass-card p-8 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-gold-400 mb-6">
                <Heart size={24} />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1c1c1a] dark:text-[#f4f4f3]">
                Pastoral Ministry
              </h3>
              <p className="text-sm text-[#1c1c1a]/70 dark:text-[#f4f4f3]/70 leading-relaxed font-sans">
                Providing spiritual leadership, preaching, and shepherding within the local church. Committed to sound doctrine, expository teaching, and the discipleship of believers in the African Christian context.
              </p>
            </div>
            <a href="#contact" className="mt-8 text-xs font-semibold uppercase tracking-wider text-gold-600 dark:text-gold-400 hover:text-gold-700 flex items-center gap-1 group font-sans">
              Request Collaboration
              <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Card 2: Chaplaincy */}
          <div className="glass-card p-8 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-gold-400 mb-6">
                <Sparkles size={24} />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1c1c1a] dark:text-[#f4f4f3]">
                Chaplaincy
              </h3>
              <p className="text-sm text-[#1c1c1a]/70 dark:text-[#f4f4f3]/70 leading-relaxed font-sans">
                Offering pastoral presence, care, and spiritual support in institutional settings — bringing the peace and hope of Christ to those navigating life's most challenging seasons.
              </p>
            </div>
            <a href="#contact" className="mt-8 text-xs font-semibold uppercase tracking-wider text-gold-600 dark:text-gold-400 hover:text-gold-700 flex items-center gap-1 group font-sans">
              Connect with chaplain
              <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Card 3: Theology */}
          <div className="glass-card p-8 rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-gold-400 mb-6">
                <GraduationCap size={24} />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1c1c1a] dark:text-[#f4f4f3]">
                Theological Teaching
              </h3>
              <p className="text-sm text-[#1c1c1a]/70 dark:text-[#f4f4f3]/70 leading-relaxed font-sans">
                Engaging deeply with Christian doctrine — from Trinitarian theology to ecclesiology — through academic writing, teaching, and resources that equip the Church for faithful witness.
              </p>
            </div>
            <a href="#writings" className="mt-8 text-xs font-semibold uppercase tracking-wider text-gold-600 dark:text-gold-400 hover:text-gold-700 flex items-center gap-1 group font-sans">
              Read writings
              <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

        </div>
      </section>

      {/* 4. THEOLOGICAL WRITINGS SECTION */}
      <section id="writings" className="py-24 px-6 md:px-12 bg-white dark:bg-[#0c0c0b] scroll-mt-20 border-t border-gold-500/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between mb-16">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 dark:text-gold-400 font-sans">
              Writings & Academia
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#1c1c1a] dark:text-[#f4f4f3] mt-2">
              Words That Illuminate the Faith
            </h2>
          </div>
          <Link
            href="/writings"
            className="mt-4 md:mt-0 font-sans text-sm font-semibold text-gold-600 dark:text-gold-400 hover:text-gold-700 dark:hover:text-gold-300 flex items-center gap-1 group"
          >
            Browse All Writings
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {writings.map((writing) => (
            <article 
              key={writing.id} 
              className="p-8 rounded-2xl border border-gold-500/10 bg-[#fcfbf7]/40 dark:bg-[#121211]/30 hover:border-gold-500/30 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Meta details */}
                <div className="flex items-center justify-between text-xs text-[#1c1c1a]/55 dark:text-[#f4f4f3]/55 font-semibold font-sans uppercase tracking-widest">
                  <span className="px-2.5 py-1 rounded-md bg-gold-500/5 border border-gold-500/10 text-gold-600 dark:text-gold-400">
                    {writing.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {writing.reading_time} Min
                  </span>
                </div>

                {/* Writing Title */}
                <h3 className="font-serif text-lg font-bold text-[#1c1c1a] dark:text-[#f4f4f3] leading-snug hover:text-gold-600 dark:hover:text-gold-400 transition-colors">
                  <Link href={`/writings/${writing.slug}`}>
                    {writing.title}
                  </Link>
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-[#1c1c1a]/70 dark:text-[#f4f4f3]/70 leading-relaxed font-sans line-clamp-3">
                  {writing.excerpt}
                </p>

              </div>

              <Link
                href={`/writings/${writing.slug}`}
                className="mt-6 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold-600 dark:text-gold-400 hover:text-gold-700 font-sans group"
              >
                Read More
                <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 5. GOSPEL MUSIC SECTION */}
      <section id="music" className="py-24 px-6 md:px-12 bg-[#fcfbf7] dark:bg-[#0f0f0e] border-t border-gold-500/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 dark:text-gold-400 font-sans">
            Gospel Music
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#1c1c1a] dark:text-[#f4f4f3] mt-2">
            Songs Born From Worship
          </h2>
          <div className="w-16 h-[2px] bg-gold-500 mx-auto mt-4"></div>
        </div>

        {/* Dynamic Video Player Showcase */}
        {activeVideoId && (
          <div className="max-w-4xl mx-auto mb-12 rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl bg-black aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={activeVideoId}
              title="Gospel Music Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {music.map((track) => (
            <div 
              key={track.id} 
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                activeVideoId === track.youtube_url 
                  ? "border-gold-500 bg-gold-500/5 shadow-md shadow-gold-500/5" 
                  : "border-gold-500/10 bg-[#fcfbf7] dark:bg-[#131312] hover:border-gold-500/30"
              }`}
            >
              <div>
                
                {/* Upper row: Track number and languages */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-2xl font-black text-gold-500/20">
                    0{track.track_number}
                  </span>
                  <div className="flex gap-1.5">
                    {track.language_tags.map(lang => (
                      <span key={lang} className="text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/10 text-gold-600 dark:text-gold-400">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Track details */}
                <h3 className="font-serif text-lg font-bold text-[#1c1c1a] dark:text-[#f4f4f3] mb-2">
                  {track.title}
                </h3>
                <p className="text-xs text-[#1c1c1a]/70 dark:text-[#f4f4f3]/70 leading-relaxed font-sans mb-6">
                  {track.description}
                </p>

              </div>

              {/* Action buttons */}
              {track.youtube_url && (
                <button
                  onClick={() => {
                    // Toggle the player or switch active track
                    if (activeVideoId === track.youtube_url) {
                      setActiveVideoId(null);
                    } else {
                      setActiveVideoId(track.youtube_url || null);
                      // Smooth scroll up to player if screen size is small
                      const playerElement = document.getElementById("music");
                      if (playerElement) {
                        playerElement.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                  }}
                  className={`w-full py-3 rounded-full font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                    activeVideoId === track.youtube_url
                      ? "bg-gold-600 text-white hover:bg-gold-700"
                      : "border border-gold-500/30 hover:border-gold-500 text-gold-600 dark:text-gold-400 hover:bg-gold-500/5"
                  }`}
                >
                  <Play size={14} className={activeVideoId === track.youtube_url ? "animate-pulse" : ""} />
                  {activeVideoId === track.youtube_url ? "Close Player" : "Listen / Watch Video"}
                </button>
              )}

            </div>
          ))}
        </div>
      </section>

      {/* 6. CONTACT CONNECT SECTION */}
      <section id="contact" className="py-24 px-6 md:px-12 bg-white dark:bg-[#0c0c0b] border-t border-gold-500/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Wording & Side details */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 dark:text-gold-400 font-sans">
              Get in Touch
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-[#1c1c1a] dark:text-[#f4f4f3]">
              Let's Connect
            </h2>
            <p className="text-base text-[#1c1c1a]/70 dark:text-[#f4f4f3]/70 leading-relaxed font-sans">
              Whether you are seeking ministry collaboration, theological discussion, musical partnership, or simply wish to connect — I would be glad to hear from you. All for the glory of God.
            </p>
            
            <div className="divider-gold my-8 opacity-20"></div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-600 dark:text-gold-400">
                  <FileText size={16} />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-sans tracking-widest font-semibold text-[#1c1c1a]/50 dark:text-[#f4f4f3]/50">Affiliation</h4>
                  <p className="text-sm font-serif">ZAOGA Forward in Faith Ministries</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact form */}
          <div className="lg:col-span-7">
            <div className="p-8 md:p-10 rounded-3xl border border-gold-500/10 bg-[#fcfbf7]/40 dark:bg-[#121211]/30 backdrop-blur-xs relative overflow-hidden">
              
              {submitSuccess && (
                <div className="absolute inset-0 bg-[#fcfbf7] dark:bg-[#121211] z-20 flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                  <CheckCircle size={56} className="text-gold-500 mb-4 animate-bounce" />
                  <h3 className="font-serif text-2xl font-bold text-[#1c1c1a] dark:text-[#f4f4f3] mb-2">
                    Message Sent Successfully
                  </h3>
                  <p className="text-sm text-[#1c1c1a]/70 dark:text-[#f4f4f3]/70 font-sans max-w-sm">
                    Thank you for reaching out. Pastor Laxson Nyamadzawo will review your message and connect back with you soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="name" className="text-[10px] font-sans uppercase tracking-widest font-semibold text-[#1c1c1a]/60 dark:text-[#f4f4f3]/60">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="John Doe"
                      className="px-4 py-3 rounded-xl border border-gold-500/10 focus:border-gold-500 focus:outline-hidden bg-white/50 dark:bg-zinc-900/50 text-[#1c1c1a] dark:text-[#f4f4f3] font-sans text-sm transition-all"
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label htmlFor="email" className="text-[10px] font-sans uppercase tracking-widest font-semibold text-[#1c1c1a]/60 dark:text-[#f4f4f3]/60">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="johndoe@email.com"
                      className="px-4 py-3 rounded-xl border border-gold-500/10 focus:border-gold-500 focus:outline-hidden bg-white/50 dark:bg-zinc-900/50 text-[#1c1c1a] dark:text-[#f4f4f3] font-sans text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Message input */}
                <div className="flex flex-col space-y-2">
                  <label htmlFor="message" className="text-[10px] font-sans uppercase tracking-widest font-semibold text-[#1c1c1a]/60 dark:text-[#f4f4f3]/60">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="Write your message here..."
                    className="px-4 py-3 rounded-xl border border-gold-500/10 focus:border-gold-500 focus:outline-hidden bg-white/50 dark:bg-zinc-900/50 text-[#1c1c1a] dark:text-[#f4f4f3] font-sans text-sm transition-all resize-none"
                  ></textarea>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-gold-500/10 hover:shadow-gold-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span>Sending Message...</span>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={14} />
                    </>
                  )}
                </button>

              </form>

            </div>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}
