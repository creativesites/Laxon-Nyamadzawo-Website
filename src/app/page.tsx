"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeartHandshake, GraduationCap, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { defaultHomepageContent } from "@/lib/homepage-content";
import { databaseService } from "@/lib/supabase";
import { useHomepageContent, useWritings } from "@/lib/data-hooks";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Star,
  Clock,
  Search,
  CalendarCheck,
  Rocket,
  User,
  Video,
  BookMarkedIcon,
  PlayCircle,
  Users,
  FileText,
  Award,
  Check,
  ArrowUpRight,
  Bookmark,
  Play,
  Headphones,
  Pause,
} from "lucide-react";

export default function HomePage() {
  const { data: homepageData } = useHomepageContent();
  const { data: writingsData } = useWritings();
  const { tracks, currentTrack, isPlaying, playTrack } = useMusicPlayer();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const homepageContent = homepageData || defaultHomepageContent;
  const writings = (writingsData || []).slice(0, 3);
  const aboutContent = homepageContent.about;
  const familyContent = homepageContent.family;
  const familyProfiles = [familyContent.ethel, familyContent.providence, familyContent.praise];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await databaseService.submitMessage(formData.name, formData.email, formData.message);
    setFormSent(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setFormSent(false), 4000);
  };

  return (
    <>
      <Navbar />

      {/* ═══ HERO ═══ */}
      {/* High-end app feel: 100dvh ensures perfect fit on mobile browsers. */}
      <section id="hero" className="relative h-[100dvh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <Image 
          src="/images/hero.webp" 
          alt="Church sanctuary" 
          fill 
          sizes="100vw" 
          className="object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zaoga-950/40 via-zaoga-950/70 to-zaoga-950/95" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 mt-16 animate-fade-in-up">
          <span className="inline-flex items-center gap-3 text-gold-300 text-[10px] sm:text-xs font-semibold uppercase tracking-[4px] mb-6 opacity-90">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-gold-400" />
            {homepageContent.hero.eyebrow}
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-gold-400" />
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
            {homepageContent.hero.title}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
              {homepageContent.hero.highlight}
            </span>
          </h1>
          <p className="text-white/80 text-base md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-light">
            {homepageContent.hero.description}
          </p>
          
          {/* Mobile App Touch Targets: Buttons are full width on mobile, inline on desktop */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
            <button 
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} 
              className="sm:w-auto btn-primary py-4 px-8 rounded-full flex items-center justify-center active:scale-95 transition-transform duration-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm"
            >
              {homepageContent.hero.primaryCtaLabel}
            </button>
            {/* <Link
              href="/music"
              className="w-full sm:w-auto py-3.5 px-7 flex items-center justify-center gap-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-base transition-all duration-200 active:scale-95 group"
            >
              <span className="flex gap-[2px] items-end h-3.5">
                <span className="w-[2px] rounded-full bg-amber-400 animate-[bounce_0.7s_ease-in-out_infinite]" style={{ height: '5px', animationDelay: '0s' }} />
                <span className="w-[2px] rounded-full bg-amber-400 animate-[bounce_0.7s_ease-in-out_infinite]" style={{ height: '14px', animationDelay: '0.15s' }} />
                <span className="w-[2px] rounded-full bg-amber-400 animate-[bounce_0.7s_ease-in-out_infinite]" style={{ height: '9px', animationDelay: '0.3s' }} />
              </span>
              Listen to Gospel Music
            </Link> */}
            <a 
              href="https://fifmi.org/watch-ezekiel-tv/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full sm:w-auto py-4 px-6 flex items-center justify-center gap-3.5 group transition-all duration-200 active:scale-95"
            >
              <img 
                src="/images/ezekieltvlogo.png" 
                alt="Ezekiel TV" 
                className="h-10 w-auto object-contain flex-shrink-0"
              />
              <span className="font-semibold text-white/90 group-hover:text-white transition-colors text-base relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-white/50 after:transition-all after:duration-300 group-hover:after:w-full">
                {homepageContent.hero.secondaryCtaLabel}
              </span>
            </a>
          </div>
        </div>

        {/* Subtle scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-70">
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/0 via-white/50 to-white/0 animate-pulse" />
        </div>
      </section>

      {/* ═══ FEATURE CARDS ═══ */}
      {/* Mobile App Feel: Horizontal snap-scrolling container instead of a long vertical stack */}
      <section className="relative z-20 -mt-12 px-0 md:px-8">
        <div className="max-w-6xl mx-auto flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 px-6 md:px-0 md:grid md:grid-cols-3 gap-4 md:gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[
            { key: "pastoral-care", icon: <HeartHandshake className="w-6 h-6 text-zaoga-600" /> },
            { key: "chaplaincy", icon: <GraduationCap className="w-6 h-6 text-zaoga-600" /> },
            { key: "teaching", icon: <BookOpen className="w-6 h-6 text-zaoga-600" /> },
          ].map(({ key, icon }, i) => {
            const card = homepageContent.featureCards[i];
            return (
            <div 
              key={key} 
              className="snap-center shrink-0 w-[85vw] md:w-auto bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] active:scale-[0.98]"
            >
              <div className="w-14 h-14 rounded-2xl bg-zaoga-50 flex items-center justify-center mb-6 shadow-inner">
                {icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal mb-3">{card?.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{card?.description}</p>
            </div>
          )})}
        </div>
      </section>

      {/* ═══ MUSIC PROMO STRIP ═══ */}
      <section id="music-preview" className="bg-zaoga-950 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-64 rounded-full bg-zaoga-600/20 blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-56 rounded-full bg-amber-500/10 blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 md:py-20 relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Left: Branding */}
          <div className="flex-1 min-w-0 text-center lg:text-left">
            <span className="inline-flex items-center gap-2.5 text-amber-400 text-[10px] font-bold uppercase tracking-[3px] mb-4">
              <Headphones size={13} />
              {homepageContent.musicPreview.eyebrow}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 tracking-tight">
              {homepageContent.musicPreview.title}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                {homepageContent.musicPreview.highlight}
              </span>
            </h2>
            <p className="text-white/50 text-sm md:text-base font-light max-w-sm mx-auto lg:mx-0 leading-relaxed mb-8">
              {homepageContent.musicPreview.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-3 justify-center lg:justify-start">
              <Link
                href="/music"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-zaoga-900 font-bold text-sm shadow-xl hover:bg-white/90 active:scale-95 transition-all duration-200"
              >
                <Play size={14} className="fill-zaoga-700 text-zaoga-700 ml-[2px]" />
                {homepageContent.musicPreview.primaryCtaLabel}
              </Link>
              <button
                onClick={() => tracks[0] && playTrack(tracks[0], false)}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-semibold text-sm transition-all duration-200 active:scale-95 cursor-pointer"
              >
                {homepageContent.musicPreview.secondaryCtaLabel}
              </button>
            </div>
          </div>

          {/* Right: Live Track List */}
          <div className="w-full lg:w-auto lg:flex-1 max-w-lg">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4 px-1">
                <p className="text-[10px] uppercase tracking-[2px] font-bold text-white/40">Tracks</p>
                {currentTrack && isPlaying && (
                  <span className="flex items-center gap-1.5 text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                    <span className="flex gap-[2px] items-end h-3">
                      <span className="w-[2px] rounded-full bg-amber-400 animate-[bounce_0.6s_ease-in-out_infinite]" style={{ height: '4px', animationDelay: '0s' }} />
                      <span className="w-[2px] rounded-full bg-amber-400 animate-[bounce_0.6s_ease-in-out_infinite]" style={{ height: '10px', animationDelay: '0.15s' }} />
                      <span className="w-[2px] rounded-full bg-amber-400 animate-[bounce_0.6s_ease-in-out_infinite]" style={{ height: '7px', animationDelay: '0.3s' }} />
                    </span>
                    Now Playing
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                {tracks.map((track) => {
                  const isActive = currentTrack?.id === track.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => playTrack(track, false)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 text-left cursor-pointer active:scale-[0.98] ${
                        isActive
                          ? "bg-white/15 border border-white/15"
                          : "hover:bg-white/8 border border-transparent hover:border-white/5"
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                        <Image
                          src={track.cover_image_url || "/images/laxon.jpeg"}
                          alt={track.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                        {isActive && isPlaying && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="flex items-end gap-[2px] h-3">
                              <span className="w-[2px] rounded-full bg-white animate-bounce" style={{ height: '4px', animationDelay: '0.1s' }} />
                              <span className="w-[2px] rounded-full bg-white animate-bounce" style={{ height: '12px', animationDelay: '0.25s' }} />
                              <span className="w-[2px] rounded-full bg-white animate-bounce" style={{ height: '7px', animationDelay: '0.15s' }} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm truncate transition-colors ${
                          isActive ? "text-white" : "text-white/75"
                        }`}>{track.title}</p>
                        <p className="text-white/35 text-xs truncate mt-0.5">
                          {track.language_tags.join(" · ")}
                        </p>
                      </div>

                      {/* Play/Pause button */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        isActive && isPlaying
                          ? "bg-amber-400 shadow-lg shadow-amber-400/30"
                          : isActive
                          ? "bg-white/20"
                          : "bg-white/10"
                      }`}>
                        {isActive && isPlaying ? (
                          <svg className="w-3 h-3 fill-zaoga-900" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                        ) : (
                          <svg className="w-3 h-3 fill-white ml-[2px]" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-white/8 text-center">
                <Link
                  href="/music"
                  className="text-xs font-semibold text-white/40 hover:text-white/70 transition-colors inline-flex items-center gap-1.5"
                >
                  Open full player with lyrics &amp; karaoke mode
                  <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="py-20 md:py-28 px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative order-2 lg:order-1 px-4 sm:px-0">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-zaoga-900/15 aspect-[4/5] sm:aspect-auto">
              <Image src={aboutContent.image} alt="Pastor Laxson Nyamadzawo" width={600} height={700} className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            {/* App-like floating badge */}
            <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-white/90 backdrop-blur-md border border-white/20 text-zaoga-900 px-6 sm:px-8 py-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <span className="text-3xl font-serif font-bold block text-transparent bg-clip-text bg-gradient-to-r from-zaoga-600 to-zaoga-400">{aboutContent.yearsValue}</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{aboutContent.yearsLabel}</span>
            </div>
          </div>
          <div className="space-y-6 order-1 lg:order-2">
            <span className="text-zaoga-500 text-xs font-bold uppercase tracking-[3px]">{aboutContent.eyebrow}</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal leading-[1.15] tracking-tight">
              {aboutContent.title}<br />
              <span className="text-zaoga-600">{aboutContent.highlight}</span>
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-base md:text-lg font-light">
              {aboutContent.narrative.split("\n\n").map((paragraph, index) => (
                <p key={`${paragraph.slice(0, 24)}-${index}`} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-4">
              {aboutContent.bulletPoints.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-medium text-charcoal bg-gray-50/50 py-2 px-3 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-zaoga-400 to-zaoga-600 flex-shrink-0 shadow-sm" />
                  {item}
                </div>
              ))}
            </div>
            <button 
              onClick={() => document.getElementById("ministry")?.scrollIntoView({ behavior: "smooth" })} 
              className="mt-6 w-full sm:w-auto px-8 py-4 rounded-full border border-gray-200 text-charcoal font-semibold hover:bg-gray-50 active:scale-95 transition-all duration-200"
            >
              {aboutContent.ctaLabel}
            </button>
          </div>
        </div>
      </section>

      {/* ═══ FAMILY SECTION (STICKY SCROLL-LAYERS) ═══ */}
      <section id="family" className="relative bg-zaoga-950 selection:bg-zaoga-500/30">

        {/* Section heading — scrolls away before cards pin */}
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 pt-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-[11px] font-black uppercase tracking-[0.2em] pb-0 mb-8 backdrop-blur-md">
           
            {familyContent.eyebrow}
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white mb-6 leading-[1.05] tracking-tight">
            {familyContent.title} <em className="italic text-gold-400 font-light font-serif">{familyContent.highlight}</em>
          </h2>
          <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
            {familyContent.description}
          </p>
        </div>

        {/* Cards wrapper — total scroll height = n cards × 100vh */}
        <div className="relative" style={{ height: "400vh" }}>

          {/* ── CARD 1 : Laxson & Runako (LIGHT THEME) ── */}
          <div className="sticky top-0 h-screen w-full flex items-center justify-center card-layer" data-card="1">
            {/* Card Container - Now White */}
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 h-[90vh] sm:h-[85vh] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden relative flex flex-col md:flex-row shadow-[0_20px_80px_rgba(0,0,0,0.8)] ring-1 ring-white/10 bg-white">

              {/* Background image */}
              <div className="absolute inset-0 w-full h-full object-cover object-center opacity-95">
                <Image 
                  src={familyContent.parents.image} 
                  alt={familyContent.parents.name} 
                  fill 
                  sizes="100vw"
                  className="object-cover" 
                />
              </div>
              {/* Light Gradients */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/65 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/66 via-transparent to-transparent md:hidden z-10" />

              {/* Left content */}
              <div className="relative z-20 flex flex-col justify-center p-6 sm:p-10 md:p-16 md:w-1/2 lg:w-[55%] h-full">
               

                <h3 className="font-serif pt-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-900 leading-[1.05] mb-4 sm:mb-6 tracking-tight">
                  {familyContent.parents.role}
                </h3>

                <p className="text-slate-800 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-10 max-w-md font-light">
                  {familyContent.parents.description}
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-10">
                  {familyContent.parents.features.map((f) => (
                    <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 ring-1 ring-slate-200 text-slate-700 text-[11px] sm:text-xs font-medium backdrop-blur-sm">
                      <Check className="h-3 w-3 text-zaoga-500 flex-shrink-0" />{f}
                    </span>
                  ))}
                </div>

                {/* Stat row */}
                <div className="flex items-center gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-slate-100">
                  <div>
                    <p className="text-xl sm:text-2xl font-semibold text-slate-900">{familyContent.parents.statPrimaryValue}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{familyContent.parents.statPrimaryLabel}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div>
                    <p className="text-xl sm:text-2xl font-semibold text-slate-900">{familyContent.parents.statSecondaryValue}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{familyContent.parents.statSecondaryLabel}</p>
                  </div>
                </div>
              </div>

              {/* Right floating UI card */}
              <div className="hidden md:flex relative z-20 flex-col justify-center items-end p-10 md:p-16 md:w-1/2 lg:w-[45%] gap-6">
                <div className="w-80 bg-white/80 backdrop-blur-2xl ring-1 ring-slate-200 rounded-3xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-transform hover:-translate-y-2 duration-500">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-zaoga-50 flex items-center justify-center flex-shrink-0">
                      <HeartHandshake className="h-4 w-4 text-zaoga-600" />
                    </div>
                    <div>
                      <p className="text-slate-900 text-sm font-medium tracking-wide">District Counseling</p>
                      <p className="text-slate-500 text-xs mt-0.5">Today · 4:00 PM · Chilenje</p>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full mb-3 overflow-hidden">
                    <div className="h-full w-full bg-zaoga-500 rounded-full" />
                  </div>
                  <p className="text-slate-500 text-[11px] uppercase tracking-wider font-bold">{familyContent.parents.badge}</p>
                </div>
              </div>

              {/* Card number */}
              <div className="absolute bottom-6 right-8 sm:bottom-10 sm:right-12 text-slate-900/5 font-serif font-bold text-6xl sm:text-8xl select-none pointer-events-none leading-none italic z-20">01</div>
            </div>
          </div>

          {/* ── CARD 2 : Ethel (WHITE + RIGHT IMAGE PANEL) ── */}
          <div className="sticky top-0 h-screen w-full flex items-center justify-center card-layer" data-card="2">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 h-[90vh] sm:h-[85vh] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden relative flex flex-col md:flex-row shadow-[0_20px_80px_rgba(0,0,0,0.12)] ring-1 ring-slate-100 bg-white">

              {/* ── Mobile Portrait Banner ── */}
              <div className="relative md:hidden w-full h-[42%] flex-shrink-0 bg-slate-100">
                <Image src={familyProfiles[0].image || "/images/ethel.jpg"} alt={familyProfiles[0].name} fill sizes="100vw" className="object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-5">
                  <p className="text-white font-serif text-lg font-semibold">{familyProfiles[0].name}</p>
                  <p className="text-white/70 text-[11px] tracking-wide line-clamp-1">{familyProfiles[0].credentials}</p>
                </div>
              </div>

              {/* ── Left: Editorial Content ── */}
              <div className="relative z-20 flex flex-col justify-center overflow-y-hidden p-5 sm:p-10 md:p-14 md:w-[52%] md:h-full">
                

                <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-slate-900 leading-[1.05] mb-4 sm:mb-6 tracking-tight">
                  {familyProfiles[0].role}
                </h3>

                <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6 sm:mb-10 max-w-md font-light">
                  {familyProfiles[0].description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
                  {familyProfiles[0].features.map((f) => (
                    <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 ring-1 ring-slate-200 text-slate-600 text-[11px] sm:text-xs font-medium">
                      <Check className="h-3 w-3 text-zaoga-500 flex-shrink-0" />{f}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-slate-100">
                  <div>
                    <p className="text-xl sm:text-2xl font-semibold text-slate-900">{familyProfiles[0].statPrimaryValue}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{familyProfiles[0].statPrimaryLabel}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div>
                    <p className="text-xl sm:text-2xl font-semibold text-slate-900">{familyProfiles[0].statSecondaryValue}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{familyProfiles[0].statSecondaryLabel}</p>
                  </div>
                </div>
              </div>

              {/* ── Right: Portrait Image Panel ── */}
              <div className="hidden md:flex md:w-[48%] relative items-center justify-center p-6 lg:p-10 bg-slate-50">
                {/* Decorative blobs */}
                <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-zaoga-100/60 blur-3xl pointer-events-none" />
                <div className="absolute bottom-16 left-6 w-32 h-32 rounded-full bg-gold-100/50 blur-2xl pointer-events-none" />

                {/* Portrait frame */}
                <div className="relative w-full max-w-[320px] h-[72%] rounded-[1.75rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] ring-1 ring-slate-200 group">
                  <Image
                    src={familyProfiles[0].image || "/images/ethel.jpg"}
                    alt={familyProfiles[0].name}
                    fill
                    sizes="320px"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle bottom name badge */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-5 pt-12">
                    <p className="text-white font-serif text-xl font-semibold leading-tight">{familyProfiles[0].name}</p>
                    <p className="text-white/70 text-xs font-medium tracking-wide mt-0.5">{familyProfiles[0].badge}</p>
                  </div>
                </div>

                {/* Floating credential badge */}
                <div className="absolute top-8 left-8 bg-white rounded-2xl shadow-lg ring-1 ring-slate-100 px-4 py-3 max-w-[240px]">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Degree / Status</p>
                  <p className="text-slate-800 text-xs font-semibold leading-normal">{familyProfiles[0].credentials}</p>
                </div>
              </div>

              <div className="absolute bottom-6 right-8 sm:bottom-10 sm:right-12 text-slate-900/[0.04] font-serif font-bold text-6xl sm:text-8xl select-none pointer-events-none leading-none italic z-20">02</div>
            </div>
          </div>

          {/* ── CARD 3 : Providence (WHITE + LEFT IMAGE PANEL) ── */}
          <div className="sticky top-0 h-screen w-full flex items-center justify-center card-layer" data-card="3">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 h-[90vh] sm:h-[85vh] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden relative flex flex-col md:flex-row-reverse shadow-[0_20px_80px_rgba(0,0,0,0.12)] ring-1 ring-slate-100 bg-white">

              {/* ── Mobile Portrait Banner ── */}
              <div className="relative md:hidden w-full h-[42%] flex-shrink-0 bg-slate-100">
                <Image src={familyProfiles[1].image || "/images/popo.jpg"} alt={familyProfiles[1].name} fill sizes="100vw" className="object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-5">
                  <p className="text-white font-serif text-lg font-semibold">{familyProfiles[1].name}</p>
                  <p className="text-white/70 text-[11px] tracking-wide line-clamp-1">{familyProfiles[1].credentials}</p>
                </div>
              </div>

              {/* ── Right: Editorial Content ── */}
              <div className="relative z-20 flex flex-col justify-center overflow-y-hidden p-5 sm:p-10 md:p-14 md:w-[52%] md:h-full">
                

                <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-slate-900 leading-[1.05] mb-4 sm:mb-6 tracking-tight">
                  {familyProfiles[1].role}
                </h3>

                <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6 sm:mb-10 max-w-md font-light">
                  {familyProfiles[1].description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
                  {familyProfiles[1].features.map((label, index) => (
                    <div key={label} className={`flex items-center justify-center px-4 py-2 rounded-full ring-1 text-[11px] sm:text-xs font-medium transition-colors ${index % 2 === 0 ? "bg-zaoga-50 ring-zaoga-200 text-zaoga-700" : "bg-slate-50 ring-slate-200 text-slate-600"}`}>
                      {label}
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-slate-100">
                  <div>
                    <p className="text-xl sm:text-2xl font-semibold text-slate-900">{familyProfiles[1].statPrimaryValue}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{familyProfiles[1].statPrimaryLabel}</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div>
                    <p className="text-xl sm:text-2xl font-semibold text-slate-900">{familyProfiles[1].statSecondaryValue}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{familyProfiles[1].statSecondaryLabel}</p>
                  </div>
                </div>
              </div>

              {/* ── Left: Portrait Image Panel ── */}
              <div className="hidden md:flex md:w-[48%] relative items-center justify-center p-6 lg:p-10 bg-slate-50">
                {/* Decorative blobs */}
                <div className="absolute top-12 left-10 w-48 h-48 rounded-full bg-gold-100/60 blur-3xl pointer-events-none" />
                <div className="absolute bottom-14 right-8 w-32 h-32 rounded-full bg-zaoga-100/50 blur-2xl pointer-events-none" />

                {/* Portrait frame */}
                <div className="relative w-full max-w-[320px] h-[72%] rounded-[1.75rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] ring-1 ring-slate-200 group">
                  <Image
                    src={familyProfiles[1].image || "/images/popo.jpg"}
                    alt={familyProfiles[1].name}
                    fill
                    sizes="320px"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-5 pt-12">
                    <p className="text-white font-serif text-xl font-semibold leading-tight">{familyProfiles[1].name}</p>
                    <p className="text-white/70 text-xs font-medium tracking-wide mt-0.5">{familyProfiles[1].badge}</p>
                  </div>
                </div>

                {/* Floating credential badge */}
                <div className="absolute top-8 right-8 bg-white rounded-2xl shadow-lg ring-1 ring-slate-100 px-4 py-3 max-w-[240px]">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Degree / Status</p>
                  <p className="text-slate-800 text-xs font-semibold leading-normal">{familyProfiles[1].credentials}</p>
                </div>

                {/* Star badge */}
                <div className="absolute bottom-8 right-8 bg-white rounded-2xl shadow-lg ring-1 ring-slate-100 px-4 py-3 flex items-center gap-2">
                  <Star className="h-3.5 w-3.5 text-gold-500" fill="currentColor" />
                  <p className="text-slate-800 text-xs font-semibold">{familyProfiles[1].badge}</p>
                </div>
              </div>

              <div className="absolute bottom-6 right-8 sm:bottom-10 sm:right-12 text-slate-900/[0.04] font-serif font-bold text-6xl sm:text-8xl select-none pointer-events-none leading-none italic z-20">03</div>
            </div>
          </div>

          {/* ── CARD 4 : Makanaka Praise (WARM CREAM + RIGHT IMAGE PANEL) ── */}
          <div className="sticky top-0 h-screen w-full flex items-center justify-center card-layer" data-card="4">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 h-[90vh] sm:h-[85vh] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden relative flex flex-col md:flex-row shadow-[0_20px_80px_rgba(0,0,0,0.12)] ring-1 ring-slate-100 bg-[#FDFBF7]">

              {/* ── Mobile Portrait Banner ── */}
              <div className="relative md:hidden w-full h-[42%] flex-shrink-0 bg-amber-50">
                <Image src={familyProfiles[2].image || "/images/praise.jpg"} alt={familyProfiles[2].name} fill sizes="100vw" className="object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-5">
                  <p className="text-white font-serif text-lg font-semibold">{familyProfiles[2].name}</p>
                  <p className="text-white/70 text-[11px] tracking-wide line-clamp-1">{familyProfiles[2].credentials}</p>
                </div>
              </div>

              {/* ── Left: Editorial Content ── */}
              <div className="relative z-20 flex flex-col justify-center p-5 sm:p-10 md:p-14 md:w-[52%] md:h-full">
                

                <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-slate-900 leading-[1.05] mb-4 sm:mb-6 tracking-tight">
                  {familyProfiles[2].role}
                </h3>

                <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6 sm:mb-10 max-w-md font-light">
                  {familyProfiles[2].description}
                </p>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
                  {[
                    { exam: "Praises", lift: "Shona & Lingala", label: "Daily worship languages" },
                    { exam: "Rhythm", lift: "Rhumba Gospel", label: "Gospel song style" },
                  ].map(({ exam, lift, label }) => (
                    <div key={exam} className="bg-white ring-1 ring-slate-100 rounded-2xl p-4 sm:p-5 text-center shadow-sm transition-transform hover:-translate-y-1 duration-300">
                      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{exam}</p>
                      <p className="text-lg sm:text-xl font-semibold text-slate-900 leading-tight mb-1">{lift}</p>
                      <p className="text-[10px] text-slate-400 font-medium leading-snug">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-start sm:items-center gap-4 pt-6 sm:pt-8 border-t border-slate-100">
                  <Award className="h-5 w-5 text-gold-500 mt-0.5 sm:mt-0 flex-shrink-0" />
                  <p className="text-slate-500 text-xs sm:text-sm font-light">
                    <span className="text-slate-800 font-medium">As for me and my house</span>, we will serve the Lord. — Joshua 24:15
                  </p>
                </div>
              </div>

              {/* ── Right: Portrait Image Panel ── */}
              <div className="hidden md:flex md:w-[48%] relative items-center justify-center p-6 lg:p-10 bg-[#F5F0E8]">
                {/* Decorative blobs */}
                <div className="absolute top-10 right-10 w-56 h-56 rounded-full bg-gold-200/40 blur-3xl pointer-events-none" />
                <div className="absolute bottom-16 left-6 w-36 h-36 rounded-full bg-zaoga-100/30 blur-2xl pointer-events-none" />

                {/* Portrait frame */}
                <div className="relative w-full max-w-[320px] h-[72%] rounded-[1.75rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.12)] ring-1 ring-amber-200/60 group">
                  <Image
                    src={familyProfiles[2].image || "/images/praise.jpg"}
                    alt={familyProfiles[2].name}
                    fill
                    sizes="320px"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-5 pt-12">
                    <p className="text-white font-serif text-xl font-semibold leading-tight">{familyProfiles[2].name}</p>
                    <p className="text-white/70 text-xs font-medium tracking-wide mt-0.5">{familyProfiles[2].badge}</p>
                  </div>
                </div>

                {/* Floating name-meaning badge */}
                <div className="absolute top-8 left-8 bg-white rounded-2xl shadow-lg ring-1 ring-amber-100 px-4 py-3 max-w-[240px]">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Degree / Status</p>
                  <p className="text-slate-800 text-xs font-semibold leading-normal">{familyProfiles[2].credentials}</p>
                </div>

                {/* Music badge */}
                <div className="absolute bottom-8 left-8 bg-white rounded-2xl shadow-lg ring-1 ring-amber-100 px-4 py-3 flex items-center gap-2">
                  <PlayCircle className="h-3.5 w-3.5 text-gold-500" />
                  <p className="text-slate-800 text-xs font-semibold">{familyProfiles[2].badge}</p>
                </div>
              </div>

              <div className="absolute bottom-6 left-8 sm:bottom-10 sm:left-12 text-slate-900/[0.04] font-serif font-bold text-6xl sm:text-8xl select-none pointer-events-none leading-none italic z-20">04</div>
            </div>
          </div>


        </div>{/* end cards-wrapper */}
      </section>

      {/* ═══ MINISTRY AREAS ═══ */}
      <section id="ministry" className="py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 px-6">
            <span className="text-zaoga-500 text-xs font-bold uppercase tracking-[3px]">{homepageContent.ministry.eyebrow}</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mt-4 mb-4 tracking-tight">{homepageContent.ministry.title}</h2>
            <p className="text-gray-500 leading-relaxed font-light">{homepageContent.ministry.description}</p>
          </div>
          
          {/* Mobile App Feel: Horizontal Swiping Cards */}
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar px-6 pb-12 gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-3 md:px-8">
            {homepageContent.ministry.items.map((item, i) => (
              <div key={i} className="snap-center shrink-0 w-[85vw] md:w-auto group bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 active:scale-[0.98] transition-transform duration-300">
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <Image src={item.img} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                  <h3 className="absolute bottom-5 left-6 right-6 font-serif text-2xl font-bold text-white tracking-wide">{item.title}</h3>
                </div>
                <div className="p-6 md:p-8">
                  <p className="text-sm md:text-base text-gray-500 leading-relaxed font-light">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MUSIC PLAYER (App Interface Style) ═══ */}
      <section id="music" className="py-24 bg-zaoga-950 text-white relative overflow-hidden">
        {/* Soft Ambient App Glows */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-zaoga-600/20 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gold-600/10 blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 px-6">
          <div className="text-center mb-12">
            <span className="text-gold-400 text-xs font-bold uppercase tracking-[3px]">{homepageContent.musicSection.eyebrow}</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mt-4 mb-4 tracking-tight">{homepageContent.musicSection.title}</h2>
            <p className="text-white/60 font-light text-sm md:text-base">
              {homepageContent.musicSection.description}
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 md:p-6 shadow-2xl">
            <div className="space-y-2">
              {tracks.map((track) => {
                const isActive = currentTrack?.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track, false)}
                    className={`w-full text-left flex items-center justify-between p-3 md:p-4 rounded-2xl transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                      isActive
                        ? "bg-white/15 shadow-inner border border-white/10"
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                        <Image
                          src={track.cover_image_url || "/images/laxon.jpeg"}
                          alt={track.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                        {isActive && isPlaying && (
                          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                            <div className="flex items-end gap-[3px] h-4">
                              <span className="w-1 bg-white animate-bounce h-2 rounded-full" style={{ animationDelay: "0.1s" }} />
                              <span className="w-1 bg-white animate-bounce h-4 rounded-full" style={{ animationDelay: "0.3s" }} />
                              <span className="w-1 bg-white animate-bounce h-3 rounded-full" style={{ animationDelay: "0.2s" }} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 pr-4">
                        <h4 className={`font-semibold text-base md:text-lg truncate transition-colors ${
                          isActive ? "text-white" : "text-white/90"
                        }`}>
                          {track.title}
                        </h4>
                        <p className="text-xs md:text-sm text-white/50 truncate mt-0.5 font-light">{track.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center flex-shrink-0 pr-2">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${
                        isActive ? "bg-white text-zaoga-900 shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "bg-white/10 text-white hover:bg-white/20"
                      }`}>
                        {isActive && isPlaying ? (
                          <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                        ) : (
                          <svg className="w-4 h-4 md:w-5 md:h-5 fill-current ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
               <Link href="/music" className="text-sm font-semibold text-white/80 hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-white/5 active:scale-95 inline-block">
                 {homepageContent.musicSection.ctaLabel} →
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WRITINGS (App Style Carousel) ═══ */}
      <section id="writings" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 px-6 lg:px-8">
            <div>
              <span className="text-zaoga-500 text-xs font-bold uppercase tracking-[3px]">{homepageContent.writingsSection.eyebrow}</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mt-4 tracking-tight">{homepageContent.writingsSection.title}</h2>
              <p className="mt-4 max-w-xl text-sm text-gray-500">{homepageContent.writingsSection.description}</p>
            </div>
            <Link href="/writings" className="hidden md:inline-flex px-6 py-3 rounded-full border border-gray-200 text-sm font-semibold text-charcoal hover:bg-gray-50 transition-colors">
              {homepageContent.writingsSection.ctaLabel}
            </Link>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar px-6 pb-8 gap-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-3 md:px-8">
            {writings.map((w) => (
              <Link key={w.id} href={`/writings/${w.slug}`} className="snap-center shrink-0 w-[80vw] md:w-auto group block active:scale-[0.98] transition-transform">
                <article className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden bg-gray-50">
                    {w.cover_image_url ? (
                      <Image 
                        src={w.cover_image_url} 
                        alt={w.title} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-zaoga-50 to-white flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                        <span className="text-6xl opacity-10">📖</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur text-zaoga-700 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                        {w.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 font-semibold uppercase tracking-widest mb-3">
                      <span>{new Date(w.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>{w.reading_time} min</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-charcoal leading-snug mb-3 group-hover:text-zaoga-600 transition-colors">
                      {w.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 font-light mt-auto">{w.excerpt}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Mobile view all button */}
          <div className="px-6 mt-2 md:hidden">
            <Link href="/writings" className="block w-full text-center px-6 py-4 rounded-full border border-gray-200 text-sm font-semibold text-charcoal active:bg-gray-50">
              {homepageContent.writingsSection.ctaLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT (High-End Forms) ═══ */}
      <section id="contact" className="py-24 bg-[#FAFAFA] px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 px-2">
            <div>
              <span className="text-zaoga-500 text-xs font-bold uppercase tracking-[3px]">{homepageContent.contact.eyebrow}</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mt-4 mb-4 tracking-tight">
                {homepageContent.contact.title} <span className="text-zaoga-600">{homepageContent.contact.highlight}</span>
              </h2>
              <p className="text-gray-500 leading-relaxed text-base md:text-lg font-light">
                {homepageContent.contact.description}
              </p>
            </div>
            
            <div className="space-y-6 pt-4">
              {homepageContent.contact.items.map((item) => (
                <div key={item.label} className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{item.label}</span>
                    <p className="text-charcoal font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
            {formSent ? (
              <div className="flex flex-col items-center justify-center text-center py-20 space-y-4 animate-fade-in-up">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-2">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="font-serif text-3xl font-bold text-charcoal tracking-tight">{homepageContent.contact.successTitle}</h3>
                <p className="text-gray-500 font-light">{homepageContent.contact.successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="font-serif text-2xl font-bold text-charcoal mb-4">{homepageContent.contact.formTitle}</h3>
                <div className="space-y-5">
                  {[
                    { name: "name" as const, label: "Your Name", type: "text", placeholder: "John Doe" },
                    { name: "email" as const, label: "Email Address", type: "email", placeholder: "john@example.com" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 pl-1">{field.label}</label>
                      <input 
                        type={field.type} 
                        required 
                        placeholder={field.placeholder}
                        value={formData[field.name]} 
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl text-sm focus:outline-none focus:bg-white focus:border-zaoga-500 focus:ring-4 focus:ring-zaoga-500/10 transition-all placeholder:text-gray-300" 
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2 pl-1">Message</label>
                    <textarea 
                      rows={4} 
                      required 
                      placeholder="How can we help you?"
                      value={formData.message} 
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl text-sm focus:outline-none focus:bg-white focus:border-zaoga-500 focus:ring-4 focus:ring-zaoga-500/10 transition-all resize-none placeholder:text-gray-300" 
                    />
                  </div>
                </div>
                <button type="submit" className="w-full btn-primary py-4 rounded-full font-semibold active:scale-[0.98] transition-transform duration-200 mt-2 shadow-lg shadow-zaoga-500/20">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
