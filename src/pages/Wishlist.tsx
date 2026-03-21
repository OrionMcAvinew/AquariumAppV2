import { useState } from 'react';
import { useStore } from '../store';
import { FISH_DATABASE } from '../data/fishDatabase';
import { PLANT_DATABASE } from '../data/plantDatabase';
import { CORAL_DATABASE } from '../data/coralDatabase';
import { INVERTEBRATE_DATABASE } from '../data/invertebrateDatabase';
import { WishlistSpeciesType } from '../types';
import clsx from 'clsx';
import {
  BookmarkIcon,
  TrashIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { BookmarkSlashIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import WikiSpeciesImage from '../components/WikiSpeciesImage';

type FilterTab = 'all' | WishlistSpeciesType;

function getSpeciesInfo(speciesId: string, speciesType: WishlistSpeciesType) {
  switch (speciesType) {
    case 'fish': return FISH_DATABASE.find((f) => f.id === speciesId);
    case 'plant': return PLANT_DATABASE.find((p) => p.id === speciesId);
    case 'coral': return CORAL_DATABASE.find((c) => c.id === speciesId);
    case 'invertebrate': return INVERTEBRATE_DATABASE.find((i) => i.id === speciesId);
  }
}

const TYPE_LABELS: Record<WishlistSpeciesType, string> = {
  fish: 'Fish',
  plant: 'Plant',
  coral: 'Coral',
  invertebrate: 'Invertebrate',
};

const TYPE_COLORS: Record<WishlistSpeciesType, string> = {
  fish: 'bg-blue-100 text-blue-700',
  plant: 'bg-emerald-100 text-emerald-700',
  coral: 'bg-orange-100 text-orange-700',
  invertebrate: 'bg-purple-100 text-purple-700',
};

export default function Wishlist() {
  const wishlistItems = useStore((s) => s.wishlistItems);
  const removeFromWishlist = useStore((s) => s.removeFromWishlist);
  const tanks = useStore((s) => s.tanks);
  const fishInstances = useStore((s) => s.fishInstances);

  const [filter, setFilter] = useState<FilterTab>('all');
  const [selectedTankId, setSelectedTankId] = useState(tanks[0]?.id ?? '');
  const [addedId, setAddedId] = useState<string | null>(null);

  const selectedTank = tanks.find((t) => t.id === selectedTankId);

  const tankFishIds = fishInstances
    .filter((fi) => fi.tankId === selectedTankId && fi.healthStatus !== 'deceased')
    .map((fi) => fi.speciesId);

  const filtered = wishlistItems.filter((item) => filter === 'all' || item.speciesType === filter);

  const checkFishCompat = (speciesId: string): 'compatible' | 'conflict' | 'unknown' => {
    if (tankFishIds.length === 0) return 'unknown';
    const candidate = FISH_DATABASE.find((f) => f.id === speciesId);
    if (!candidate) return 'unknown';
    for (const existingId of tankFishIds) {
      const existing = FISH_DATABASE.find((f) => f.id === existingId);
      if (candidate.incompatibleWith?.includes(existingId)) return 'conflict';
      if (existing?.incompatibleWith?.includes(speciesId)) return 'conflict';
    }
    const hasMatch = tankFishIds.some(
      (id) => candidate.compatibleWith?.includes(id) || FISH_DATABASE.find((f) => f.id === id)?.compatibleWith?.includes(speciesId)
    );
    return hasMatch ? 'compatible' : 'unknown';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center">
          <BookmarkIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Wishlist</h1>
          <p className="text-sm text-slate-500">Species you're planning to add — {wishlistItems.length} saved</p>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="card text-center py-14">
          <BookmarkSlashIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h2 className="text-slate-600 font-semibold mb-1">Nothing saved yet</h2>
          <p className="text-sm text-slate-400 mb-4">
            Tap the bookmark icon on any species in the Database or Compatibility Checker to save it here.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/database" className="btn-primary text-sm">Browse Database</Link>
            <Link to="/compatibility" className="btn-secondary text-sm">Check Compatibility</Link>
          </div>
        </div>
      ) : (
        <>
          {/* Tank selector for compat check */}
          {tanks.length > 0 && (
            <div className="card flex items-center gap-3">
              <ShieldCheckIcon className="w-5 h-5 text-ocean-500 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 mb-1">Check compatibility with:</p>
                <select
                  value={selectedTankId}
                  onChange={(e) => setSelectedTankId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ocean-500"
                >
                  {tanks.map((t) => (
                    <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            {(['all', 'fish', 'plant', 'coral', 'invertebrate'] as FilterTab[]).map((tab) => {
              const count = tab === 'all' ? wishlistItems.length : wishlistItems.filter((w) => w.speciesType === tab).length;
              if (tab !== 'all' && count === 0) return null;
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={clsx(
                    'flex-1 text-sm font-semibold py-1.5 px-2 rounded-lg capitalize transition-all',
                    filter === tab ? 'bg-white text-ocean-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  {tab === 'all' ? `All (${count})` : `${TYPE_LABELS[tab as WishlistSpeciesType]} (${count})`}
                </button>
              );
            })}
          </div>

          {/* Items */}
          <div className="space-y-3">
            {filtered.map((item) => {
              const species = getSpeciesInfo(item.speciesId, item.speciesType);
              if (!species) return null;
              const compat = item.speciesType === 'fish' && selectedTankId
                ? checkFishCompat(item.speciesId)
                : null;

              return (
                <div key={item.id} className="card flex items-start gap-3">
                  <WikiSpeciesImage
                    scientificName={'scientificName' in species ? species.scientificName : ''}
                    emoji={species.emoji}
                    alt={species.name}
                    className="w-12 h-12 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{species.name}</h3>
                        <p className="text-xs text-slate-400 italic">
                          {'scientificName' in species ? species.scientificName : ''}
                        </p>
                      </div>
                      <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium shrink-0', TYPE_COLORS[item.speciesType])}>
                        {TYPE_LABELS[item.speciesType]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {'difficulty' in species && (
                        <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium',
                          species.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700' :
                          species.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        )}>
                          {species.difficulty}
                        </span>
                      )}
                      {'minTankSize' in species && (
                        <span className="text-xs text-slate-400">{species.minTankSize}+ gal</span>
                      )}
                      {compat && selectedTankId && (
                        <span className={clsx('flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                          compat === 'compatible' ? 'bg-emerald-100 text-emerald-700' :
                          compat === 'conflict' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-500'
                        )}>
                          {compat === 'compatible' && <CheckCircleIcon className="w-3 h-3" />}
                          {compat === 'compatible' ? 'Compatible' : compat === 'conflict' ? '✗ Conflict' : '? Unknown'}
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-500 mt-1.5 italic">"{item.notes}"</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="text-slate-300 hover:text-red-400 transition-colors shrink-0"
                    title="Remove from wishlist"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
