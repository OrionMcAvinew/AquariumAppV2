import { useState } from 'react';
import { useWikipediaImage } from '../hooks/useWikipediaImage';
import clsx from 'clsx';

interface Props {
  scientificName: string;
  /** Pre-verified static URL — tried first, falls back to Wikipedia API on error */
  staticImageUrl?: string;
  emoji: string;
  alt: string;
  className?: string;
}

/**
 * Image cascade: staticImageUrl → Wikipedia API thumbnail → emoji
 * The Wikipedia fetch only fires if staticImageUrl is absent or errors.
 */
export default function WikiSpeciesImage({ scientificName, staticImageUrl, emoji, alt, className }: Props) {
  const [staticFailed, setStaticFailed] = useState(false);

  // Only query Wikipedia when static URL is absent or already failed
  const wikiUrl = useWikipediaImage(!staticImageUrl || staticFailed ? scientificName : undefined);

  const activeSrc = staticFailed ? wikiUrl : (staticImageUrl ?? wikiUrl);
  const [wikiFailed, setWikiFailed] = useState(false);

  if (activeSrc && !wikiFailed) {
    return (
      <img
        src={activeSrc}
        alt={alt}
        className={clsx('object-cover rounded-lg bg-slate-100', className)}
        onError={() => {
          if (!staticFailed && staticImageUrl) {
            setStaticFailed(true); // try Wikipedia next
          } else {
            setWikiFailed(true);  // give up, show emoji
          }
        }}
      />
    );
  }

  return (
    <span className={clsx('flex items-center justify-center rounded-lg bg-slate-100 text-3xl', className)}>
      {emoji}
    </span>
  );
}
