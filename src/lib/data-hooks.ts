"use client";

import useSWR from "swr";
import { databaseService, ContactMessage, MusicTrack, Writing } from "@/lib/supabase";
import { defaultHomepageContent, HomepageContent } from "@/lib/homepage-content";

const fetchers = {
  writings: () => databaseService.getWritings(),
  writingBySlug: (_: string, slug: string) => databaseService.getWritingBySlug(slug),
  music: () => databaseService.getMusicTracks(),
  messages: () => databaseService.getMessages(),
  homepage: () => databaseService.getPageContent<HomepageContent>("homepage_content", defaultHomepageContent),
};

export function useWritings(enabled = true) {
  return useSWR<Writing[]>(enabled ? "writings" : null, fetchers.writings);
}

export function useWritingBySlug(slug: string | null) {
  return useSWR<Writing | null, Error, [string, string] | null>(slug ? ["writing", slug] : null, ([, value]) =>
    databaseService.getWritingBySlug(value),
  );
}

export function useMusicTracks(enabled = true) {
  return useSWR<MusicTrack[]>(enabled ? "music" : null, fetchers.music);
}

export function useMessages(enabled = true) {
  return useSWR<ContactMessage[]>(enabled ? "messages" : null, fetchers.messages);
}

export function useHomepageContent(enabled = true) {
  return useSWR<HomepageContent>(enabled ? "homepage_content" : null, fetchers.homepage, {
    fallbackData: defaultHomepageContent,
  });
}
