import fs from 'fs/promises';
import path from 'path';

import { getSupabaseServiceClient } from '@/lib/supabaseClient';
import { unstable_noStore as noStore } from 'next/cache';

export interface AboutRecord {
  id?: number;
  heading: string;
  body_mdx: string;
}

const FALLBACK_HEADING = 'About NoStress AI';
const FALLBACK_PATH = path.join(process.cwd(), 'content', 'about', 'default.mdx');
const PLACEHOLDER_SNIPPET = 'Curate your story here.';

let fallbackCache: string | null = null;

async function loadFallbackBody(): Promise<string> {
  if (fallbackCache) {
    return fallbackCache;
  }
  try {
    const source = await fs.readFile(FALLBACK_PATH, 'utf8');
    fallbackCache = source;
    return source;
  } catch (error) {
    console.error('[about] Failed to load fallback about content:', error);
    return '# About NoStress AI\n\nContent coming soon.';
  }
}

export async function fetchAboutRecord(): Promise<AboutRecord | null> {
  // Skip DB fetch during build to prevent crashes
  if (process.env.npm_lifecycle_event === 'build') {
    return null;
  }
  noStore();
  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from('about_content')
    .select('id, heading, body_mdx')
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[about] Failed to load about content from Supabase:', error);
    return null;
  }

  return data ?? null;
}

export async function getAboutContentWithFallback(): Promise<AboutRecord> {
  const record = await fetchAboutRecord();
  if (record && !record.body_mdx.includes(PLACEHOLDER_SNIPPET)) {
    return record;
  }

  return {
    heading: FALLBACK_HEADING,
    body_mdx: await loadFallbackBody()
  };
}
