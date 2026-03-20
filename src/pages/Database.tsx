import { useState } from 'react';
import { FISH_DATABASE } from '../data/fishDatabase';
import { PLANT_DATABASE } from '../data/plantDatabase';
import { CORAL_DATABASE } from '../data/coralDatabase';
import { INVERTEBRATE_DATABASE } from '../data/invertebrateDatabase';
import { Fish, Plant, Coral, Invertebrate, Difficulty } from '../types';
import { MagnifyingGlassIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

type ActiveTab = 'fish' | 'plants' | 'corals' | 'inverts';

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
};

function SpeciesImage({ src, alt, emoji, className }: { src?: string; alt: string; emoji: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        className={clsx('object-cover rounded-lg', className)}
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <span className={clsx('flex items-center justify-center text-3xl rounded-lg bg-slate-100', className)}>
      {emoji}
    </span>
  );
}

function FishCard({ fish }: { fish: Fish }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={clsx('card cursor-pointer hover:shadow-md transition-all duration-200', expanded && 'ring-1 ring-ocean-200')}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <SpeciesImage
          src={fish.imageUrl}
          alt={fish.name}
          emoji={fish.emoji}
          className="w-14 h-14 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900">{fish.name}</h3>
              <p className="text-xs text-slate-400 italic">{fish.scientificName}</p>
            </div>
            <span className={clsx('text-xs px-2 py-1 rounded-full font-semibold shrink-0', DIFFICULTY_COLORS[fish.difficulty])}>
              {fish.difficulty}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              Min {fish.minTankSize} gal
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              {fish.temperatureRange[0]}–{fish.temperatureRange[1]}°F
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              pH {fish.phRange[0]}–{fish.phRange[1]}
            </span>
            {fish.tankType.map((type) => (
              <span key={type} className="text-xs bg-ocean-100 text-ocean-700 px-2 py-0.5 rounded-full font-medium capitalize">
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          <p className="text-sm text-slate-600">{fish.description}</p>
          <div className="bg-ocean-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-ocean-700 mb-1">💡 Care Notes</p>
            <p className="text-sm text-slate-600">{fish.careNotes}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 font-medium">Max Size</p>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">{fish.maxSize}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 font-medium">Lifespan</p>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">{fish.lifespan}</p>
            </div>
          </div>
          {fish.compatibleWith.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1.5">✅ Compatible with</p>
              <div className="flex flex-wrap gap-1">
                {fish.compatibleWith.map((id) => {
                  const f = FISH_DATABASE.find((x) => x.id === id);
                  return f ? (
                    <span key={id} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                      {f.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
          {fish.incompatibleWith.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1.5">❌ Incompatible with</p>
              <div className="flex flex-wrap gap-1">
                {fish.incompatibleWith.map((id) => {
                  const f = FISH_DATABASE.find((x) => x.id === id);
                  return f ? (
                    <span key={id} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-100">
                      {f.name}
                    </span>
                  ) : (
                    <span key={id} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-100">
                      {id.replace(/-/g, ' ')}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PlantCard({ plant }: { plant: Plant }) {
  const [expanded, setExpanded] = useState(false);

  const lightColor: Record<string, string> = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    'very-high': 'bg-red-100 text-red-700',
  };

  const growthColor = {
    slow: 'bg-slate-100 text-slate-600',
    medium: 'bg-blue-100 text-blue-700',
    fast: 'bg-green-100 text-green-700',
  };

  return (
    <div
      className={clsx('card cursor-pointer hover:shadow-md transition-all duration-200', expanded && 'ring-1 ring-teal-200')}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <SpeciesImage
          src={plant.imageUrl}
          alt={plant.name}
          emoji={plant.emoji}
          className="w-14 h-14 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900">{plant.name}</h3>
              <p className="text-xs text-slate-400 italic">{plant.scientificName}</p>
            </div>
            <span className={clsx('text-xs px-2 py-1 rounded-full font-semibold shrink-0', DIFFICULTY_COLORS[plant.difficulty])}>
              {plant.difficulty}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', lightColor[plant.lightRequirement])}>
              {plant.lightRequirement} light
            </span>
            <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', growthColor[plant.growthRate])}>
              {plant.growthRate} growth
            </span>
            <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium capitalize">
              {plant.placement}
            </span>
            {plant.co2Required && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                CO₂ required
              </span>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          <p className="text-sm text-slate-600">{plant.description}</p>
          <div className="bg-teal-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-teal-700 mb-1">💡 Care Notes</p>
            <p className="text-sm text-slate-600">{plant.careNotes}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 font-medium">Temperature</p>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">{plant.temperatureRange[0]}–{plant.temperatureRange[1]}°F</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-slate-400 font-medium">pH Range</p>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">{plant.phRange[0]}–{plant.phRange[1]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const CORAL_TYPE_COLORS: Record<Coral['coralType'], string> = {
  soft: 'bg-purple-100 text-purple-700',
  lps: 'bg-orange-100 text-orange-700',
  sps: 'bg-pink-100 text-pink-700',
};

const AGGRESSION_COLORS: Record<Coral['aggressiveness'], string> = {
  peaceful: 'bg-emerald-100 text-emerald-700',
  'semi-aggressive': 'bg-amber-100 text-amber-700',
  aggressive: 'bg-red-100 text-red-700',
};

function CoralCard({ coral }: { coral: Coral }) {
  const [expanded, setExpanded] = useState(false);

  const lightColor: Record<string, string> = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    'very-high': 'bg-red-100 text-red-700',
  };

  return (
    <div
      className={clsx('card cursor-pointer hover:shadow-md transition-all duration-200', expanded && 'ring-1 ring-purple-200')}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <SpeciesImage
          src={coral.imageUrl}
          alt={coral.name}
          emoji={coral.emoji}
          className="w-14 h-14 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900">{coral.name}</h3>
              <p className="text-xs text-slate-400 italic">{coral.scientificName}</p>
            </div>
            <span className={clsx('text-xs px-2 py-1 rounded-full font-semibold shrink-0 uppercase', CORAL_TYPE_COLORS[coral.coralType])}>
              {coral.coralType}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', DIFFICULTY_COLORS[coral.difficulty])}>
              {coral.difficulty}
            </span>
            <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', lightColor[coral.lightRequirement])}>
              {coral.lightRequirement} light
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              {coral.flowRequirement} flow
            </span>
            <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium capitalize', AGGRESSION_COLORS[coral.aggressiveness])}>
              {coral.aggressiveness}
            </span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          <p className="text-sm text-slate-600">{coral.description}</p>
          <div className="bg-purple-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-purple-700 mb-1">💡 Care Notes</p>
            <p className="text-sm text-slate-600">{coral.careNotes}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-400 font-medium">Placement</p>
            <p className="text-sm font-semibold text-slate-700 mt-0.5 capitalize">{coral.placement} of tank</p>
          </div>
        </div>
      )}
    </div>
  );
}

const INVERT_TYPE_COLORS: Record<Invertebrate['invertType'], string> = {
  shrimp: 'bg-pink-100 text-pink-700',
  snail: 'bg-amber-100 text-amber-700',
  crab: 'bg-orange-100 text-orange-700',
  urchin: 'bg-purple-100 text-purple-700',
  starfish: 'bg-blue-100 text-blue-700',
  other: 'bg-slate-100 text-slate-600',
};

function InvertCard({ invert }: { invert: Invertebrate }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={clsx('card cursor-pointer hover:shadow-md transition-all duration-200', expanded && 'ring-1 ring-amber-200')}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <SpeciesImage
          src={invert.imageUrl}
          alt={invert.name}
          emoji={invert.emoji}
          className="w-14 h-14 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900">{invert.name}</h3>
              <p className="text-xs text-slate-400 italic">{invert.scientificName}</p>
            </div>
            <span className={clsx('text-xs px-2 py-1 rounded-full font-semibold shrink-0 capitalize', INVERT_TYPE_COLORS[invert.invertType])}>
              {invert.invertType}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', DIFFICULTY_COLORS[invert.difficulty])}>
              {invert.difficulty}
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              Min {invert.minTankSize} gal
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              {invert.temperatureRange[0]}–{invert.temperatureRange[1]}°F
            </span>
            {invert.tankType.map((type) => (
              <span key={type} className="text-xs bg-ocean-100 text-ocean-700 px-2 py-0.5 rounded-full font-medium capitalize">
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          <p className="text-sm text-slate-600">{invert.description}</p>
          {invert.cleaningRole && (
            <div className="bg-emerald-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-emerald-700 mb-1">🧹 Cleaning Role</p>
              <p className="text-sm text-slate-600">{invert.cleaningRole}</p>
            </div>
          )}
          <div className="bg-amber-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-amber-700 mb-1">💡 Care Notes</p>
            <p className="text-sm text-slate-600">{invert.careNotes}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Database() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('fish');
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [tankTypeFilter, setTankTypeFilter] = useState('all');
  const [coralTypeFilter, setCoralTypeFilter] = useState<'all' | 'soft' | 'lps' | 'sps'>('all');

  const filteredFish = FISH_DATABASE.filter((f) => {
    const matchSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.scientificName.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase());
    const matchDifficulty = difficultyFilter === 'all' || f.difficulty === difficultyFilter;
    const matchType = tankTypeFilter === 'all' || f.tankType.includes(tankTypeFilter as never);
    return matchSearch && matchDifficulty && matchType;
  });

  const filteredPlants = PLANT_DATABASE.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.scientificName.toLowerCase().includes(search.toLowerCase());
    const matchDifficulty = difficultyFilter === 'all' || p.difficulty === difficultyFilter;
    return matchSearch && matchDifficulty;
  });

  const filteredCorals = CORAL_DATABASE.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.scientificName.toLowerCase().includes(search.toLowerCase());
    const matchDifficulty = difficultyFilter === 'all' || c.difficulty === difficultyFilter;
    const matchType = coralTypeFilter === 'all' || c.coralType === coralTypeFilter;
    return matchSearch && matchDifficulty && matchType;
  });

  const filteredInverts = INVERTEBRATE_DATABASE.filter((i) => {
    const matchSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.scientificName.toLowerCase().includes(search.toLowerCase());
    const matchDifficulty = difficultyFilter === 'all' || i.difficulty === difficultyFilter;
    const matchType = tankTypeFilter === 'all' || i.tankType.includes(tankTypeFilter as never);
    return matchSearch && matchDifficulty && matchType;
  });

  const tabs: { id: ActiveTab; label: string; icon: string; count: number }[] = [
    { id: 'fish', label: 'Fish', icon: '🐠', count: FISH_DATABASE.length },
    { id: 'plants', label: 'Plants', icon: '🌿', count: PLANT_DATABASE.length },
    { id: 'corals', label: 'Corals', icon: '🪸', count: CORAL_DATABASE.length },
    { id: 'inverts', label: 'Inverts', icon: '🦐', count: INVERTEBRATE_DATABASE.length },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpenIcon className="w-6 h-6 text-ocean-500" />
          <h1 className="page-title">Database</h1>
        </div>
        <p className="text-slate-500 text-sm">
          {FISH_DATABASE.length} fish · {PLANT_DATABASE.length} plants · {CORAL_DATABASE.length} corals · {INVERTEBRATE_DATABASE.length} invertebrates
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'flex-1 text-xs font-semibold py-2 rounded-lg capitalize transition-all flex items-center justify-center gap-1',
              activeTab === tab.id ? 'bg-white text-ocean-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="text-xs opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="flex-1 min-w-48 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value as Difficulty | 'all')}
          className="input-field w-auto"
        >
          <option value="all">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        {(activeTab === 'fish' || activeTab === 'inverts') && (
          <select
            value={tankTypeFilter}
            onChange={(e) => setTankTypeFilter(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">All tank types</option>
            <option value="freshwater">Freshwater</option>
            <option value="saltwater">Saltwater</option>
            <option value="reef">Reef</option>
            <option value="planted">Planted</option>
            <option value="brackish">Brackish</option>
          </select>
        )}
        {activeTab === 'corals' && (
          <select
            value={coralTypeFilter}
            onChange={(e) => setCoralTypeFilter(e.target.value as typeof coralTypeFilter)}
            className="input-field w-auto"
          >
            <option value="all">All types</option>
            <option value="soft">Soft</option>
            <option value="lps">LPS</option>
            <option value="sps">SPS</option>
          </select>
        )}
      </div>

      {/* Results */}
      <div className="space-y-3">
        {activeTab === 'fish' && (
          filteredFish.length === 0
            ? <div className="card text-center py-10"><p className="text-slate-400">No fish match your search.</p></div>
            : filteredFish.map((fish) => <FishCard key={fish.id} fish={fish} />)
        )}
        {activeTab === 'plants' && (
          filteredPlants.length === 0
            ? <div className="card text-center py-10"><p className="text-slate-400">No plants match your search.</p></div>
            : filteredPlants.map((plant) => <PlantCard key={plant.id} plant={plant} />)
        )}
        {activeTab === 'corals' && (
          filteredCorals.length === 0
            ? <div className="card text-center py-10"><p className="text-slate-400">{CORAL_DATABASE.length === 0 ? 'Coral database loading...' : 'No corals match your search.'}</p></div>
            : filteredCorals.map((coral) => <CoralCard key={coral.id} coral={coral} />)
        )}
        {activeTab === 'inverts' && (
          filteredInverts.length === 0
            ? <div className="card text-center py-10"><p className="text-slate-400">{INVERTEBRATE_DATABASE.length === 0 ? 'Invertebrate database loading...' : 'No invertebrates match your search.'}</p></div>
            : filteredInverts.map((invert) => <InvertCard key={invert.id} invert={invert} />)
        )}
      </div>
    </div>
  );
}
