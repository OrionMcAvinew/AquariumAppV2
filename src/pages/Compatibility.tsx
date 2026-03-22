import { useState, useMemo } from 'react';
import { useStore } from '../store';
import { FISH_DATABASE } from '../data/fishDatabase';
import { Fish } from '../types';
import clsx from 'clsx';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BeakerIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import WikiSpeciesImage from '../components/WikiSpeciesImage';

type Verdict = 'compatible' | 'incompatible' | 'caution' | 'unknown';

interface CompatResult {
  verdict: Verdict;
  conflicts: string[];
  matches: string[];
  tankTypeMismatch: boolean;
  tooSmall: boolean;
}

function checkCompatibility(
  candidate: Fish,
  tankFishIds: string[],
  tankType: string,
  tankVolumeGallons: number
): CompatResult {
  const conflicts: string[] = [];
  const matches: string[] = [];

  const tankTypeMismatch = !candidate.tankType.includes(tankType as any);
  const tooSmall = candidate.minTankSize > tankVolumeGallons;

  for (const existingId of tankFishIds) {
    const existing = FISH_DATABASE.find((f) => f.id === existingId);
    if (!existing) continue;

    const candidateConflicts = candidate.incompatibleWith?.includes(existingId);
    const existingConflicts = existing.incompatibleWith?.includes(candidate.id);

    if (candidateConflicts || existingConflicts) {
      conflicts.push(existing.name);
    } else if (
      candidate.compatibleWith?.includes(existingId) ||
      existing.compatibleWith?.includes(candidate.id)
    ) {
      matches.push(existing.name);
    }
  }

  let verdict: Verdict;
  if (tankTypeMismatch || tooSmall) {
    verdict = 'caution';
  } else if (conflicts.length > 0) {
    verdict = 'incompatible';
  } else if (matches.length > 0) {
    verdict = 'compatible';
  } else {
    verdict = 'unknown';
  }

  return { verdict, conflicts, matches, tankTypeMismatch, tooSmall };
}

const VERDICT_CONFIG = {
  compatible: {
    icon: CheckCircleIcon,
    label: 'Looks Good',
    bg: 'bg-emerald-50 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    iconColor: 'text-emerald-500',
  },
  incompatible: {
    icon: XCircleIcon,
    label: 'Conflict',
    bg: 'bg-red-50 border-red-200',
    badge: 'bg-red-100 text-red-700',
    iconColor: 'text-red-500',
  },
  caution: {
    icon: ExclamationTriangleIcon,
    label: 'Caution',
    bg: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    iconColor: 'text-amber-500',
  },
  unknown: {
    icon: QuestionMarkCircleIcon,
    label: 'Unknown',
    bg: 'bg-slate-50 border-slate-200',
    badge: 'bg-slate-100 text-slate-600',
    iconColor: 'text-slate-400',
  },
};

function FishResultCard({
  fish,
  result,
}: {
  fish: Fish;
  result: CompatResult | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const cfg = result ? VERDICT_CONFIG[result.verdict] : null;
  const Icon = cfg?.icon ?? QuestionMarkCircleIcon;
  const isInWishlist = useStore((s) => s.isInWishlist(fish.id, 'fish'));
  const addToWishlist = useStore((s) => s.addToWishlist);
  const removeFromWishlist = useStore((s) => s.removeFromWishlist);
  const wishlistItems = useStore((s) => s.wishlistItems);

  return (
    <div
      className={clsx(
        'border rounded-xl transition-all duration-200 cursor-pointer',
        cfg ? cfg.bg : 'bg-white border-slate-200',
        expanded && 'shadow-md'
      )}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="flex items-start gap-3 p-4">
        <WikiSpeciesImage
          scientificName={fish.scientificName}
          staticImageUrl={fish.imageUrl}
          emoji={fish.emoji}
          alt={fish.name}
          className="w-14 h-14 shrink-0 rounded-xl"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 leading-tight">{fish.name}</h3>
              <p className="text-xs text-slate-400 italic">{fish.scientificName}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isInWishlist) {
                    const item = wishlistItems.find((w) => w.speciesId === fish.id && w.speciesType === 'fish');
                    if (item) removeFromWishlist(item.id);
                  } else {
                    addToWishlist({ speciesId: fish.id, speciesType: 'fish', addedAt: new Date().toISOString(), notes: '' });
                  }
                }}
                className={clsx('p-1.5 rounded-lg transition-colors', isInWishlist ? 'text-violet-600' : 'text-slate-300 hover:text-violet-500')}
                title={isInWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                {isInWishlist ? <BookmarkSolid className="w-4 h-4" /> : <BookmarkIcon className="w-4 h-4" />}
              </button>
              {cfg && (
                <div className={clsx('flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold', cfg.badge)}>
                  <Icon className={clsx('w-3.5 h-3.5', cfg.iconColor)} />
                  {cfg.label}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-white/70 border border-slate-200 rounded-full px-2 py-0.5 text-slate-600">
              {fish.minTankSize}+ gal
            </span>
            <span className="text-xs bg-white/70 border border-slate-200 rounded-full px-2 py-0.5 text-slate-600">
              {fish.temperatureRange[0]}–{fish.temperatureRange[1]}°F
            </span>
            <span className="text-xs bg-white/70 border border-slate-200 rounded-full px-2 py-0.5 text-slate-600">
              pH {fish.phRange[0]}–{fish.phRange[1]}
            </span>
            <span
              className={clsx(
                'text-xs rounded-full px-2 py-0.5 font-medium',
                fish.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700' :
                fish.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              )}
            >
              {fish.difficulty}
            </span>
          </div>
        </div>
        <span className="text-slate-400 shrink-0 mt-1">
          {expanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
        </span>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/50 pt-3">
          <p className="text-sm text-slate-700">{fish.description}</p>

          {result && (
            <div className="space-y-2">
              {result.conflicts.length > 0 && (
                <div className="flex items-start gap-2 bg-red-100/80 rounded-lg p-2.5">
                  <XCircleIcon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-red-700">Conflicts with:</p>
                    <p className="text-xs text-red-600">{result.conflicts.join(', ')}</p>
                  </div>
                </div>
              )}
              {result.matches.length > 0 && (
                <div className="flex items-start gap-2 bg-emerald-100/80 rounded-lg p-2.5">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-emerald-700">Known compatible with:</p>
                    <p className="text-xs text-emerald-600">{result.matches.join(', ')}</p>
                  </div>
                </div>
              )}
              {result.tankTypeMismatch && (
                <div className="flex items-start gap-2 bg-amber-100/80 rounded-lg p-2.5">
                  <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    This species prefers <strong>{fish.tankType.join(' / ')}</strong> — may not thrive in your tank type.
                  </p>
                </div>
              )}
              {result.tooSmall && (
                <div className="flex items-start gap-2 bg-amber-100/80 rounded-lg p-2.5">
                  <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    Minimum tank size is <strong>{fish.minTankSize} gallons</strong> — your tank may be too small.
                  </p>
                </div>
              )}
              {result.verdict === 'unknown' && result.conflicts.length === 0 && result.matches.length === 0 && (
                <div className="flex items-start gap-2 bg-slate-100/80 rounded-lg p-2.5">
                  <QuestionMarkCircleIcon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500">No explicit compatibility data for your current stock. Research temperament and water needs before adding.</p>
                </div>
              )}
            </div>
          )}

          <div className="bg-white/60 rounded-lg p-2.5">
            <p className="text-xs font-semibold text-slate-600 mb-1">Care notes</p>
            <p className="text-xs text-slate-600">{fish.careNotes}</p>
          </div>
          <div className="flex gap-4 text-xs text-slate-500">
            <span>Max size: <strong className="text-slate-700">{fish.maxSize}</strong></span>
            <span>Lifespan: <strong className="text-slate-700">{fish.lifespan}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Compatibility() {
  const tanks = useStore((s) => s.tanks);
  const fishInstances = useStore((s) => s.fishInstances);

  const [selectedTankId, setSelectedTankId] = useState<string>(tanks[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const [tankTypeFilter, setTankTypeFilter] = useState<string>('all');

  const selectedTank = tanks.find((t) => t.id === selectedTankId);
  const tankVolGal = useMemo(() => {
    if (!selectedTank) return 0;
    return selectedTank.volumeUnit === 'liters'
      ? Math.round(selectedTank.volume / 3.785)
      : selectedTank.volume;
  }, [selectedTank]);

  const tankFishIds = useMemo(() => {
    if (!selectedTank) return [];
    return fishInstances
      .filter((fi) => fi.tankId === selectedTank.id && fi.healthStatus !== 'deceased')
      .map((fi) => fi.speciesId);
  }, [selectedTank, fishInstances]);

  const tankFishDetails = useMemo(
    () => tankFishIds.map((id) => FISH_DATABASE.find((f) => f.id === id)).filter(Boolean) as Fish[],
    [tankFishIds]
  );

  const filteredFish = useMemo(() => {
    const q = query.toLowerCase().trim();
    return FISH_DATABASE.filter((f) => {
      if (tankFishIds.includes(f.id)) return false; // already in tank
      if (tankTypeFilter !== 'all' && !f.tankType.includes(tankTypeFilter as any)) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.scientificName.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
      );
    });
  }, [query, tankTypeFilter, tankFishIds]);

  const results = useMemo(() => {
    if (!selectedTank) return filteredFish.map((f) => ({ fish: f, result: null as CompatResult | null }));
    return filteredFish.map((f) => ({
      fish: f,
      result: checkCompatibility(f, tankFishIds, selectedTank.type, tankVolGal),
    }));
  }, [filteredFish, selectedTank, tankFishIds, tankVolGal]);

  // Sort: incompatible last, compatible first
  const sortedResults = useMemo(() => {
    const order: Record<Verdict, number> = { compatible: 0, unknown: 1, caution: 2, incompatible: 3 };
    return [...results].sort((a, b) => {
      const va = a.result ? order[a.result.verdict] : 1;
      const vb = b.result ? order[b.result.verdict] : 1;
      return va - vb;
    });
  }, [results]);

  const counts = useMemo(() => {
    const c = { compatible: 0, unknown: 0, caution: 0, incompatible: 0 };
    sortedResults.forEach(({ result }) => {
      if (result) c[result.verdict]++;
    });
    return c;
  }, [sortedResults]);

  return (
    <div className="min-h-screen">
      {/* ── Hero header ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #0c2d48 60%, #0f3460 100%)',
      }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(14,165,233,0.6) 0%, transparent 60%)' }}
        />
        <div className="relative px-6 py-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheckIcon className="w-5 h-5 text-ocean-400" />
            <h1 className="text-white text-2xl font-bold tracking-tight">Compatibility Checker</h1>
          </div>
          <p className="text-slate-400 text-sm">See what fish will thrive alongside your current stock</p>

          {/* Summary badges in hero */}
          {selectedTank && (
            <div className="flex gap-2 flex-wrap mt-4">
              {counts.compatible > 0 && (
                <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-2.5 py-1 rounded-full text-xs font-semibold">
                  ✓ {counts.compatible} compatible
                </span>
              )}
              {counts.unknown > 0 && (
                <span className="bg-white/10 border border-white/20 text-white/60 px-2.5 py-1 rounded-full text-xs font-semibold">
                  ? {counts.unknown} unknown
                </span>
              )}
              {counts.caution > 0 && (
                <span className="bg-amber-500/20 border border-amber-400/30 text-amber-300 px-2.5 py-1 rounded-full text-xs font-semibold">
                  ⚠ {counts.caution} caution
                </span>
              )}
              {counts.incompatible > 0 && (
                <span className="bg-red-500/20 border border-red-400/30 text-red-300 px-2.5 py-1 rounded-full text-xs font-semibold">
                  ✗ {counts.incompatible} conflict
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 py-5 space-y-4">

      {/* Tank Selector + Current Stock */}
      <div className="card space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Tank</label>
          {tanks.length === 0 ? (
            <p className="text-sm text-slate-500">No tanks yet — add a tank first.</p>
          ) : (
            <select
              value={selectedTankId}
              onChange={(e) => setSelectedTankId(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              {tanks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.emoji} {t.name} — {t.volume} {t.volumeUnit}, {t.type}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedTank && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Current fish ({tankFishDetails.length})
            </p>
            {tankFishDetails.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No fish tracked yet — add fish via Tank Detail → Livestock tab.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tankFishDetails.map((f) => (
                  <span key={f.id} className="flex items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1 text-sm text-slate-700">
                    <span>{f.emoji}</span> {f.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search fish by name or category…"
            className="input-field pl-9"
          />
        </div>
        <select
          value={tankTypeFilter}
          onChange={(e) => setTankTypeFilter(e.target.value)}
          className="input-field w-auto"
        >
          <option value="all">All types</option>
          <option value="freshwater">Freshwater</option>
          <option value="saltwater">Saltwater</option>
          <option value="reef">Reef</option>
          <option value="planted">Planted</option>
          <option value="brackish">Brackish</option>
        </select>
      </div>

      {/* Results */}
      {sortedResults.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <BeakerIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
          <p>No fish match your search.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedResults.map(({ fish, result }) => (
            <FishResultCard key={fish.id} fish={fish} result={result} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
