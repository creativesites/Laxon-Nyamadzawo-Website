"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Download, ChevronUp, X, Heart,
} from "lucide-react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

function formatTime(s: number) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
}

export default function MiniPlayer() {
  const router = useRouter();
  const {
    currentTrack, isPlaying, currentTime, duration, isMuted, isPlayerVisible,
    togglePlay, skipNext, skipPrev, seekTo, toggleMute,
    isLiked, toggleLike, downloadTrack, dismissPlayer,
  } = useMusicPlayer();

  const progressRef = useRef<HTMLInputElement>(null);

  if (!currentTrack || !isPlayerVisible) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const expandPlayer = () => router.push("/music");

  return (
    <AnimatePresence>
      <motion.div
        key="mini-player"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="fixed bottom-0 left-0 right-0 z-50 px-3 sm:px-0"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Progress bar — sits flush at top of player */}
        <div className="mx-auto max-w-7xl h-0.5 w-full bg-white/10 relative rounded-full overflow-hidden sm:rounded-none">
          <motion.div
            className="h-full bg-zaoga-500 absolute left-0 top-0"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
          <input
            ref={progressRef}
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seekTo(parseFloat(e.target.value))}
            className="absolute inset-x-0 -top-3 -bottom-3 w-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Player body */}
        <div className="mini-player-glass border border-white/10 sm:border-x-0 sm:border-b-0 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl sm:rounded-none mb-3 sm:mb-0 shadow-2xl shadow-black/25">
          <div className="max-w-7xl mx-auto flex items-center gap-3">

            {/* Album art → expands to full player */}
            <button onClick={expandPlayer} className="relative flex-shrink-0 group cursor-pointer" aria-label="Open full player">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-white/10 relative">
                <Image
                  src={currentTrack.cover_image_url || "/images/laxon.jpeg"}
                  alt={currentTrack.title}
                  fill
                  sizes="48px"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              {isPlaying && (
                <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronUp size={16} className="text-white" />
                </div>
              )}
            </button>

            {/* Track info */}
            <button onClick={expandPlayer} className="flex-1 min-w-0 group text-left cursor-pointer" aria-label="Open full player">
              <p className="text-sm font-serif font-bold text-white truncate group-hover:text-zaoga-300 transition-colors">
                {currentTrack.title}
              </p>
              <p className="text-xs text-white/50 truncate">
                Pastor Laxon Nyamadzawo
              </p>
            </button>

            {/* Time */}
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-white/40 flex-shrink-0">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {/* Like */}
              <button
                onClick={() => toggleLike(currentTrack.id)}
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label={isLiked(currentTrack.id) ? "Unlike" : "Like"}
              >
                <Heart
                  size={16}
                  className={isLiked(currentTrack.id) ? "text-crimson-500 fill-crimson-500" : "text-white/50"}
                />
              </button>

              {/* Prev */}
              <button
                onClick={skipPrev}
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Previous"
              >
                <SkipBack size={18} className="text-white/80" />
              </button>

              {/* Play / Pause */}
              <motion.button
                onClick={togglePlay}
                whileTap={{ scale: 0.92 }}
                className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-white sm:bg-zaoga-500 flex items-center justify-center hover:bg-white/90 sm:hover:bg-zaoga-400 transition-colors cursor-pointer shadow-lg shadow-black/30 sm:shadow-zaoga-900/50"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={18} fill="currentColor" className="text-zaoga-800 sm:text-white" />
                ) : (
                  <Play size={18} fill="currentColor" className="text-zaoga-800 sm:text-white translate-x-0.5" />
                )}
              </motion.button>

              {/* Next */}
              <button
                onClick={skipNext}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Next"
              >
                <SkipForward size={18} className="text-white/80" />
              </button>

              {/* Volume / Mute */}
              <button
                onClick={toggleMute}
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX size={16} className="text-white/50" />
                ) : (
                  <Volume2 size={16} className="text-white/80" />
                )}
              </button>

              {/* Download */}
              <button
                onClick={() => downloadTrack(currentTrack)}
                className="hidden md:flex w-9 h-9 items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Download"
              >
                <Download size={16} className="text-white/60" />
              </button>

              {/* Expand to full player */}
              <Link
                href="/music"
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                aria-label="Expand player"
              >
                <ChevronUp size={18} className="text-white/60" />
              </Link>

              {/* Dismiss */}
              <button
                onClick={dismissPlayer}
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close player"
              >
                <X size={16} className="text-white/40" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
