import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { Tank, TankType } from '../types';
import { FISH_DATABASE } from '../data/fishDatabase';
import { PLANT_DATABASE } from '../data/plantDatabase';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import { formatISO } from 'date-fns';
import clsx from 'clsx';

const TANK_TYPES: { value: TankType; label: string; description: string; emoji: string }[] = [
  { value: 'freshwater', label: 'Freshwater', description: 'Community or species tank', emoji: '💧' },
  { value: 'planted', label: 'Planted', description: 'Live plants focus', emoji: '🌿' },
  { value: 'saltwater', label: 'Saltwater', description: 'Marine fish only', emoji: '🌊' },
  { value: 'reef', label: 'Reef', description: 'Corals and marine fish', emoji: '🪸' },
  { value: 'brackish', label: 'Brackish', description: 'Partial saltwater', emoji: '🦀' },
];

const EMOJIS = ['🐠', '🐡', '🐟', '🦈', '🪸', '🦞', '🐙', '🦑', '🌊', '💧', '🌿', '🍃'];

export default function AddTank() {
  const navigate = useNavigate();
  const addTank = useStore((s) => s.addTank);
  const addTask = useStore((s) => s.addTask);

  const [form, setForm] = useState({
    name: '',
    type: 'freshwater' as TankType,
    volume: '',
    volumeUnit: 'gallons' as 'gallons' | 'liters',
    description: '',
    setupDate: new Date().toISOString().split('T')[0],
    emoji: '🐠',
  });

  const [selectedFish, setSelectedFish] = useState<string[]>([]);
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const [addDefaultTasks, setAddDefaultTasks] = useState(true);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const compatibleFish = FISH_DATABASE.filter((f) =>
    f.tankType.includes(form.type)
  );
  const compatiblePlants = PLANT_DATABASE;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Tank name is required';
    if (!form.volume || parseFloat(form.volume) <= 0) e.volume = 'Enter a valid volume';
    return e;
  };

  const handleNext = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = () => {
    const newTank: Omit<Tank, 'id'> = {
      name: form.name.trim(),
      type: form.type,
      volume: parseFloat(form.volume),
      volumeUnit: form.volumeUnit,
      description: form.description.trim(),
      setupDate: formatISO(new Date(form.setupDate)),
      fishIds: selectedFish,
      plantIds: selectedPlants,
      emoji: form.emoji,
    };

    const tankId = addTank(newTank);

    if (addDefaultTasks) {
      const now = new Date();
      const tasks = [
        {
          tankId,
          taskType: 'water_change' as const,
          title: '25% Water Change',
          description: 'Replace 25% of water with dechlorinated, temperature-matched water.',
          frequencyDays: 7,
          nextDue: formatISO(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)),
        },
        {
          tankId,
          taskType: 'parameter_test' as const,
          title: 'Full Parameter Test',
          description: 'Test pH, ammonia, nitrite, nitrate, and temperature.',
          frequencyDays: 7,
          nextDue: formatISO(new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)),
        },
        {
          tankId,
          taskType: 'filter_clean' as const,
          title: 'Filter Media Rinse',
          description: 'Rinse mechanical filter media in old tank water. Do not use tap water.',
          frequencyDays: 30,
          nextDue: formatISO(new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)),
        },
      ];
      tasks.forEach((t) => addTask(t));
    }

    navigate(`/tanks/${tankId}`);
  };

  const toggleFish = (id: string) => {
    setSelectedFish((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const togglePlant = (id: string) => {
    setSelectedPlants((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => step === 1 ? navigate(-1) : setStep(1)} className="text-slate-400 hover:text-slate-600">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            {step === 1 ? 'Tank Details' : 'Inhabitants & Tasks'}
          </h1>
          <p className="text-xs text-slate-400">Step {step} of 2</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100">
        <div
          className="h-1 bg-ocean-500 transition-all duration-300"
          style={{ width: `${(step / 2) * 100}%` }}
        />
      </div>

      <div className="p-6 space-y-4">
        {step === 1 && (
          <>
            {/* Tank type */}
            <div className="card">
              <label className="label mb-3">Tank Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TANK_TYPES.map(({ value, label, description, emoji }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: value }))}
                    className={clsx(
                      'p-3 rounded-xl border-2 text-left transition-all',
                      form.type === value
                        ? 'border-ocean-500 bg-ocean-50'
                        : 'border-slate-200 hover:border-slate-300'
                    )}
                  >
                    <span className="text-xl block mb-1">{emoji}</span>
                    <p className="text-sm font-semibold text-slate-800">{label}</p>
                    <p className="text-xs text-slate-400">{description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Name + emoji */}
            <div className="card space-y-4">
              <div>
                <label className="label">Tank Name *</label>
                <input
                  type="text"
                  placeholder="My Tropical Tank"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className={clsx('input-field', errors.name && 'border-red-300')}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="label">Emoji / Icon</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, emoji: e }))}
                      className={clsx(
                        'text-xl p-2 rounded-lg border-2 transition-all',
                        form.emoji === e ? 'border-ocean-400 bg-ocean-50' : 'border-transparent hover:border-slate-200'
                      )}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Volume *</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="29"
                    value={form.volume}
                    onChange={(e) => setForm((f) => ({ ...f, volume: e.target.value }))}
                    className={clsx('input-field', errors.volume && 'border-red-300')}
                  />
                  {errors.volume && <p className="text-red-500 text-xs mt-1">{errors.volume}</p>}
                </div>
                <div>
                  <label className="label">Unit</label>
                  <select
                    value={form.volumeUnit}
                    onChange={(e) => setForm((f) => ({ ...f, volumeUnit: e.target.value as 'gallons' | 'liters' }))}
                    className="input-field"
                  >
                    <option value="gallons">Gallons</option>
                    <option value="liters">Liters</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Setup Date</label>
                <input
                  type="date"
                  value={form.setupDate}
                  onChange={(e) => setForm((f) => ({ ...f, setupDate: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Description (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Community tank with tetras and corydoras..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="input-field resize-none"
                />
              </div>
            </div>

            <button onClick={handleNext} className="btn-primary w-full justify-center">
              Next: Add Inhabitants
            </button>
          </>
        )}

        {step === 2 && (
          <>
            {/* Fish */}
            <div className="card">
              <h3 className="section-title mb-3">Select Fish ({selectedFish.length} selected)</h3>
              <p className="text-xs text-slate-400 mb-3">
                Showing fish compatible with {form.type} tanks.
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {compatibleFish.map((fish) => (
                  <button
                    key={fish.id}
                    type="button"
                    onClick={() => toggleFish(fish.id)}
                    className={clsx(
                      'w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                      selectedFish.includes(fish.id)
                        ? 'border-ocean-400 bg-ocean-50'
                        : 'border-slate-100 hover:border-slate-200'
                    )}
                  >
                    <span className="text-xl shrink-0">{fish.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">{fish.name}</p>
                      <p className="text-xs text-slate-400 truncate">{fish.scientificName} · min {fish.minTankSize} gal</p>
                    </div>
                    <span className={clsx(
                      'text-xs px-2 py-0.5 rounded-full font-medium shrink-0',
                      fish.difficulty === 'beginner' && 'bg-emerald-100 text-emerald-700',
                      fish.difficulty === 'intermediate' && 'bg-amber-100 text-amber-700',
                      fish.difficulty === 'advanced' && 'bg-red-100 text-red-700',
                    )}>
                      {fish.difficulty}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Plants */}
            {(form.type === 'freshwater' || form.type === 'planted') && (
              <div className="card">
                <h3 className="section-title mb-3">Select Plants ({selectedPlants.length} selected)</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {compatiblePlants.map((plant) => (
                    <button
                      key={plant.id}
                      type="button"
                      onClick={() => togglePlant(plant.id)}
                      className={clsx(
                        'w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                        selectedPlants.includes(plant.id)
                          ? 'border-teal-400 bg-teal-50'
                          : 'border-slate-100 hover:border-slate-200'
                      )}
                    >
                      <span className="text-xl shrink-0">{plant.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800">{plant.name}</p>
                        <p className="text-xs text-slate-400 truncate">{plant.lightRequirement} light · {plant.placement}</p>
                      </div>
                      <span className={clsx(
                        'text-xs px-2 py-0.5 rounded-full font-medium shrink-0',
                        plant.difficulty === 'beginner' && 'bg-emerald-100 text-emerald-700',
                        plant.difficulty === 'intermediate' && 'bg-amber-100 text-amber-700',
                        plant.difficulty === 'advanced' && 'bg-red-100 text-red-700',
                      )}>
                        {plant.difficulty}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Default tasks */}
            <div className="card">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addDefaultTasks}
                  onChange={(e) => setAddDefaultTasks(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-ocean-500"
                />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Add default maintenance tasks</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Creates weekly water change, parameter test, and monthly filter cleaning reminders.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex gap-3">
              <button onClick={handleSubmit} className="btn-primary flex-1 justify-center">
                <PlusIcon className="w-4 h-4" />
                Create Tank
              </button>
              <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
