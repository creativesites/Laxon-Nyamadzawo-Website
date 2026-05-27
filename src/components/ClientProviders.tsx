"use client";

import React from "react";
import { SWRConfig } from "swr";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import MiniPlayer from "./player/MiniPlayer";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateIfStale: true,
        dedupingInterval: 5000,
        shouldRetryOnError: false,
      }}
    >
      <MusicPlayerProvider>
        {children}
        <MiniPlayer />
      </MusicPlayerProvider>
    </SWRConfig>
  );
}
