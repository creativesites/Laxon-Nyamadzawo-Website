"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useSWRConfig } from "swr";
import {
  Music,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Eye,
  Lock,
  Unlock,
  Clock,
  Play,
  Pause,
  Save,
  Globe,
  RefreshCw,
  CheckCircle2,
  Users,
  X,
  Mic,
  AlertCircle,
  TrendingUp,
  Mail,
  User
} from "lucide-react";
import { databaseService, Writing, MusicTrack, ContactMessage, LyricLine } from "@/lib/supabase";
import { defaultHomepageContent, HomepageContent } from "@/lib/homepage-content";
import { useHomepageContent, useMessages, useMusicTracks, useWritings } from "@/lib/data-hooks";
import HomepageCmsEditor from "@/components/admin/HomepageCmsEditor";

// Secure custom Markdown Parser
function parseMarkdown(md: string): string {
  if (!md) return "";
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Headers
  html = html.replace(/^### (.*?)$/gm, '<h4 class="text-lg font-bold text-[#5b1d8f] mt-4 mb-2 font-serif">$1</h4>');
  html = html.replace(/^## (.*?)$/gm, '<h3 class="text-xl font-bold text-[#5b1d8f] mt-5 mb-2 font-serif border-b border-gray-100 pb-1">$1</h3>');
  html = html.replace(/^# (.*?)$/gm, '<h2 class="text-2xl font-bold text-[#5b1d8f] mt-6 mb-3 font-serif">$1</h2>');

  // Bold / Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

  // Blockquotes / Alerts
  html = html.replace(/^> \[!NOTE\]\s*([\s\S]*?)(?=(?:^[^>])|\n\n|$)/gm, '<div class="my-4 p-4 bg-purple-50 border-l-4 border-[#5b1d8f] text-[#5b1d8f] rounded-r-lg">$1</div>');
  html = html.replace(/^> \[!IMPORTANT\]\s*([\s\S]*?)(?=(?:^[^>])|\n\n|$)/gm, '<div class="my-4 p-4 bg-amber-50 border-l-4 border-amber-500 text-amber-900 rounded-r-lg">$1</div>');
  html = html.replace(/^>\s?(.*?)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">$1</blockquote>');

  // Lists
  html = html.replace(/^\*\s(.*)$/gm, '<li class="ml-4 list-disc text-gray-700 my-1">$1</li>');
  html = html.replace(/^-\s(.*)$/gm, '<li class="ml-4 list-disc text-gray-700 my-1">$1</li>');

  // Paragraphs
  const blocks = html.split(/\n\n+/);
  html = blocks.map(block => {
    const trimmed = block.trim();
    if (trimmed.startsWith('<h') || trimmed.startsWith('<div') || trimmed.startsWith('<blockquote') || trimmed.startsWith('<li')) {
      return trimmed;
    }
    return `<p class="text-gray-700 leading-relaxed my-3">${trimmed.replace(/\n/g, '<br/>')}</p>`;
  }).join("\n");

  return html;
}

// Convert seconds into MM:SS format helper
function formatTime(s: number): string {
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function AdminDashboard() {
  const { mutate } = useSWRConfig();
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("laxon_admin_authenticated") === "true";
  });
  const [adminSecret, setAdminSecret] = useState(() => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("laxon_admin_secret") || "";
  });
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Current tab state
  const [activeTab, setActiveTab] = useState<"overview" | "writings" | "music" | "homepage" | "messages">("overview");

  // Editing items state
  const [editingWriting, setEditingWriting] = useState<Partial<Writing> | null>(null);
  const [editingTrack, setEditingTrack] = useState<Partial<MusicTrack> | null>(null);
  const [lyricRows, setLyricRows] = useState<LyricLine[]>([]);
  
  // Audio Player states for lyrics alignment
  const [lyricsAudioUrl, setLyricsAudioUrl] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const [homepageDraft, setHomepageDraft] = useState<HomepageContent | null>(null);
  const [isSavingHomepage, setIsSavingHomepage] = useState(false);
  const [isMigratingContent, setIsMigratingContent] = useState(false);
  const [isCreatingSupabaseAdmin, setIsCreatingSupabaseAdmin] = useState(false);
  const [supabaseAdminForm, setSupabaseAdminForm] = useState({
    name: "Site Admin",
    email: "",
    password: "",
  });

  // Action status messages
  const [actionStatus, setActionStatus] = useState({ type: "", message: "" });
  const { data: writingsData = [] } = useWritings(isAuthenticated);
  const { data: tracksData = [] } = useMusicTracks(isAuthenticated);
  const { data: messagesData = [] } = useMessages(isAuthenticated);
  const { data: homepageData = defaultHomepageContent, mutate: mutateHomepage } = useHomepageContent(isAuthenticated);
  const writings = writingsData;
  const tracks = tracksData;
  const messages = messagesData;
  const homepageDraftValue = homepageDraft || homepageData;

  // Sync state status helper
  const showStatus = (type: "success" | "error", message: string) => {
    setActionStatus({ type, message });
    setTimeout(() => setActionStatus({ type: "", message: "" }), 4000);
  };

  const uploadToBucket = async (bucket: "images" | "music", file: File, folder: string) => {
    setUploadingField(folder);
    try {
      const url = await databaseService.uploadPublicFile(bucket, file, folder);
      showStatus("success", `${file.name} uploaded successfully.`);
      return url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      showStatus("error", message);
      throw err;
    } finally {
      setUploadingField(null);
    }
  };

  // Auth gate check handler
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "LaxsonMin2026!";
    const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || "6033";

    if (pinInput === correctPassword || pinInput === correctPin) {
      setIsAuthenticated(true);
      setAdminSecret(pinInput);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("laxon_admin_authenticated", "true");
        sessionStorage.setItem("laxon_admin_secret", pinInput);
      }
      setPinInput("");
      setAuthError("");
    } else {
      setAuthError("Incorrect PIN or Password code. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminSecret("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("laxon_admin_authenticated");
      sessionStorage.removeItem("laxon_admin_secret");
    }
  };

  // --- Writings Operations ---
  const handleEditWriting = (w: Writing) => {
    setEditingWriting({ ...w });
  };

  const handleNewWriting = () => {
    setEditingWriting({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "Doctrine",
      published: false,
      cover_image_url: "/images/Bindura1960s.jpeg",
      reading_time: 5
    });
  };

  const handleSaveWriting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWriting || !editingWriting.title || !editingWriting.content) return;

    try {
      const slugVal = editingWriting.slug || editingWriting.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const fullWriting = { ...editingWriting, slug: slugVal };

      if (fullWriting.id) {
        // Update
        await databaseService.updateWriting(fullWriting.id, fullWriting);
        await mutate("writings");
        showStatus("success", "Writing updated successfully!");
      } else {
        // Create
        await databaseService.createWriting(fullWriting as Omit<Writing, "id" | "published_at">);
        await mutate("writings");
        showStatus("success", "Writing created successfully!");
      }
      setEditingWriting(null);
    } catch (err: unknown) {
      showStatus("error", err instanceof Error ? err.message : "Failed to save writing.");
    }
  };

  const handleDeleteWriting = async (id: string) => {
    if (!confirm("Are you sure you want to delete this writing?")) return;
    try {
      await databaseService.deleteWriting(id);
      await mutate("writings");
      showStatus("success", "Writing deleted successfully.");
    } catch (err: unknown) {
      showStatus("error", err instanceof Error ? err.message : "Failed to delete writing.");
    }
  };

  // --- Music Operations ---
  const handleEditTrack = (t: MusicTrack) => {
    setEditingTrack({ ...t });
    setLyricRows(t.lyrics || []);
    setLyricsAudioUrl(t.audio_url || "");
  };

  const handleNewTrack = () => {
    setEditingTrack({
      title: "",
      description: "",
      audio_url: "",
      youtube_url: "",
      cover_image_url: "/images/laxon.jpeg",
      language_tags: ["Shona"],
      track_number: tracks.length + 1
    });
    setLyricRows([]);
    setLyricsAudioUrl("");
  };

  const handleSaveTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrack || !editingTrack.title) return;

    try {
      const fullTrack = {
        ...editingTrack,
        lyrics: lyricRows.sort((a, b) => a.time - b.time)
      };

      if (fullTrack.id) {
        await databaseService.updateTrack(fullTrack.id, fullTrack);
        await mutate("music");
        showStatus("success", "Track updated successfully!");
      } else {
        await databaseService.createTrack(fullTrack as Omit<MusicTrack, "id" | "plays_count" | "downloads_count">);
        await mutate("music");
        showStatus("success", "Track added successfully!");
      }
      setEditingTrack(null);
      setLyricRows([]);
      if (audioRef.current) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      }
    } catch (err: unknown) {
      showStatus("error", err instanceof Error ? err.message : "Failed to save music track.");
    }
  };

  const handleDeleteTrack = async (id: string) => {
    if (!confirm("Are you sure you want to delete this music track?")) return;
    try {
      await databaseService.deleteTrack(id);
      await mutate("music");
      showStatus("success", "Track deleted successfully.");
    } catch (err: unknown) {
      showStatus("error", err instanceof Error ? err.message : "Failed to delete track.");
    }
  };

  // --- Lyric Rows Helper Methods ---
  const handleAddLyricRow = () => {
    setLyricRows(prev => [...prev, { time: Math.floor(audioCurrentTime), text: "" }]);
  };

  const handleRemoveLyricRow = (index: number) => {
    setLyricRows(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateLyricTime = (index: number, timeVal: number) => {
    setLyricRows(prev => prev.map((row, idx) => idx === index ? { ...row, time: timeVal } : row));
  };

  const handleUpdateLyricText = (index: number, textVal: string) => {
    setLyricRows(prev => prev.map((row, idx) => idx === index ? { ...row, text: textVal } : row));
  };

  const captureCurrentAudioTime = (index: number) => {
    if (audioRef.current) {
      handleUpdateLyricTime(index, Math.floor(audioRef.current.currentTime));
      showStatus("success", `Timestamp aligned to ${formatTime(audioRef.current.currentTime)}!`);
    }
  };

  const sortLyricsByTime = () => {
    setLyricRows(prev => [...prev].sort((a, b) => a.time - b.time));
  };

  // --- Live Audio Player aligned with Lyrics syncing ---
  const togglePlayerAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsAudioPlaying(true);
      }).catch(() => {
        alert("Unable to play audio. Please confirm the audio url is correct.");
      });
    }
  };

  // --- Homepage Settings Operations ---
  const handleSaveHomepageSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHomepage(true);
    try {
      await databaseService.updatePageContent("homepage_content", homepageDraftValue);
      await mutateHomepage(homepageDraftValue, false);
      showStatus("success", "Homepage CMS settings saved successfully!");
    } catch (err: unknown) {
      showStatus("error", err instanceof Error ? err.message : "Failed to update homepage settings.");
    } finally {
      setIsSavingHomepage(false);
    }
  };

  const handleMigrateCurrentContent = async () => {
    setIsMigratingContent(true);
    try {
      const response = await fetch("/api/admin/supabase/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret: adminSecret }),
      });
      const payload = (await response.json()) as {
        error?: string;
        result?: {
          writingsInserted: number;
          writingsUpdated: number;
          musicInserted: number;
          musicUpdated: number;
        };
      };

      if (!response.ok) {
        throw new Error(payload.error || "Failed to seed content.");
      }

      await Promise.all([
        mutate("writings"),
        mutate("music"),
        mutate("homepage_content"),
      ]);
      showStatus(
        "success",
        `Seeded Supabase: writings +${payload.result?.writingsInserted ?? 0}/${payload.result?.writingsUpdated ?? 0} updated, music +${payload.result?.musicInserted ?? 0}/${payload.result?.musicUpdated ?? 0} updated.`,
      );
    } catch (err: unknown) {
      showStatus("error", err instanceof Error ? err.message : "Failed to migrate current content.");
    } finally {
      setIsMigratingContent(false);
    }
  };

  const handleCreateSupabaseAdminUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsCreatingSupabaseAdmin(true);
    try {
      const response = await fetch("/api/admin/supabase/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: adminSecret,
          name: supabaseAdminForm.name,
          email: supabaseAdminForm.email,
          password: supabaseAdminForm.password,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
        user?: { email?: string };
      };

      if (!response.ok) {
        throw new Error(payload.error || "Failed to create Supabase admin user.");
      }

      showStatus("success", `Created Supabase admin user ${payload.user?.email || supabaseAdminForm.email}.`);
      setSupabaseAdminForm((current) => ({ ...current, email: "", password: "" }));
    } catch (err: unknown) {
      showStatus("error", err instanceof Error ? err.message : "Failed to create Supabase admin user.");
    } finally {
      setIsCreatingSupabaseAdmin(false);
    }
  };

  // --- Contact Inbox Messages Operations ---
  const handleUpdateMsgStatus = async (id: string, status: ContactMessage["status"]) => {
    try {
      await databaseService.updateMessageStatus(id, status);
      await mutate("messages");
      showStatus("success", `Message status updated to ${status}.`);
    } catch (err: unknown) {
      showStatus("error", err instanceof Error ? err.message : "Failed to update status.");
    }
  };

  const handleDeleteMsg = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await databaseService.deleteMessage(id);
      await mutate("messages");
      showStatus("success", "Message deleted successfully.");
    } catch (err: unknown) {
      showStatus("error", err instanceof Error ? err.message : "Failed to delete message.");
    }
  };

  // Simple statistics count
  const unreadMessagesCount = messages.filter(m => m.status === "unread").length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#06020c] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md bg-white/[0.03] border border-white/5 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#5b1d8f] to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-[#5b1d8f]/20 mb-4">
              <Lock className="text-white" size={28} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-wide">Pastor Laxson CMS</h1>
            <p className="text-xs text-white/40 mt-1">Authenticate to access administration panel</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-5">
            <div>
              <label htmlFor="pin" className="block text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">
                Enter PIN or Password
              </label>
              <input
                id="pin"
                type="password"
                placeholder="••••••"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-white tracking-widest text-lg focus:outline-none focus:border-[#5b1d8f] focus:ring-1 focus:ring-[#5b1d8f] transition"
                autoFocus
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-red-400 bg-red-950/20 border border-red-500/20 p-3 rounded-lg text-xs leading-normal">
                <AlertCircle size={14} className="flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#5b1d8f] to-[#7d2cc0] hover:from-[#6b25a8] hover:to-[#8c35d6] text-white py-3 px-4 rounded-xl font-semibold transition-all shadow-md shadow-[#5b1d8f]/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock size={18} />
              Unlock CMS
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080410] text-white flex flex-col font-sans">
      {/* Invisible HTML Audio Element for Lyric Sync Tool */}
      {lyricsAudioUrl && (
        <audio
          ref={audioRef}
          src={lyricsAudioUrl}
          onTimeUpdate={() => audioRef.current && setAudioCurrentTime(audioRef.current.currentTime)}
          onDurationChange={() => audioRef.current && setAudioDuration(audioRef.current.duration)}
          onEnded={() => setIsAudioPlaying(false)}
        />
      )}

      {/* Top Banner Header */}
      <header className="bg-black/30 border-b border-white/5 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#5b1d8f] to-amber-500 rounded-xl flex items-center justify-center shadow shadow-[#5b1d8f]/20">
            <Settings className="text-white animate-spin-slow" size={20} />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold tracking-wide">Pastor Laxson Nyamadzawo</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">Administrative CMS</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {actionStatus.message && (
            <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border text-xs ${actionStatus.type === "success" ? "bg-green-950/20 border-green-500/20 text-green-400" : "bg-red-950/20 border-red-500/20 text-red-400"}`}>
              <CheckCircle2 size={14} />
              <span>{actionStatus.message}</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/5 hover:bg-white/10 text-white/80 transition cursor-pointer"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      {/* Core Layout Grid */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-black/15 border-b md:border-b-0 md:border-r border-white/5 p-4 flex flex-row md:flex-col gap-2 md:gap-1.5 overflow-x-auto md:overflow-x-visible">
          <button
            onClick={() => { setActiveTab("overview"); setEditingWriting(null); setEditingTrack(null); }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition flex-shrink-0 cursor-pointer ${activeTab === "overview" ? "bg-[#5b1d8f] text-white shadow-sm shadow-[#5b1d8f]/20" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
          >
            <TrendingUp size={16} />
            Overview
          </button>
          <button
            onClick={() => { setActiveTab("writings"); setEditingWriting(null); setEditingTrack(null); }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition flex-shrink-0 cursor-pointer ${activeTab === "writings" ? "bg-[#5b1d8f] text-white shadow-sm shadow-[#5b1d8f]/20" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
          >
            <BookOpen size={16} />
            Theological Writings
          </button>
          <button
            onClick={() => { setActiveTab("music"); setEditingWriting(null); setEditingTrack(null); }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition flex-shrink-0 cursor-pointer ${activeTab === "music" ? "bg-[#5b1d8f] text-white shadow-sm shadow-[#5b1d8f]/20" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
          >
            <Music size={16} />
            Gospel Music
          </button>
          <button
            onClick={() => { setActiveTab("homepage"); setEditingWriting(null); setEditingTrack(null); }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition flex-shrink-0 cursor-pointer ${activeTab === "homepage" ? "bg-[#5b1d8f] text-white shadow-sm shadow-[#5b1d8f]/20" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
          >
            <Globe size={16} />
            Homepage CMS
          </button>
          <button
            onClick={() => { setActiveTab("messages"); setEditingWriting(null); setEditingTrack(null); }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition flex-shrink-0 cursor-pointer relative ${activeTab === "messages" ? "bg-[#5b1d8f] text-white shadow-sm shadow-[#5b1d8f]/20" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
          >
            <MessageSquare size={16} />
            Inbox
            {unreadMessagesCount > 0 && (
              <span className="absolute top-2 right-2.5 w-5 h-5 rounded-full bg-amber-500 text-black font-extrabold text-[10px] flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </button>
        </aside>

        {/* Central Workspace Area */}
        <main className="flex-1 p-6 md:p-8 bg-[#090513] overflow-y-auto max-w-7xl w-full mx-auto">
          {actionStatus.message && (
            <div className={`sm:hidden flex items-center gap-2 p-3 rounded-lg border text-xs mb-4 ${actionStatus.type === "success" ? "bg-green-950/20 border-green-500/20 text-green-400" : "bg-red-950/20 border-red-500/20 text-red-400"}`}>
              <CheckCircle2 size={14} />
              <span>{actionStatus.message}</span>
            </div>
          )}

          {/* ────────────────── 1. OVERVIEW TAB ────────────────── */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-white">Shalom, Pastor Laxson</h2>
                <p className="text-sm text-white/50 mt-1">Here is a quick overview of your website metrics and administrative panel.</p>
              </div>

              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Theological Writings</p>
                    <p className="text-3xl font-serif font-bold mt-1">{writings.length}</p>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Music size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Gospel Tracks</p>
                    <p className="text-3xl font-serif font-bold mt-1">{tracks.length}</p>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex items-center gap-4 relative">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Unread Messages</p>
                    <p className="text-3xl font-serif font-bold mt-1">{unreadMessagesCount}</p>
                  </div>
                  {unreadMessagesCount > 0 && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  )}
                </div>
              </div>

              {/* Actions & Recent Messages Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Quick Actions Panel */}
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl md:col-span-1 space-y-4">
                  <h3 className="text-lg font-serif font-semibold border-b border-white/5 pb-3">Quick Start</h3>
                  <button
                    onClick={() => { setActiveTab("writings"); handleNewWriting(); }}
                    className="w-full bg-[#5b1d8f]/80 hover:bg-[#5b1d8f] text-white py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Plus size={16} />
                    Write New Article
                  </button>
                  <button
                    onClick={() => { setActiveTab("music"); handleNewTrack(); }}
                    className="w-full bg-amber-500/20 border border-amber-500/30 hover:bg-amber-500/30 text-amber-300 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Plus size={16} />
                    Add Gospel Song
                  </button>
                  <button
                    onClick={() => setActiveTab("homepage")}
                    className="w-full bg-white/5 hover:bg-white/10 text-white/80 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Settings size={16} />
                    Edit Biography Narrative
                  </button>
                </div>

                {/* Recent Inbox Messages */}
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl md:col-span-2 space-y-4">
                  <h3 className="text-lg font-serif font-semibold border-b border-white/5 pb-3 flex items-center justify-between">
                    Recent Messages
                    <button onClick={() => setActiveTab("messages")} className="text-xs text-[#7d2cc0] hover:underline font-semibold cursor-pointer">
                      View all ({messages.length})
                    </button>
                  </h3>

                  {messages.length === 0 ? (
                    <p className="text-xs text-white/30 text-center py-6">Your message inbox is currently empty.</p>
                  ) : (
                    <div className="space-y-3">
                      {messages.slice(0, 3).map((msg) => (
                        <div key={msg.id} className={`p-4 rounded-xl border transition-all ${msg.status === "unread" ? "bg-white/[0.04] border-white/10" : "bg-transparent border-white/5 opacity-70"}`}>
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${msg.status === "unread" ? "bg-amber-500" : "bg-transparent"}`} />
                              <p className="text-xs font-semibold text-white/90">{msg.name}</p>
                            </div>
                            <span className="text-[10px] text-white/40">{new Date(msg.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-white/60 mt-1 line-clamp-1 italic">&quot;{msg.message}&quot;</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── 2. WRITINGS TAB ────────────────── */}
          {activeTab === "writings" && (
            <div className="space-y-8">
              {!editingWriting ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-white">Theological Writings CMS</h2>
                      <p className="text-sm text-white/50 mt-1">Publish, edit, or delete articles and theological studies.</p>
                    </div>
                    <button
                      onClick={handleNewWriting}
                      className="bg-[#5b1d8f] hover:bg-[#6b25a8] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
                    >
                      <Plus size={16} />
                      Write New Article
                    </button>
                  </div>

                  {/* Writings list grid */}
                  {writings.length === 0 ? (
                    <div className="p-12 text-center bg-white/[0.01] border border-white/5 rounded-2xl">
                      <BookOpen size={40} className="mx-auto text-white/15 mb-3" />
                      <p className="text-sm text-white/40">No writings configured yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {writings.map((w) => (
                        <div key={w.id} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between">
                          <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                                {w.category}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${w.published ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/40"}`}>
                                {w.published ? "Published" : "Draft"}
                              </span>
                            </div>
                            <h3 className="font-serif text-lg font-bold text-white/90 line-clamp-1">{w.title}</h3>
                            <p className="text-xs text-white/55 line-clamp-2 leading-relaxed">{w.excerpt}</p>
                          </div>
                          
                          <div className="px-5 py-3.5 bg-black/25 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] text-white/40 flex items-center gap-1">
                              <Clock size={12} />
                              {w.reading_time} min read
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditWriting(w)}
                                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition cursor-pointer text-white/80"
                                title="Edit"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteWriting(w.id)}
                                className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                /* WRITING FORM with Split-Screen Live Preview */
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEditingWriting(null)}
                        className="text-white/50 hover:text-white transition-colors"
                      >
                        <X size={20} />
                      </button>
                      <h2 className="text-xl font-serif font-bold">
                        {editingWriting.id ? "Edit Theological Study" : "Create Theological Study"}
                      </h2>
                    </div>
                    <button
                      onClick={handleSaveWriting}
                      className="bg-[#5b1d8f] hover:bg-[#6b25a8] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
                    >
                      <Save size={16} />
                      Save Writing
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Form Controls Column */}
                    <form onSubmit={handleSaveWriting} className="space-y-5 bg-white/[0.01] border border-white/5 p-6 rounded-2xl">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Title</label>
                          <input
                            type="text"
                            required
                            value={editingWriting.title || ""}
                            onChange={(e) => setEditingWriting(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#5b1d8f] text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Custom Slug</label>
                          <input
                            type="text"
                            placeholder="auto-generated if empty"
                            value={editingWriting.slug || ""}
                            onChange={(e) => setEditingWriting(prev => ({ ...prev, slug: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#5b1d8f] text-white font-mono"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Category</label>
                          <select
                            value={editingWriting.category || "Doctrine"}
                            onChange={(e) => setEditingWriting(prev => ({ ...prev, category: e.target.value as Writing["category"] }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#5b1d8f] text-white"
                          >
                            <option value="Doctrine">Doctrine</option>
                            <option value="Ministry">Ministry</option>
                            <option value="Resources">Resources</option>
                            <option value="Reflection">Reflection</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Reading Time (min)</label>
                          <input
                            type="number"
                            value={editingWriting.reading_time || 5}
                            onChange={(e) => setEditingWriting(prev => ({ ...prev, reading_time: parseInt(e.target.value) || 5 }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#5b1d8f] text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Status</label>
                          <div className="flex items-center h-8 gap-3">
                            <label className="flex items-center gap-2 text-xs cursor-pointer text-white/80">
                              <input
                                type="checkbox"
                                checked={editingWriting.published || false}
                                onChange={(e) => setEditingWriting(prev => ({ ...prev, published: e.target.checked }))}
                                className="accent-[#5b1d8f]"
                              />
                              Publish immediately
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Cover Image URL</label>
                        <input
                          type="text"
                          value={editingWriting.cover_image_url || ""}
                          onChange={(e) => setEditingWriting(prev => ({ ...prev, cover_image_url: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#5b1d8f] text-white font-mono"
                        />
                        <label className="mt-3 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (event) => {
                              const file = event.target.files?.[0];
                              if (!file) return;
                              const url = await uploadToBucket("images", file, "writings");
                              setEditingWriting(prev => ({ ...prev, cover_image_url: url }));
                              event.target.value = "";
                            }}
                          />
                          {uploadingField === "writings" ? "Uploading cover image..." : "Upload cover image to images bucket"}
                        </label>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">Short Excerpt (Teaser)</label>
                        <textarea
                          rows={2}
                          value={editingWriting.excerpt || ""}
                          onChange={(e) => setEditingWriting(prev => ({ ...prev, excerpt: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs focus:outline-none focus:border-[#5b1d8f] text-white leading-normal"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-2">
                          Body Content (Markdown Supported)
                        </label>
                        <textarea
                          rows={12}
                          required
                          value={editingWriting.content || ""}
                          onChange={(e) => setEditingWriting(prev => ({ ...prev, content: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-xs font-mono focus:outline-none focus:border-[#5b1d8f] text-white leading-relaxed"
                          placeholder="# Title here&#10;&#10;## Section Header&#10;&#10;Write articles here. You can use **bold** text and lists."
                        />
                      </div>
                    </form>

                    {/* Markdown live rendering Preview Column */}
                    <div className="bg-white border border-gray-200 text-gray-800 p-8 rounded-2xl shadow-xl h-[650px] overflow-y-auto sticky top-24">
                      <div className="border-b border-gray-100 pb-3 mb-4 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#5b1d8f] bg-purple-50 px-2.5 py-1 rounded">
                          Live Render Preview
                        </span>
                        <span className="text-[11px] text-gray-400">Exact layout format</span>
                      </div>
                      
                      {/* Document Header */}
                      <div className="space-y-2 mb-6">
                        <h1 className="font-serif text-2xl font-bold text-gray-900 leading-tight">
                          {editingWriting.title || "Untitled Article"}
                        </h1>
                        <div className="flex items-center gap-3 text-[11px] text-gray-500">
                          <span className="font-semibold text-[#5b1d8f] uppercase tracking-wider">{editingWriting.category}</span>
                          <span>•</span>
                          <span>{editingWriting.reading_time || 5} min read</span>
                        </div>
                      </div>

                      {/* Excerpt panel */}
                      {editingWriting.excerpt && (
                        <p className="border-l-4 border-amber-500 pl-4 py-1.5 italic text-gray-600 my-4 text-sm leading-relaxed bg-amber-50/30 pr-3 rounded-r">
                          {editingWriting.excerpt}
                        </p>
                      )}

                      {/* Rendered HTML output */}
                      <article 
                        className="prose prose-sm text-sm"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(editingWriting.content || "") }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ────────────────── 3. GOSPEL MUSIC TAB ────────────────── */}
          {activeTab === "music" && (
            <div className="space-y-8">
              {!editingTrack ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-white">Gospel Music Tracks CMS</h2>
                      <p className="text-sm text-white/50 mt-1">Manage worship songs, language tags, audio links, and aligned lyrics.</p>
                    </div>
                    <button
                      onClick={handleNewTrack}
                      className="bg-[#5b1d8f] hover:bg-[#6b25a8] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
                    >
                      <Plus size={16} />
                      Add Gospel Song
                    </button>
                  </div>

                  {/* Tracks list table */}
                  {tracks.length === 0 ? (
                    <div className="p-12 text-center bg-white/[0.01] border border-white/5 rounded-2xl">
                      <Music size={40} className="mx-auto text-white/15 mb-3" />
                      <p className="text-sm text-white/40">No music tracks configured yet.</p>
                    </div>
                  ) : (
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-white/5 bg-black/20 text-white/50 font-semibold uppercase tracking-wider text-[10px]">
                              <th className="py-4 px-6 text-center w-16">#</th>
                              <th className="py-4 px-6">Track Detail</th>
                              <th className="py-4 px-6">Languages</th>
                              <th className="py-4 px-6 text-center">Lyrics aligned</th>
                              <th className="py-4 px-6 text-center w-32">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tracks.sort((a,b)=>a.track_number-b.track_number).map((t) => (
                              <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                                <td className="py-4 px-6 text-center font-mono font-semibold text-white/70">{t.track_number}</td>
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded overflow-hidden relative flex-shrink-0 bg-white/5 border border-white/5">
                                      <Image src={t.cover_image_url || "/images/laxon.jpeg"} alt="" fill sizes="40px" className="object-cover" />
                                    </div>
                                    <div>
                                      <p className="font-semibold text-white/90">{t.title}</p>
                                      <p className="text-[10px] text-white/45 mt-0.5 line-clamp-1">{t.description || "No description configured"}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="flex flex-wrap gap-1">
                                    {t.language_tags.map((lang) => (
                                      <span key={lang} className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] font-semibold uppercase tracking-wider">
                                        {lang}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-center">
                                  {t.lyrics && t.lyrics.length > 0 ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-full">
                                      <CheckCircle2 size={10} />
                                      {t.lyrics.length} lines
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] text-white/30 font-semibold bg-white/5 px-2 py-0.5 rounded-full">
                                      None configured
                                    </span>
                                  )}
                                </td>
                                <td className="py-4 px-6 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => handleEditTrack(t)}
                                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition cursor-pointer text-white/80"
                                      title="Edit song and lyrics"
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTrack(t.id)}
                                      className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition cursor-pointer"
                                      title="Delete"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* MUSIC TRACK CMS EDITOR with Interactive Lyrics Timestamp Aligner */
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setEditingTrack(null);
                          setLyricRows([]);
                          if (audioRef.current) {
                            audioRef.current.pause();
                            setIsAudioPlaying(false);
                          }
                        }}
                        className="text-white/50 hover:text-white transition-colors"
                      >
                        <X size={20} />
                      </button>
                      <h2 className="text-xl font-serif font-bold">
                        {editingTrack.id ? "Edit Track & Align Lyrics" : "Add Gospel Music Track"}
                      </h2>
                    </div>
                    <button
                      onClick={handleSaveTrack}
                      className="bg-[#5b1d8f] hover:bg-[#6b25a8] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
                    >
                      <Save size={16} />
                      Save Song Details
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* Song Metadata form Column (3/5 width) */}
                    <div className="lg:col-span-2 space-y-6">
                      <form onSubmit={handleSaveTrack} className="space-y-4 bg-white/[0.01] border border-white/5 p-6 rounded-2xl">
                        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest border-b border-white/5 pb-2 mb-2">
                          Song Metadata
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Track Title</label>
                            <input
                              type="text"
                              required
                              value={editingTrack.title || ""}
                              onChange={(e) => setEditingTrack(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#5b1d8f] text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Track Number</label>
                            <input
                              type="number"
                              required
                              value={editingTrack.track_number || 1}
                              onChange={(e) => setEditingTrack(prev => ({ ...prev, track_number: parseInt(e.target.value) || 1 }))}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#5b1d8f] text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Track Description</label>
                          <input
                            type="text"
                            value={editingTrack.description || ""}
                            onChange={(e) => setEditingTrack(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#5b1d8f] text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Languages (Comma separated)</label>
                          <input
                            type="text"
                            value={(editingTrack.language_tags || []).join(", ")}
                            onChange={(e) => setEditingTrack(prev => ({ ...prev, language_tags: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#5b1d8f] text-white font-semibold"
                            placeholder="Shona, Nyanja, Lingala"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Cover Image URL</label>
                          <input
                            type="text"
                            value={editingTrack.cover_image_url || ""}
                            onChange={(e) => setEditingTrack(prev => ({ ...prev, cover_image_url: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#5b1d8f] text-white font-mono"
                          />
                          <label className="mt-3 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (event) => {
                                const file = event.target.files?.[0];
                                if (!file) return;
                                const url = await uploadToBucket("images", file, "music-covers");
                                setEditingTrack(prev => ({ ...prev, cover_image_url: url }));
                                event.target.value = "";
                              }}
                            />
                            {uploadingField === "music-covers" ? "Uploading cover image..." : "Upload cover image to images bucket"}
                          </label>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">YouTube Video URL</label>
                          <input
                            type="text"
                            value={editingTrack.youtube_url || ""}
                            onChange={(e) => setEditingTrack(prev => ({ ...prev, youtube_url: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#5b1d8f] text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">Audio Sample File URL</label>
                          <input
                            type="text"
                            value={editingTrack.audio_url || ""}
                            onChange={(e) => {
                              setEditingTrack(prev => ({ ...prev, audio_url: e.target.value }));
                              setLyricsAudioUrl(e.target.value);
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#5b1d8f] text-white font-mono"
                            placeholder="/music/vana_vangu.mp3 or external url"
                          />
                          <label className="mt-3 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10">
                            <input
                              type="file"
                              accept="audio/*"
                              className="hidden"
                              onChange={async (event) => {
                                const file = event.target.files?.[0];
                                if (!file) return;
                                const url = await uploadToBucket("music", file, "tracks");
                                setEditingTrack(prev => ({ ...prev, audio_url: url }));
                                setLyricsAudioUrl(url);
                                event.target.value = "";
                              }}
                            />
                            {uploadingField === "tracks" ? "Uploading audio..." : "Upload audio file to music bucket"}
                          </label>
                        </div>
                      </form>

                      {/* Embedded Audio controller card */}
                      {lyricsAudioUrl ? (
                        <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl space-y-3">
                          <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Lyrics Sync Controller</h4>
                          <div className="flex items-center justify-between">
                            <button
                              type="button"
                              onClick={togglePlayerAudio}
                              className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-black flex items-center justify-center transition cursor-pointer"
                            >
                              {isAudioPlaying ? <Pause size={18} fill="black" /> : <Play size={18} className="ml-0.5" fill="black" />}
                            </button>
                            <div className="flex-1 px-4">
                              <div className="h-1 rounded-full bg-white/10 relative overflow-hidden">
                                <div
                                  className="h-full bg-amber-500 absolute left-0 top-0"
                                  style={{ width: `${audioDuration > 0 ? (audioCurrentTime / audioDuration) * 100 : 0}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-[9px] font-mono text-white/40 mt-1">
                                <span>{formatTime(audioCurrentTime)}</span>
                                <span>{formatTime(audioDuration)}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-[10px] text-white/45 leading-relaxed bg-white/[0.02] p-2.5 rounded border border-white/5">
                            {"Tip: start audio playback, then use the \"Sync\" button beside a lyric line to capture the current playback moment."}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl text-center text-xs text-white/30">
                          Configure an Audio Sample File URL above to enable the real-time play-along timestamp aligner.
                        </div>
                      )}
                    </div>

                    {/* Timeline Lyrics Editor Panel (3/5 width) */}
                    <div className="lg:col-span-3 bg-white/[0.01] border border-white/5 p-6 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2">
                          <Mic className="text-purple-400" size={16} />
                          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                            Worship Karaoke Lyrics ({lyricRows.length} lines)
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={sortLyricsByTime}
                            className="bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded text-[10px] font-semibold transition cursor-pointer"
                          >
                            Sort Chronologically
                          </button>
                          <button
                            type="button"
                            onClick={handleAddLyricRow}
                            className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/15 px-2.5 py-1 rounded text-[10px] font-semibold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={12} />
                            Add Line
                          </button>
                        </div>
                      </div>

                      {lyricRows.length === 0 ? (
                        <p className="text-xs text-white/30 text-center py-12">No lyrics configured yet. Click &quot;Add Line&quot; to begin typing lyrics.</p>
                      ) : (
                        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                          {lyricRows.map((row, index) => (
                            <div key={index} className="flex items-center gap-3 bg-white/[0.02] hover:bg-white/[0.04] p-2 rounded-xl border border-white/5 transition-all">
                              {/* Sync button */}
                              <button
                                type="button"
                                onClick={() => captureCurrentAudioTime(index)}
                                disabled={!lyricsAudioUrl}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${lyricsAudioUrl ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400" : "bg-white/5 text-white/20 cursor-not-allowed"}`}
                                title="Align to current playback moment"
                              >
                                <Clock size={14} />
                              </button>

                              {/* Time Input in seconds */}
                              <div className="w-16">
                                <input
                                  type="number"
                                  placeholder="Secs"
                                  value={row.time}
                                  onChange={(e) => handleUpdateLyricTime(index, parseInt(e.target.value) || 0)}
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-center text-white/80 font-mono focus:outline-none"
                                />
                              </div>

                              {/* Time Preview */}
                              <span className="text-[10px] font-mono text-white/35 w-8 text-center">{formatTime(row.time)}</span>

                              {/* Text Input */}
                              <input
                                type="text"
                                placeholder="Lyric line content..."
                                value={row.text}
                                onChange={(e) => handleUpdateLyricText(index, e.target.value)}
                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#5b1d8f]"
                              />

                              {/* Remove row button */}
                              <button
                                type="button"
                                onClick={() => handleRemoveLyricRow(index)}
                                className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition cursor-pointer"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ────────────────── 4. HOMEPAGE SETTINGS TAB ────────────────── */}
          {activeTab === "homepage" && (
            <HomepageCmsEditor
              draft={homepageDraftValue}
              setDraft={(updater) =>
                setHomepageDraft((current) =>
                  typeof updater === "function"
                    ? updater(current || homepageData)
                    : updater,
                )
              }
              saving={isSavingHomepage}
              migrating={isMigratingContent}
              onSave={handleSaveHomepageSettings}
              onMigrate={handleMigrateCurrentContent}
              onUploadImage={(file, folder) => uploadToBucket("images", file, folder)}
              uploadingField={uploadingField}
            />
          )}

          {/* ────────────────── 5. MESSAGES INBOX TAB ────────────────── */}
          {activeTab === "messages" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-white">Contact Inbox Messages</h2>
                <p className="text-sm text-white/50 mt-1">Review contact inquiries submitted by ministry visitors.</p>
              </div>

              {messages.length === 0 ? (
                <div className="p-12 text-center bg-white/[0.01] border border-white/5 rounded-2xl">
                  <MessageSquare size={40} className="mx-auto text-white/15 mb-3" />
                  <p className="text-sm text-white/40">Your inbox is completely clear!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-6 rounded-2xl border transition-all ${msg.status === "unread" ? "bg-white/[0.03] border-white/10 shadow-lg shadow-black/20" : "bg-transparent border-white/5 opacity-60"}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                            <User size={18} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white/90 text-sm">{msg.name}</h3>
                            <p className="text-xs text-white/50 flex items-center gap-1.5 mt-0.5">
                              <Mail size={12} />
                              {msg.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-white/40">
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${msg.status === "unread" ? "bg-amber-500/10 text-amber-400" : "bg-white/5 text-white/40"}`}>
                            {msg.status === "unread" ? "New Message" : "Read"}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-white/80 leading-relaxed bg-white/[0.01] p-4 rounded-xl border border-white/5 italic">
                        &quot;{msg.message}&quot;
                      </div>

                      <div className="flex justify-end gap-3 mt-4">
                        {msg.status === "unread" ? (
                          <button
                            onClick={() => handleUpdateMsgStatus(msg.id, "read")}
                            className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/15 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            Mark as Read
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateMsgStatus(msg.id, "unread")}
                            className="bg-white/5 hover:bg-white/10 text-white/70 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            Mark as Unread
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteMsg(msg.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          Delete Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
