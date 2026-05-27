"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Repeat1,
  Volume2, Volume1, VolumeX,
  Heart, Download, Share2, ChevronDown,
  Timer, Mic2, ListMusic, X, GripVertical, Trash2, Plus, Check,
  MoreHorizontal,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMusicPlayer, SLEEP_OPTIONS, SleepTimerOption } from "@/contexts/MusicPlayerContext";
import { MusicTrack } from "@/lib/supabase";

/* ── Helpers (unchanged) ── */
function formatTime(s: number) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

function formatTimeLeft(s: number | null) {
  if (s === null) return "";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

const LYRIC_SYNC_LEAD_SECONDS = 1.7;

function getActiveLyricIndex(
  lyrics: MusicTrack["lyrics"],
  currentTime: number,
  leadSeconds = LYRIC_SYNC_LEAD_SECONDS
) {
  if (!lyrics || lyrics.length === 0) return -1;
  const syncedTime = currentTime + leadSeconds;
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (syncedTime >= lyrics[i].time) return i;
  }
  return -1;
}

function getLyricLineProgress(
  lyrics: MusicTrack["lyrics"],
  index: number,
  currentTime: number,
  leadSeconds = LYRIC_SYNC_LEAD_SECONDS
) {
  if (!lyrics || index < 0) return 0;
  const start = lyrics[index].time;
  const end = lyrics[index + 1]?.time ?? start + 5;
  if (end <= start) return 1;
  return Math.max(0, Math.min(1, (currentTime + leadSeconds - start) / (end - start)));
}

/* ── Sortable Queue Item ── */
function SortableQueueItem({
  track,
  isActive,
  onPlay,
  onRemove,
  onAdd,
}: {
  track: MusicTrack;
  isActive: boolean;
  onPlay: () => void;
  onRemove: () => void;
  onAdd: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
        isActive
          ? "bg-white/10 backdrop-blur-md border border-white/20"
          : "hover:bg-white/5 border border-transparent"
      }`}
    >
      {/* Drag handle – always touchable */}
      <button
        {...attributes}
        {...listeners}
        className="flex-shrink-0 cursor-grab active:cursor-grabbing text-white/20 hover:text-white/60 p-1 touch-none"
        aria-label="Drag to reorder"
      >
        <GripVertical size={16} />
      </button>

      {/* Art */}
      <div
        className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0 cursor-pointer"
        onClick={onPlay}
      >
        <Image
          src={track.cover_image_url || "/images/laxon.jpeg"}
          alt={track.title}
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onPlay}>
        <p className={`text-sm font-serif font-bold truncate ${isActive ? "text-amber-400" : "text-white"}`}>
          {track.title}
        </p>
        <p className="text-xs text-white/40 truncate">
          {track.language_tags.join(", ")}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={onAdd}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer text-white/40 hover:text-white/70"
          aria-label="Add to queue again"
          title="Add again"
        >
          <Plus size={13} />
        </button>
        <button
          onClick={onRemove}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-500/20 transition-colors cursor-pointer text-white/40 hover:text-red-400"
          aria-label="Remove from queue"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

/* ── Lyrics Panel (Interactive click-to-seek and dynamic highlights) ── */
function LyricsPanel({
  lyrics,
  currentTime,
  seekTo,
}: {
  lyrics: MusicTrack["lyrics"];
  currentTime: number;
  seekTo?: (time: number) => void;
}) {
  return (
    <motion.div
      className="px-1 py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <EstimatedLyricsStack lyrics={lyrics} currentTime={currentTime} seekTo={seekTo} compact />
    </motion.div>
  );
}

function CoverLyricsOverlay({
  lyrics,
  currentTime,
  onOpenFocus,
}: {
  lyrics: MusicTrack["lyrics"];
  currentTime: number;
  onOpenFocus: () => void;
}) {
  const activeIdx = getActiveLyricIndex(lyrics, currentTime);
  const active = activeIdx >= 0 && lyrics ? lyrics[activeIdx] : null;
  const previous = activeIdx > 0 && lyrics ? lyrics[activeIdx - 1] : null;
  const next = activeIdx >= 0 && lyrics ? lyrics[activeIdx + 1] : null;
  const progress = getLyricLineProgress(lyrics, activeIdx, currentTime);

  return (
    <motion.div
      className="absolute inset-0 z-10 flex flex-col justify-end bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.54)_42%,rgba(0,0,0,0.86))] p-5 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
    >
      <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
        <span className="rounded-full bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75 backdrop-blur-md">
          Lyrics
        </span>
        <button
          onClick={onOpenFocus}
          className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/80 backdrop-blur-md transition hover:bg-white/18"
        >
          Focus
        </button>
      </div>

      <div className="space-y-2">
        {previous && (
          <motion.p
            key={`prev-${previous.time}`}
            className="line-clamp-1 text-xs font-medium leading-normal text-white/25"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {previous.text}
          </motion.p>
        )}
        <AnimatePresence mode="wait">
          <motion.p
            key={active?.time ?? "waiting"}
            className="line-clamp-2 font-serif text-lg sm:text-xl font-medium leading-snug text-white/95"
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 330, damping: 32 }}
          >
            {active?.text || "Lyrics will appear here"}
          </motion.p>
        </AnimatePresence>
        <div className="h-0.5 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-white/40"
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.18, ease: "linear" }}
          />
        </div>
        {next && (
          <motion.p
            key={`next-${next.time}`}
            className="line-clamp-1 text-xs font-medium leading-normal text-white/35"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {next.text}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

function EstimatedLyricsStack({
  lyrics,
  currentTime,
  seekTo,
  compact = false,
}: {
  lyrics: MusicTrack["lyrics"];
  currentTime: number;
  seekTo?: (time: number) => void;
  compact?: boolean;
}) {
  const activeIdx = getActiveLyricIndex(lyrics, currentTime);

  if (!lyrics || lyrics.length === 0) {
    return (
      <div className="flex min-h-52 flex-col items-center justify-center space-y-3 text-center">
        <Mic2 size={compact ? 28 : 40} className="text-white/15" />
        <p className="text-sm text-white/30">Lyrics coming soon</p>
      </div>
    );
  }

  const previous = activeIdx > 0 ? lyrics[activeIdx - 1] : null;
  const current = activeIdx >= 0 ? lyrics[activeIdx] : lyrics[0];
  const next = activeIdx >= 0 ? lyrics[activeIdx + 1] ?? null : lyrics[1] ?? null;

  return (
    <div className={`flex flex-col justify-center ${compact ? "min-h-56 gap-3" : "min-h-72 gap-4 sm:min-h-80"}`}>
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
        Estimated lyric position
      </p>
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => previous && seekTo?.(previous.time)}
          disabled={!previous || !seekTo}
          className={`block w-full rounded-xl px-4 py-2.5 text-center transition ${compact ? "text-xs" : "text-sm sm:text-base"} ${previous ? "cursor-pointer text-white/25 hover:text-white/45" : "cursor-default text-transparent"}`}
        >
          {previous?.text || "..."}
        </button>
        <button
          type="button"
          onClick={() => current && seekTo?.(current.time)}
          disabled={!current || !seekTo}
          className={`block w-full rounded-2xl border border-white/5 bg-white/[0.04] px-4 py-3.5 text-center font-serif font-medium text-white/95 shadow-sm backdrop-blur-sm transition hover:bg-white/[0.07] ${compact ? "text-lg leading-tight" : "text-xl leading-tight sm:text-2xl"}`}
        >
          {current?.text}
        </button>
        <button
          type="button"
          onClick={() => next && seekTo?.(next.time)}
          disabled={!next || !seekTo}
          className={`block w-full rounded-xl px-4 py-2.5 text-center transition ${compact ? "text-xs" : "text-sm sm:text-base"} ${next ? "cursor-pointer text-white/35 hover:text-white/55" : "cursor-default text-transparent"}`}
        >
          {next?.text || "..."}
        </button>
      </div>
    </div>
  );
}

/* ── Fullscreen Focus/Karaoke Overlay ── */
interface FocusLyricsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  track: MusicTrack | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  togglePlay: () => void;
  skipNext: () => void;
  skipPrev: () => void;
  seekTo: (time: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
}

function FocusLyricsOverlay({
  isOpen,
  onClose,
  track,
  currentTime,
  duration,
  isPlaying,
  volume,
  isMuted,
  togglePlay,
  skipNext,
  skipPrev,
  seekTo,
  setVolume,
  toggleMute,
}: FocusLyricsOverlayProps) {
  const lyrics = track?.lyrics;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed inset-0 z-50 overflow-hidden flex flex-col bg-black/95 player-bg"
      >
        {/* Deep, animated blurred background art */}
        <div className="absolute inset-0 -z-10 opacity-30 blur-3xl scale-125 select-none pointer-events-none transition-all duration-1000">
          <Image
            src={track?.cover_image_url || "/images/laxon.jpeg"}
            alt={track?.title || "Album Cover"}
            fill
            className="object-cover animate-spin-slow"
            priority
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />

        {/* Top Header */}
        <div className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/5 backdrop-blur-md bg-black/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden relative shadow-md shadow-black/40 flex-shrink-0">
              <Image
                src={track?.cover_image_url || "/images/laxon.jpeg"}
                alt={track?.title || ""}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-serif text-lg font-bold text-white truncate max-w-xs md:max-w-md">{track?.title}</p>
              <p className="text-xs text-white/50">Pastor Laxon Nyamadzawo</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded bg-zaoga-700/60 text-amber-400 border border-zaoga-600/30">
              Karaoke Focus
            </span>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer"
              aria-label="Exit Karaoke Mode"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Center Lyrics Focus Area */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-16 py-8 overflow-hidden max-w-4xl mx-auto w-full">
          <EstimatedLyricsStack lyrics={lyrics} currentTime={currentTime} seekTo={seekTo} />
        </div>

        {/* Bottom Control Bar */}
        <div className="px-6 md:px-12 py-8 border-t border-white/5 backdrop-blur-md bg-black/30 flex flex-col gap-4">
          {/* Progress Slider */}
          <div className="max-w-3xl mx-auto w-full space-y-1.5">
            <div className="relative h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-zaoga-400 to-amber-400 absolute left-0 top-0 rounded-full"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => seekTo(parseFloat(e.target.value))}
                className="player-seek absolute inset-0 w-full h-full"
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-white/40">
              <span>{formatTime(currentTime)}</span>
              <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
            </div>
          </div>

          {/* Controls row */}
          <div className="max-w-3xl mx-auto w-full flex items-center justify-between gap-6">
            {/* Volume on Left */}
            <div className="flex items-center gap-2 w-32 hidden md:flex">
              <button
                onClick={toggleMute}
                className="text-white/40 hover:text-white/70 transition-colors cursor-pointer"
              >
                {isMuted || volume === 0 ? <VolumeX size={16} /> : volume < 0.5 ? <Volume1 size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="player-seek flex-1"
              />
            </div>

            {/* Playback Controls in Center */}
            <div className="flex items-center gap-6 mx-auto">
              <motion.button
                onClick={skipPrev}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                aria-label="Previous"
              >
                <SkipBack size={22} fill="white" />
              </motion.button>

              <motion.button
                onClick={togglePlay}
                whileTap={{ scale: 0.88 }}
                className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl shadow-white/10 hover:bg-white/90 text-zaoga-700 transition-colors cursor-pointer"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={24} fill="#5b1d8f" /> : <Play size={24} fill="#5b1d8f" className="ml-[2px]" />}
              </motion.button>

              <motion.button
                onClick={skipNext}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                aria-label="Next"
              >
                <SkipForward size={22} fill="white" />
              </motion.button>
            </div>

            {/* Empty block on Right to balance volume layout */}
            <div className="w-32 hidden md:block" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Main Page ── */
export default function MusicPage() {
  const {
    tracks, currentTrack, queue, isPlaying, currentTime, duration,
    volume, isMuted, isShuffled, repeatMode, sleepTimerLabel, sleepSecondsLeft,
    togglePlay, skipNext, skipPrev, seekTo, setVolume, toggleMute,
    toggleShuffle, cycleRepeat, toggleLike, isLiked, setSleepTimer,
    addToQueue, removeFromQueue, reorderQueue, downloadTrack, shareTrack,
    playTrack,
  } = useMusicPlayer();

  const [activeTab, setActiveTab] = useState<"lyrics" | "queue">("queue");
  const [showSleepMenu, setShowSleepMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [mobileSheet, setMobileSheet] = useState<"lyrics" | "queue" | null>(null);
  const [mobileLyricsOnCover, setMobileLyricsOnCover] = useState(false);
  const [isFullscreenLyrics, setIsFullscreenLyrics] = useState(false);
  const sleepMenuRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  // ── Drag overlay state ──
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const activeDragTrack = queue.find((t) => t.id === activeDragId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  /* auto‑play first track if nothing loaded */
  useEffect(() => {
    if (!currentTrack && tracks.length > 0) {
      playTrack(tracks[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks]);

  useEffect(() => {
    if (!showSleepMenu && !showShareMenu) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (showSleepMenu && sleepMenuRef.current && !sleepMenuRef.current.contains(target)) {
        setShowSleepMenu(false);
      }
      if (showShareMenu && shareMenuRef.current && !shareMenuRef.current.contains(target)) {
        setShowShareMenu(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowSleepMenu(false);
        setShowShareMenu(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSleepMenu, showShareMenu]);

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveDragId(null);
      return;
    }
    const oldIdx = queue.findIndex((t) => t.id === active.id);
    const newIdx = queue.findIndex((t) => t.id === over.id);
    reorderQueue(arrayMove(queue, oldIdx, newIdx));
    setActiveDragId(null);
  }

  function handleShare(platform: string) {
    const url = typeof window !== "undefined" ? window.location.origin + "/music" : "";
    const title = currentTrack?.title || "Gospel Music";
    const text = encodeURIComponent(`Listen to "${title}" by Pastor Laxon Nyamadzawo — ${url}`);
    const links: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      tiktok: `https://www.tiktok.com/`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${text}`,
    };
    if (links[platform]) window.open(links[platform], "_blank");
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
    setShowShareMenu(false);
  }

  const track = currentTrack || tracks[0];
  const hasLyrics = Boolean(track?.lyrics?.length);
  const showLyricsOnCover = hasLyrics && (activeTab === "lyrics" || mobileLyricsOnCover || mobileSheet === "lyrics");

  const panelMode = mobileSheet ?? activeTab;
  const mobilePanelContent = (
    <AnimatePresence mode="wait">
      {panelMode === "lyrics" ? (
        <motion.div
          key="lyrics"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col"
        >
          <div className="flex justify-between items-center mb-2.5 px-1">
            <p className="text-[11px] uppercase tracking-wider text-white/40 font-medium">Live lyrics</p>
            <button
              onClick={() => setIsFullscreenLyrics(true)}
              className="text-[11px] uppercase tracking-wider text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10"
            >
              <Mic2 size={11} /> Focus Mode
            </button>
          </div>
          <LyricsPanel lyrics={track?.lyrics} currentTime={currentTime} seekTo={seekTo} />
        </motion.div>
      ) : (
        <motion.div
          key="queue"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">Up Next</p>
            <button
              onClick={() => tracks.forEach(addToQueue)}
              className="text-xs text-amber-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus size={12} /> Add all
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={queue.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1 max-h-72 md:max-h-60 overflow-y-auto scrollbar-thin">
                {queue.map((t) => (
                  <SortableQueueItem
                    key={t.id}
                    track={t}
                    isActive={t.id === currentTrack?.id}
                    onPlay={() => playTrack(t, true)}
                    onRemove={() => removeFromQueue(t.id)}
                    onAdd={() => addToQueue(t)}
                  />
                ))}
              </div>
            </SortableContext>

            {/* Drag overlay - mimics a native floating queue row */}
            <DragOverlay dropAnimation={null}>
              {activeDragTrack ? (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-black/80 backdrop-blur-xl border border-white/30 shadow-2xl scale-105">
                  <GripVertical size={16} className="text-white/60" />
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0">
                    <Image
                      src={activeDragTrack.cover_image_url || "/images/laxon.jpeg"}
                      alt={activeDragTrack.title}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-serif font-bold truncate text-white">
                      {activeDragTrack.title}
                    </p>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="music-player-screen min-h-[100svh] relative flex flex-col overflow-hidden">
      {/* ── Artwork-led native player background ── */}
      <div className="fixed inset-0 -z-20 pointer-events-none bg-[#07070a]">
        {track && (
          <Image
            key={track.id}
            src={track.cover_image_url || "/images/laxon.jpeg"}
            alt=""
            fill
            sizes="100vw"
            className="object-cover scale-110 blur-3xl opacity-55"
            aria-hidden="true"
            priority
          />
        )}
      </div>
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.34),rgba(7,7,10,0.78)_42%,rgba(7,7,10,0.96))]" />

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-5 sm:px-6 pt-[calc(18px+env(safe-area-inset-top))] pb-2 relative z-30">
        <Link
          href="/"
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors"
          aria-label="Back to site"
        >
          <ChevronDown size={20} className="text-white" />
        </Link>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[2px] font-semibold text-white/45">Now Playing</p>
          <p className="hidden sm:block text-xs text-white/70 truncate max-w-48">{track?.title}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Sleep Timer */}
          <div className="relative" ref={sleepMenuRef}>
            <button
              onClick={() => {
                setShowSleepMenu((value) => !value);
                setShowShareMenu(false);
              }}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors cursor-pointer backdrop-blur-md ${
                sleepTimerLabel !== "Off" ? "bg-zaoga-600 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
              aria-label="Sleep Timer"
            >
              <Timer size={18} />
            </button>
            {sleepSecondsLeft !== null && (
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-amber-400 font-mono whitespace-nowrap">
                {formatTimeLeft(sleepSecondsLeft)}
              </span>
            )}
            <AnimatePresence>
              {showSleepMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute right-0 top-12 w-40 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50"
                >
                  {SLEEP_OPTIONS.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => {
                        setSleepTimer(opt as SleepTimerOption);
                        setShowSleepMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                        sleepTimerLabel === opt.label
                          ? "bg-zaoga-600 text-white"
                          : "text-white/70 hover:bg-white/10"
                      }`}
                    >
                      {opt.label}
                      {sleepTimerLabel === opt.label && <Check size={13} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Share */}
          <div className="relative" ref={shareMenuRef}>
            <button
              onClick={() => {
                setShowShareMenu((value) => !value);
                setShowSleepMenu(false);
              }}
              className="flex w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md items-center justify-center text-white/60 transition-colors cursor-pointer"
              aria-label="Share"
            >
              <Share2 size={18} />
            </button>
            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute right-0 top-12 w-48 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50"
                >
                  {[
                    { id: "whatsapp", label: "WhatsApp" },
                    { id: "facebook", label: "Facebook" },
                    { id: "tiktok", label: "TikTok" },
                    { id: "email", label: "Email" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleShare(p.id)}
                      className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      shareTrack(track!);
                      setCopiedShare(true);
                      setShowShareMenu(false);
                      setTimeout(() => setCopiedShare(false), 2000);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-white/70 hover:bg-white/10 transition-colors cursor-pointer border-t border-white/10"
                  >
                    {copiedShare ? "Copied!" : "Copy Link"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setMobileSheet("queue")}
            className="sm:hidden w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white/70 transition-colors cursor-pointer"
            aria-label="Open queue"
          >
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-5 sm:px-6 flex flex-col gap-5 sm:gap-6 pt-3 sm:pt-4 pb-[calc(110px+env(safe-area-inset-bottom))] sm:pb-28 relative z-10">

        {/* Album Art with soft shadow and scale bounce on play */}
        <motion.div
          key={track?.id}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: isPlaying ? 1 : 0.97, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="w-full max-w-[min(76vw,360px)] sm:max-w-sm mx-auto"
        >
          <div className="aspect-square rounded-[18px] overflow-hidden relative shadow-2xl shadow-black/55 ring-1 ring-white/10">
            {track ? (
              <Image
                src={track.cover_image_url || "/images/laxon.jpeg"}
                alt={track.title}
                fill
                sizes="(max-width: 768px) 100vw, 384px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-zaoga-800 flex items-center justify-center">
                <ListMusic size={64} className="text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <AnimatePresence>
              {showLyricsOnCover && (
                <CoverLyricsOverlay
                  lyrics={track?.lyrics}
                  currentTime={currentTime}
                  onOpenFocus={() => setIsFullscreenLyrics(true)}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Track Info + Like */}
        {track && (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight truncate">
                {track.title}
              </h1>
              <p className="text-sm text-white/50 mt-1">Pastor Laxon Nyamadzawo</p>
              <div className="flex gap-2 mt-2">
                {track.language_tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded bg-zaoga-700/60 text-amber-400 border border-zaoga-600/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => toggleLike(track.id)}
              className="flex-shrink-0 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer"
              aria-label={isLiked(track.id) ? "Unlike" : "Like"}
            >
              <motion.div whileTap={{ scale: 1.3 }}>
                <Heart
                  size={22}
                  className={isLiked(track.id) ? "text-red-500 fill-red-500" : "text-white/60"}
                />
              </motion.div>
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="relative h-7 -my-2 flex items-center">
            <div className="absolute left-0 right-0 h-1.5 rounded-full bg-white/12 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-zaoga-400 to-amber-400 absolute left-0 top-0 rounded-full"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="player-seek player-seek-touch absolute inset-0 w-full h-full"
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-white/40">
            <span>{formatTime(currentTime)}</span>
            <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
          </div>
        </div>

        {/* Main Controls – larger, bouncier */}
        <div className="flex items-center justify-between">
          <button
            onClick={toggleShuffle}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
              isShuffled ? "text-amber-400" : "text-white/30 hover:text-white/60"
            }`}
            aria-label="Shuffle"
          >
            <Shuffle size={20} />
          </button>

          <motion.button
            onClick={skipPrev}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Previous"
          >
            <SkipBack size={28} fill="white" className="text-white" />
          </motion.button>

          {/* Play / Pause – with haptic-like feedback */}
          <motion.button
            onClick={togglePlay}
            whileTap={{ scale: 0.88 }}
            className="w-18 h-18 rounded-full bg-white flex items-center justify-center shadow-2xl shadow-white/20 hover:bg-white/90 transition-colors cursor-pointer"
            style={{ width: 72, height: 72 }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={30} fill="#5b1d8f" className="text-zaoga-700" />
            ) : (
              <Play size={30} fill="#5b1d8f" className="text-zaoga-700 ml-[3px]" />
            )}
          </motion.button>

          <motion.button
            onClick={skipNext}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Next"
          >
            <SkipForward size={28} fill="white" className="text-white" />
          </motion.button>

          <button
            onClick={cycleRepeat}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
              repeatMode !== "none" ? "text-amber-400" : "text-white/30 hover:text-white/60"
            }`}
            aria-label="Repeat"
          >
            {repeatMode === "one" ? <Repeat1 size={20} /> : <Repeat size={20} />}
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 backdrop-blur-md sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
          <button
            onClick={toggleMute}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={18} />
            ) : volume < 0.5 ? (
              <Volume1 size={18} />
            ) : (
              <Volume2 size={18} />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="player-seek flex-1"
          />
          <button
            onClick={() => setVolume(1)}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors cursor-pointer"
          >
            <Volume2 size={18} />
          </button>
        </div>

        {/* Download + Share row */}
        <div className="grid grid-cols-2 sm:flex items-center gap-3 justify-end">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => track && downloadTrack(track)}
            className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-2xl sm:rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white/75 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Download size={14} /> Download
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => track && shareTrack(track)}
            className="flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-2xl sm:rounded-full bg-zaoga-700/50 hover:bg-zaoga-600/50 backdrop-blur-md text-amber-300 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Share2 size={14} /> Share
          </motion.button>
        </div>

        {/* ── Mobile sheet launchers ── */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          <button
            onClick={() => {
              setMobileSheet(null);
              setMobileLyricsOnCover((value) => !value);
            }}
            className={`h-12 rounded-2xl backdrop-blur-md border flex items-center justify-center gap-2 text-sm font-semibold active:scale-[0.98] transition ${
              mobileLyricsOnCover
                ? "bg-white text-zaoga-900 border-white"
                : "bg-white/10 border-white/10 text-white/80"
            }`}
            aria-pressed={mobileLyricsOnCover}
          >
            <Mic2 size={17} /> Lyrics
          </button>
          <button
            onClick={() => setMobileSheet("queue")}
            className="h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white/80 flex items-center justify-center gap-2 text-sm font-semibold active:scale-[0.98] transition"
          >
            <ListMusic size={17} /> Queue
            <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded-full">{queue.length}</span>
          </button>
        </div>

        {/* ── Lyrics / Queue Tabs ── */}
        <div className="hidden sm:block space-y-4">
          <div className="flex border border-white/10 rounded-xl overflow-hidden backdrop-blur-md bg-black/20">
            <button
              onClick={() => setActiveTab("lyrics")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === "lyrics"
                  ? "bg-zaoga-700 text-white shadow-lg"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              <Mic2 size={15} /> Lyrics
            </button>
            <button
              onClick={() => setActiveTab("queue")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === "queue"
                  ? "bg-zaoga-700 text-white shadow-lg"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              <ListMusic size={15} /> Queue
              <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded-full">{queue.length}</span>
            </button>
          </div>

          {mobilePanelContent}
        </div>
      </div>

      <AnimatePresence>
        {mobileSheet && (
          <motion.div
            className="fixed inset-0 z-40 sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute inset-0 bg-black/45"
              onClick={() => setMobileSheet(null)}
              aria-label="Close panel"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={mobileSheet === "lyrics" ? "Lyrics" : "Queue"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.22 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 90 || info.velocity.y > 700) setMobileSheet(null);
              }}
              className="absolute left-0 right-0 bottom-0 max-h-[78svh] rounded-t-[28px] bg-[#101014]/95 backdrop-blur-2xl border-t border-white/10 px-5 pt-3 pb-[calc(24px+env(safe-area-inset-bottom))] shadow-2xl overflow-hidden"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/25" />
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[2px] text-white/40 font-semibold">
                    {mobileSheet === "lyrics" ? "Lyrics" : "Playing Next"}
                  </p>
                  <h2 className="font-sans text-lg font-semibold text-white">
                    {mobileSheet === "lyrics" ? track?.title || "Lyrics" : `${queue.length} tracks`}
                  </h2>
                </div>
                <button
                  onClick={() => setMobileSheet(null)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70"
                  aria-label="Close panel"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="max-h-[58svh] overflow-y-auto pr-1">
                {mobilePanelContent}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FocusLyricsOverlay
        isOpen={isFullscreenLyrics}
        onClose={() => setIsFullscreenLyrics(false)}
        track={track}
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        volume={volume}
        isMuted={isMuted}
        togglePlay={togglePlay}
        skipNext={skipNext}
        skipPrev={skipPrev}
        seekTo={seekTo}
        setVolume={setVolume}
        toggleMute={toggleMute}
      />
    </div>
  );
}
