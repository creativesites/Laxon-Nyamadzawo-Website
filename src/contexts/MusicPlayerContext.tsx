"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { databaseService, MusicTrack } from "@/lib/supabase";

/* ── Types (unchanged) ── */
export type RepeatMode = "none" | "all" | "one";

export interface SleepTimerOption {
  label: string;
  minutes: number | null;
}

export const SLEEP_OPTIONS: SleepTimerOption[] = [
  { label: "Off", minutes: 0 },
  { label: "5 min", minutes: 5 },
  { label: "10 min", minutes: 10 },
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "45 min", minutes: 45 },
  { label: "1 hour", minutes: 60 },
  { label: "End of track", minutes: null },
];

export interface MusicPlayerContextType {
  tracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  queue: MusicTrack[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  likedIds: Set<string>;
  sleepTimerLabel: string;
  sleepSecondsLeft: number | null;
  isPlayerVisible: boolean;
  playTrack: (track: MusicTrack, fromQueue?: boolean) => void;
  togglePlay: () => void;
  skipNext: () => void;
  skipPrev: () => void;
  seekTo: (time: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
  setSleepTimer: (opt: SleepTimerOption) => void;
  addToQueue: (track: MusicTrack) => void;
  removeFromQueue: (id: string) => void;
  reorderQueue: (newQueue: MusicTrack[]) => void;
  downloadTrack: (track: MusicTrack) => Promise<void>;
  shareTrack: (track: MusicTrack) => void;
  dismissPlayer: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error("useMusicPlayer must be used inside MusicPlayerProvider");
  return ctx;
}

/* ── Helpers ── */
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function storeLiked(ids: Set<string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem("laxon_liked_songs", JSON.stringify([...ids]));
}

function loadLiked(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem("laxon_liked_songs");
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch { return new Set(); }
}

function loadVolume(): number {
  if (typeof window === "undefined") return 0.8;
  try { return parseFloat(localStorage.getItem("laxon_volume") || "0.8"); } catch { return 0.8; }
}

/* ── Audio cache helper (simple in‑memory) ── */
const audioCache = new Map<string, HTMLAudioElement>();

function getOrCreateAudio(url: string): HTMLAudioElement {
  if (audioCache.has(url)) {
    return audioCache.get(url)!;
  }
  const audio = new Audio();
  audio.preload = "auto";   // force full download
  audio.crossOrigin = "anonymous";
  audio.src = url;
  audio.load();
  audioCache.set(url, audio);
  return audio;
}

/* ── Provider ── */
export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFading = useRef(false);               // guard against race conditions
  const skipNextRef = useRef<() => void>(() => {});

  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(loadVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("all");
  const [likedIds, setLikedIds] = useState<Set<string>>(loadLiked);
  const [sleepTimerLabel, setSleepTimerLabel] = useState("Off");
  const [sleepSecondsLeft, setSleepSecondsLeft] = useState<number | null>(null);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  const sleepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sleepEndOfTrackRef = useRef(false);

  /* ── Load initial data ── */
  useEffect(() => {
    databaseService.getMusicTracks().then((d) => {
      setTracks(d);
      setQueue(d);
    });
  }, []);

  /* ── Fading Utilities (debounced, race‑free) ── */
  const clearFade = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    isFading.current = false;
  }, []);

  const doFade = useCallback((audio: HTMLAudioElement, fromVol: number, toVol: number, durationMs: number, onComplete?: () => void) => {
    clearFade();
    isFading.current = true;
    const steps = 20;
    const stepTime = durationMs / steps;
    const volStep = (toVol - fromVol) / steps;
    let currentVol = fromVol;

    audio.volume = Math.max(0, Math.min(1, currentVol));

    fadeIntervalRef.current = setInterval(() => {
      currentVol += volStep;
      if ((volStep > 0 && currentVol >= toVol) || (volStep < 0 && currentVol <= toVol)) {
        currentVol = toVol;
        audio.volume = Math.max(0, Math.min(1, currentVol));
        clearFade();
        onComplete?.();
      } else {
        audio.volume = Math.max(0, Math.min(1, currentVol));
      }
    }, stepTime);
  }, [clearFade]);

  const fadeOutAndPause = useCallback((callback?: () => void) => {
    if (!audioRef.current) {
      callback?.();
      return;
    }
    const targetVol = isMuted ? 0 : volume;
    doFade(audioRef.current, audioRef.current.volume, 0, 300, () => {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.volume = targetVol;
      isFading.current = false;
      callback?.();
    });
  }, [doFade, isMuted, volume]);

  const fadeInAndPlay = useCallback(() => {
    if (!audioRef.current) return;
    const targetVol = isMuted ? 0 : volume;
    audioRef.current.volume = 0;
    audioRef.current.play().then(() => {
      doFade(audioRef.current!, 0, targetVol, 300);
    }).catch(() => setIsPlaying(false));
  }, [doFade, isMuted, volume]);

  /* ── Sync volume when not fading ── */
  useEffect(() => {
    if (audioRef.current && !isFading.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  /* ── Media Session API ── */
  const updateMediaSession = useCallback((track: MusicTrack) => {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: track.title,
      artist: "Pastor Laxon Nyamadzawo",
      album: "ZAOGA Forward in Faith",
      artwork: track.cover_image_url
        ? [{ src: track.cover_image_url, sizes: "512x512", type: "image/jpeg" }]
        : [],
    });
  }, []);

  /* ── Core: playTrack (cached audio) ── */
  const playTrack = useCallback(
    (track: MusicTrack, fromQueue = false) => {
      if (!track.audio_url) return;

      const execPlay = () => {
        // Use cached Audio element
        const cachedAudio = getOrCreateAudio(track.audio_url!);
        audioRef.current = cachedAudio;

        // reattach event listeners
        cachedAudio.ontimeupdate = () => setCurrentTime(cachedAudio.currentTime);
        cachedAudio.onloadedmetadata = () => setDuration(cachedAudio.duration);
        cachedAudio.onended = () => {
          if (sleepEndOfTrackRef.current) {
            sleepEndOfTrackRef.current = false;
            setSleepTimerLabel("Off");
            setIsPlaying(false);
            return;
          }
          if (repeatMode === "one") {
            cachedAudio.play();
            return;
          }
          skipNextRef.current();
        };

        setCurrentTrack(track);
        setIsPlaying(true);
        setIsPlayerVisible(true);
        setCurrentTime(0);
        updateMediaSession(track);
        if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "playing";

        if (!fromQueue) {
          if (isShuffled) {
            const rest = tracks.filter((t) => t.id !== track.id);
            setQueue([track, ...shuffleArray(rest)]);
          } else {
            const idx = tracks.findIndex((t) => t.id === track.id);
            setQueue(idx >= 0 ? [...tracks.slice(idx), ...tracks.slice(0, idx)] : tracks);
          }
        }

        databaseService.trackPlay(track.id).then(() =>
          databaseService.getMusicTracks().then(setTracks)
        );

        // Start playback with fade
        if (cachedAudio.paused) {
          fadeInAndPlay();
        }
      };

      if (isPlaying && audioRef.current) {
        fadeOutAndPause(execPlay);
      } else {
        execPlay();
      }
    },
    [isShuffled, tracks, updateMediaSession, isPlaying, fadeOutAndPause, fadeInAndPlay, repeatMode]
  );

  /* ── togglePlay (smooth) ── */
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isFading.current) return;               // ignore clicks during fade

    if (isPlaying) {
      setIsPlaying(false);
      if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "paused";
      fadeOutAndPause();
    } else {
      setIsPlaying(true);
      if ("mediaSession" in navigator) navigator.mediaSession.playbackState = "playing";
      fadeInAndPlay();
    }
  }, [isPlaying, fadeOutAndPause, fadeInAndPlay]);

  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;
    navigator.mediaSession.setActionHandler("play", () => {
      if (!isPlaying) togglePlay();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      if (isPlaying) togglePlay();
    });
  }, [isPlaying, togglePlay]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("mediaSession" in navigator) ||
      typeof navigator.mediaSession.setPositionState !== "function" ||
      !duration ||
      duration <= 0
    ) {
      return;
    }

    try {
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate: audioRef.current?.playbackRate || 1,
        position: Math.min(currentTime, duration),
      });
    } catch {
      // Browsers can reject transient values while metadata is loading.
    }
  }, [currentTime, duration]);

  /* ── skipNext ── */
  const skipNext = useCallback(() => {
    if (queue.length === 0) return;
    if (repeatMode === "one") {
      audioRef.current?.play();
      return;
    }
    const idx = queue.findIndex((t) => t.id === currentTrack?.id);
    const nextIdx = (idx + 1) % queue.length;
    playTrack(queue[nextIdx], true);
  }, [queue, currentTrack, repeatMode, playTrack]);

  useEffect(() => {
    skipNextRef.current = skipNext;
  }, [skipNext]);

  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;
    navigator.mediaSession.setActionHandler("nexttrack", skipNext);
  }, [skipNext]);

  /* ── skipPrev ── */
  const skipPrev = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const idx = queue.findIndex((t) => t.id === currentTrack?.id);
    const prevIdx = idx <= 0 ? queue.length - 1 : idx - 1;
    playTrack(queue[prevIdx], true);
  }, [queue, currentTrack, playTrack]);

  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;
    navigator.mediaSession.setActionHandler("previoustrack", skipPrev);
  }, [skipPrev]);

  /* ── seekTo ── */
  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  /* ── volume / mute ── */
  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    setIsMuted(v === 0);
    if (typeof window !== "undefined") localStorage.setItem("laxon_volume", String(v));
  }, []);

  const toggleMute = useCallback(() => setIsMuted((m) => !m), []);

  /* ── shuffle ── */
  const toggleShuffle = useCallback(() => {
    setIsShuffled((s) => {
      const next = !s;
      if (next) {
        const rest = queue.filter((t) => t.id !== currentTrack?.id);
        setQueue(currentTrack ? [currentTrack, ...shuffleArray(rest)] : shuffleArray(queue));
      } else {
        setQueue([...tracks]);
      }
      return next;
    });
  }, [queue, currentTrack, tracks]);

  /* ── repeat ── */
  const cycleRepeat = useCallback(() => {
    setRepeatMode((r) => (r === "none" ? "all" : r === "all" ? "one" : "none"));
  }, []);

  /* ── liked ── */
  const toggleLike = useCallback((id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      storeLiked(next);
      return next;
    });
  }, []);

  const isLiked = useCallback((id: string) => likedIds.has(id), [likedIds]);

  /* ── sleep timer ── */
  const clearSleepTimer = useCallback(() => {
    if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    sleepTimerRef.current = null;
    sleepEndOfTrackRef.current = false;
    setSleepSecondsLeft(null);
  }, []);

  const setSleepTimer = useCallback(
    (opt: SleepTimerOption) => {
      clearSleepTimer();
      setSleepTimerLabel(opt.label);
      if (!opt.minutes && opt.minutes !== 0 && opt.label === "End of track") {
        sleepEndOfTrackRef.current = true;
        return;
      }
      if (!opt.minutes) return;
      let seconds = opt.minutes * 60;
      setSleepSecondsLeft(seconds);
      sleepTimerRef.current = setInterval(() => {
        seconds -= 1;
        setSleepSecondsLeft(seconds);
        if (seconds <= 0) {
          clearSleepTimer();
          setSleepTimerLabel("Off");
          setIsPlaying(false);
          fadeOutAndPause();
        }
      }, 1000);
    },
    [clearSleepTimer, fadeOutAndPause]
  );

  /* ── queue ops ── */
  const addToQueue = useCallback((track: MusicTrack) => {
    setQueue((q) => (q.some((t) => t.id === track.id) ? q : [...q, track]));
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue((q) => q.filter((t) => t.id !== id));
  }, []);

  const reorderQueue = useCallback((newQueue: MusicTrack[]) => {
    setQueue(newQueue);
  }, []);

  /* ── download ── */
  const downloadTrack = useCallback(async (track: MusicTrack) => {
    if (!track.audio_url) return;
    await databaseService.trackDownload(track.id);
    databaseService.getMusicTracks().then(setTracks);
    const a = document.createElement("a");
    a.href = track.audio_url;
    a.download = `${track.title} - Pastor Laxon Nyamadzawo.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  /* ── share ── */
  const shareTrack = useCallback((track: MusicTrack) => {
    const url = typeof window !== "undefined" ? window.location.origin + "/music" : "";
    const text = `Listen to "${track.title}" by Pastor Laxon Nyamadzawo`;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: track.title, text, url }).catch(() => {});
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(`${text} — ${url}`).catch(() => {});
      }
    }
  }, []);

  const dismissPlayer = useCallback(() => {
    setIsPlayerVisible(false);
    setIsPlaying(false);
    fadeOutAndPause();
  }, [fadeOutAndPause]);

  const value: MusicPlayerContextType = {
    tracks, currentTrack, queue, isPlaying, currentTime, duration,
    volume, isMuted, isShuffled, repeatMode, likedIds, sleepTimerLabel,
    sleepSecondsLeft, isPlayerVisible,
    playTrack, togglePlay, skipNext, skipPrev, seekTo, setVolume,
    toggleMute, toggleShuffle, cycleRepeat, toggleLike, isLiked,
    setSleepTimer, addToQueue, removeFromQueue, reorderQueue,
    downloadTrack, shareTrack, dismissPlayer,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
}
