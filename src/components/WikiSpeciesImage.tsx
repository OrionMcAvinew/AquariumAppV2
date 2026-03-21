import { useState } from 'react';
import { useWikipediaImage } from '../hooks/useWikipediaImage';
import clsx from 'clsx';

interface Props {
  scientificName: string;
  /** Static imageUrl from database (used if present, skips Wikipedia fetch) */
  staticImageUrl?: string;
  emoji: string;
  alt: string;
  className?: string;
}

/**
 * Shows a real species photo pulled from Wikipedia by scientific name.
 * Falls back to the emoji if the fetch fails or while loading.
 * If `staticImageUrl` is provided it is used directly without fetching.
 */
export default function WikiSpeciesImage({ scientificName, staticImageUrl, emoji, alt, className }: Props) {
  const wikiUrl = useWikipediaImage(staticImageUrl ? undefined : scientificName);
  const src = staticImageUrl ?? wikiUrl;
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        className={clsx('object-cover rounded-lg bg-slate-100', className)}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className={clsx('flex items-center justify-center rounded-lg bg-slate-100 text-3xl', className)}>
      {emoji}
    </span>
  );
}
