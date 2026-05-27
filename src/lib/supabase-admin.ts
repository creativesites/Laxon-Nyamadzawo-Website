import "server-only";

import { createClient } from "@supabase/supabase-js";
import { defaultHomepageContent } from "@/lib/homepage-content";
import { MOCK_MUSIC, MOCK_WRITINGS } from "@/lib/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const isSupabaseAdminConfigured = Boolean(supabaseUrl && serviceRoleKey);

function getAdminClient() {
  if (!isSupabaseAdminConfigured) {
    throw new Error("Supabase admin is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function seedCurrentCmsContent() {
  const admin = getAdminClient();
  let writingsInserted = 0;
  let writingsUpdated = 0;
  let musicInserted = 0;
  let musicUpdated = 0;

  for (const writing of MOCK_WRITINGS) {
    const payload = {
      title: writing.title,
      slug: writing.slug,
      excerpt: writing.excerpt,
      content: writing.content,
      category: writing.category,
      published: writing.published,
      published_at: writing.published_at,
      cover_image_url: writing.cover_image_url,
      reading_time: writing.reading_time,
    };

    const { data: existingWriting, error: writingLookupError } = await admin
      .from("writings")
      .select("id")
      .eq("slug", writing.slug)
      .maybeSingle();

    if (writingLookupError) throw writingLookupError;

    if (existingWriting?.id) {
      const { error } = await admin.from("writings").update(payload).eq("id", existingWriting.id);
      if (error) throw error;
      writingsUpdated += 1;
    } else {
      const { error } = await admin.from("writings").insert(payload);
      if (error) throw error;
      writingsInserted += 1;
    }
  }

  for (const track of MOCK_MUSIC) {
    const payload = {
      title: track.title,
      description: track.description,
      youtube_url: track.youtube_url,
      audio_url: track.audio_url,
      language_tags: track.language_tags,
      track_number: track.track_number,
      plays_count: track.plays_count || 0,
      downloads_count: track.downloads_count || 0,
      cover_image_url: track.cover_image_url,
      lyrics: track.lyrics || [],
    };

    const { data: existingTrack, error: trackLookupError } = await admin
      .from("music")
      .select("id")
      .eq("title", track.title)
      .maybeSingle();

    if (trackLookupError) throw trackLookupError;

    if (existingTrack?.id) {
      const { error } = await admin.from("music").update(payload).eq("id", existingTrack.id);
      if (error) throw error;
      musicUpdated += 1;
    } else {
      const { error } = await admin.from("music").insert(payload);
      if (error) throw error;
      musicInserted += 1;
    }
  }

  const { error: homepageError } = await admin
    .from("page_content")
    .upsert({ key: "homepage_content", content: defaultHomepageContent }, { onConflict: "key" });

  if (homepageError) throw homepageError;

  return {
    writingsInserted,
    writingsUpdated,
    musicInserted,
    musicUpdated,
    homepageUpserted: true,
  };
}

export async function createSupabaseAdminUser(input: {
  email: string;
  password: string;
  name?: string;
}) {
  const admin = getAdminClient();
  const { data: createdUser, error } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    app_metadata: {
      role: "admin",
    },
    user_metadata: {
      name: input.name || "Site Admin",
      role: "admin",
    },
  });

  if (error) throw error;

  return {
    id: createdUser.user.id,
    email: createdUser.user.email,
    role: createdUser.user.app_metadata?.role || "admin",
  };
}
