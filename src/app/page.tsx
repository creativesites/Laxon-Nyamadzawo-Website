"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { databaseService, Writing, MusicTrack } from "@/lib/supabase";

export default function HomePage() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    databaseService.getWritings().then((d) => setWritings(d.slice(0, 3)));
    databaseService.getMusicTracks().then(setTracks);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await databaseService.submitContactMessage(formData);
    setFormSent(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setFormSent(false), 4000);
  };

  return (
    <>
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section id="hero" className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <Image src="/hero_church_bg.png" alt="Church sanctuary" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 animate-fade-in-up">
          <span className="inline-flex items-center gap-3 text-gold-300 text-xs font-semibold uppercase tracking-[4px] mb-6">
            <span className="w-10 h-px bg-gold-400" />Welcome<span className="w-10 h-px bg-gold-400" />
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Seek First the<br />
            <span className="text-gold-400">Kingdom of God</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            The ministry of Pastor Laxson Nyamadzawo — shepherding hearts through pastoral care, theological wisdom, and gospel praise.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })} className="btn-primary">
              Discover More
            </button>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="btn-outline">
              Get In Touch
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ═══ FEATURE CARDS ═══ */}
      <section className="relative z-20 -mt-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "🕊️", title: "Pastoral Care", desc: "Shepherding communities with compassion, prayer, and the healing Word of God." },
            { icon: "🎓", title: "Chaplaincy", desc: "Providing spiritual counsel and support across institutions and organizations." },
            { icon: "📖", title: "Theological Teaching", desc: "Academic exploration of scripture, doctrine, and the African Christian witness." },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-lg p-8 shadow-lg shadow-black/5 border border-gray-100 card-hover text-center">
              <span className="text-4xl mb-4 block">{card.icon}</span>
              <h3 className="font-serif text-xl font-bold text-charcoal mb-3">{card.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="py-28 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative animate-fade-in">
            <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-black/10">
              <Image src="/about_pastor.png" alt="Pastor Laxson Nyamadzawo" width={600} height={700} className="object-cover w-full" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-gold-500 text-white px-8 py-5 rounded-lg shadow-lg">
              <span className="text-3xl font-serif font-bold block">25+</span>
              <span className="text-xs uppercase tracking-widest font-semibold">Years of Ministry</span>
            </div>
          </div>
          <div className="space-y-6">
            <span className="section-label">About Pastor Laxson</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal leading-tight">
              A Life Dedicated to<br />
              <span className="text-gold-600">God&apos;s Purpose</span>
            </h2>
            <p className="text-gray-500 leading-relaxed text-lg">
              Pastor Laxson Nyamadzawo is a dedicated shepherding minister within <strong className="text-charcoal">ZAOGA Forward in Faith Ministries International</strong>. His calling encompasses pastoral care, hospital and institutional chaplaincy, academic theological writing, and Congolese rhumba gospel songwriting.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Blessed with his partner <strong className="text-gold-700">Runako</strong> and daughters <strong className="text-gold-700">Ethel</strong>, <strong className="text-gold-700">Providence</strong>, and <strong className="text-gold-700">Makanaka Praise</strong>, he serves with a heart anchored in Matthew 6:33.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {["Peace of Mind", "Open Hearts", "Faithful Service", "Community Care"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-medium text-charcoal">
                  <span className="w-2 h-2 bg-gold-500 rounded-full flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <button onClick={() => document.getElementById("ministry")?.scrollIntoView({ behavior: "smooth" })} className="btn-outline-dark mt-4">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ═══ FULL-WIDTH CTA BANNER ═══ */}
      <section className="relative py-24 overflow-hidden">
        <Image src="/ministry_worship.png" alt="Worship" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <span className="section-label !text-gold-300 before:!bg-gold-400">Ways We Can Help</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight mt-4 mb-6">
            Bringing Hope Through Faith & Service
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Whether through pastoral guidance, chaplaincy support, theological teaching, or the unifying power of gospel music — we are here to serve.
          </p>
          <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="btn-primary">
            Contact Pastor Laxson
          </button>
        </div>
      </section>

      {/* ═══ MINISTRY AREAS ═══ */}
      <section id="ministry" className="py-28 px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="section-label justify-center">Service</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mt-4 mb-6">Areas of Ministry</h2>
            <p className="text-gray-500 leading-relaxed">Serving the body of Christ through diverse and impactful areas of spiritual ministry.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: "/about_pastor.png", title: "Pastoral Care", text: "Walking alongside believers through seasons of joy and trial with prayer, counsel, and unwavering presence." },
              { img: "/ministry_worship.png", title: "Chaplaincy Services", text: "Providing spiritual support across hospitals, institutions, and organizations where comfort and guidance are needed most." },
              { img: "/ministry_bible.png", title: "Theological Research", text: "Academic exploration of scripture, the doctrine of the Trinity, and the intersection of faith with the African Christian experience." },
            ].map((item, i) => (
              <div key={i} className="group bg-white rounded-lg overflow-hidden shadow-md shadow-black/5 card-hover">
                <div className="relative h-64 overflow-hidden">
                  <Image src={item.img} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-8">
                  <h3 className="font-serif text-xl font-bold text-charcoal mb-3">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WRITINGS ═══ */}
      <section id="writings" className="py-28 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <span className="section-label">Blog</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mt-4">Theological Writings</h2>
            </div>
            <Link href="/writings" className="btn-outline-dark">View All Articles</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {writings.map((w) => (
              <article key={w.id} className="group bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm card-hover">
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-gold-100 to-warm-gray">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-20">📖</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-gold-500 text-white text-[10px] font-semibold uppercase tracking-widest rounded">
                      {w.category}
                    </span>
                  </div>
                </div>
                <div className="p-7 space-y-3">
                  <div className="flex items-center gap-4 text-[11px] text-gray-400 font-semibold uppercase tracking-widest">
                    <span>{new Date(w.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span>·</span>
                    <span>{w.reading_time} min read</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-charcoal leading-snug group-hover:text-gold-600 transition-colors">
                    <Link href={`/writings/${w.slug}`}>{w.title}</Link>
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{w.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MUSIC ═══ */}
      <section id="music" className="py-28 px-6 lg:px-8 bg-charcoal text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="section-label !text-gold-400 before:!bg-gold-400 justify-center">Listen</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mt-4 mb-6">Gospel Praise Music</h2>
            <p className="text-white/60 leading-relaxed">Congolese rhumba gospel compositions sung in Lingala, Shona, and English — lifting hearts in praise and worship.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tracks.map((track) => (
              <div key={track.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-gold-500/30 transition-all duration-300">
                {activeVideo === track.id ? (
                  <div className="space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <iframe src={`https://www.youtube.com/embed/${track.youtube_id}?autoplay=1`} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen title={track.title} />
                    </div>
                    <button onClick={() => setActiveVideo(null)} className="text-xs font-semibold uppercase tracking-widest text-gold-400 hover:text-gold-300 cursor-pointer">← Close Player</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-5">
                    <button onClick={() => setActiveVideo(track.id)} className="w-14 h-14 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0 hover:bg-gold-400 transition-colors cursor-pointer shadow-lg shadow-gold-500/20">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    </button>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-lg font-bold text-white truncate">{track.title}</h3>
                      <p className="text-sm text-white/50 mt-1">{track.language} · {track.description?.substring(0, 60)}...</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" className="py-28 px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <span className="section-label">Get In Touch</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal leading-tight">
              We&apos;d Love to<br /><span className="text-gold-600">Hear From You</span>
            </h2>
            <p className="text-gray-500 leading-relaxed text-lg">
              Whether you have questions about ministry, seek pastoral counsel, or would like to connect with Pastor Laxson, please reach out.
            </p>
            <div className="space-y-5 pt-4">
              {[
                { icon: "📍", label: "Location", value: "Zimbabwe, Southern Africa" },
                { icon: "✉️", label: "Email", value: "info@laxsonnyamadzawo.com" },
                { icon: "⛪", label: "Church", value: "ZAOGA Forward in Faith Ministries" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <span className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center text-xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-gold-600">{item.label}</span>
                    <p className="text-charcoal font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg p-10 shadow-xl shadow-black/5 border border-gray-100">
            {formSent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16 space-y-4 animate-scale-in">
                <span className="text-5xl">✅</span>
                <h3 className="font-serif text-2xl font-bold text-charcoal">Message Sent!</h3>
                <p className="text-gray-500 text-sm">Thank you for reaching out. Pastor Laxson will respond soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="font-serif text-2xl font-bold text-charcoal mb-2">Send a Message</h3>
                {[
                  { name: "name" as const, label: "Your Name", type: "text" },
                  { name: "email" as const, label: "Email Address", type: "email" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">{field.label}</label>
                    <input type={field.type} required value={formData[field.name]} onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 transition-all" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Message</label>
                  <textarea rows={5} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/20 transition-all resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full justify-center">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
