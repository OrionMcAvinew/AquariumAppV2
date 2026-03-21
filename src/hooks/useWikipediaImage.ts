import { useState, useEffect } from 'react';

// Module-level cache so we don't re-fetch across re-renders / remounts
const cache = new Map<string, string | null>();
const pending = new Map<string, Promise<string | null>>();

async function fetchWikipediaThumb(scientificName: string): Promise<string | null> {
  const slug = scientificName.trim().replace(/\s+/g, '_');
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

export function useWikipediaImage(scientificName: string | undefined): string | null {
  const key = scientificName?.trim() ?? '';
  const [imgUrl, setImgUrl] = useState<string | null>(() => cache.get(key) ?? null);

  useEffect(() => {
    if (!key) return;
    if (cache.has(key)) {
      setImgUrl(cache.get(key) ?? null);
      return;
    }

    let cancelled = false;

    const doFetch = async () => {
      if (!pending.has(key)) {
        pending.set(key, fetchWikipediaThumb(key));
      }
      const result = await pending.get(key)!;
      cache.set(key, result);
      pending.delete(key);
      if (!cancelled) setImgUrl(result);
    };

    doFetch();
    return () => { cancelled = true; };
  }, [key]);

  return imgUrl;
}
