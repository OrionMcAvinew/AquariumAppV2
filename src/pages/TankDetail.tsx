import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { getFishById } from '../data/fishDatabase';
import { getPlantById } from '../data/plantDatabase';
import HealthScore from '../components/HealthScore';
import AlertBanner from '../components/AlertBanner';
import ParameterChart from '../components/ParameterChart';
import {
  calculateTankHealthScore,
  getParameterStatus,
  PARAMETER_LABELS,
  PARAMETER_UNITS,
  getRangesForTankType,
} from '../utils/parameterRanges';
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ClockIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO, isPast } from 'date-fns';
import { WaterReading, FishHealthStatus, JournalMood } from '../types';
import clsx from 'clsx';
import { useState } from 'react';
import { FISH_DATABASE as fishDatabase } from '../data/fishDatabase';

const PARAM_KEYS: Array<keyof Omit<WaterReading, 'id' | 'tankId' | 'timestamp' | 'notes'>> = [
  'ph', 'ammonia', 'nitrite', 'nitrate', 'temperature', 'salinity', 'gh', 'kh', 'phosphate', 'dissolvedOxygen', 'calcium', 'magnesium',
];

export default function TankDetail() {
  const { tankId } = useParams<{ tankId: string }>();
  const navigate = useNavigate();
  const tanks = useStore((s) => s.tanks);
  const deleteTank = useStore((s) => s.deleteTank);
  const getTankReadings = useStore((s) => s.getTankReadings);
  const getTankTasks = useStore((s) => s.getTankTasks);
  const completeTask = useStore((s) => s.completeTask);
  const deleteTask = useStore((s) => s.deleteTask);
  const activeAlerts = useStore((s) => s.getActiveAlerts());
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'tasks' | 'livestock' | 'feeding' | 'journal'>('overview');

  // Livestock state
  const fishInstances = useStore((s) => s.getTankFishInstances(tankId!));
  const addFishInstance = useStore((s) => s.addFishInstance);
  const updateFishInstance = useStore((s) => s.updateFishInstance);
  const deleteFishInstance = useStore((s) => s.deleteFishInstance);
  const [showAddFish, setShowAddFish] = useState(false);
  const [fishForm, setFishForm] = useState({ speciesId: '', nickname: '', dateAdded: new Date().toISOString().slice(0,10), healthStatus: 'healthy' as FishHealthStatus, notes: '' });

  // Feeding state
  const feedingSchedules = useStore((s) => s.getTankFeedingSchedules(tankId!));
  const feedingLogs = useStore((s) => s.getTankFeedingLogs(tankId!));
  const addFeedingSchedule = useStore((s) => s.addFeedingSchedule);
  const deleteFeedingSchedule = useStore((s) => s.deleteFeedingSchedule);
  const logFeeding = useStore((s) => s.logFeeding);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ foodType: '', amount: '', timesPerDay: 2, notes: '' });

  // Journal state
  const journalEntries = useStore((s) => s.getTankJournalEntries(tankId!));
  const addJournalEntry = useStore((s) => s.addJournalEntry);
  const deleteJournalEntry = useStore((s) => s.deleteJournalEntry);
  const [journalForm, setJournalForm] = useState({ title: '', content: '', mood: 'good' as JournalMood });

  const tank = tanks.find((t) => t.id === tankId);
  if (!tank) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500">Tank not found.</p>
        <Link to="/dashboard" className="btn-primary mt-4 mx-auto">Back to Dashboard</Link>
      </div>
    );
  }

  const readings = getTankReadings(tank.id);
  const latestReading = readings[0];
  const tasks = getTankTasks(tank.id);
  const tankAlerts = activeAlerts.filter((a) => a.tankId === tank.id);
  const ranges = getRangesForTankType(tank.type);

  const readingValues: Record<string, number> = latestReading
    ? Object.fromEntries(
        PARAM_KEYS.map((k) => [k, latestReading[k] as number]).filter(([, v]) => v !== undefined)
      )
    : {};

  const healthScore = latestReading ? calculateTankHealthScore(readingValues, tank.type) : 0;

  const handleDelete = () => {
    deleteTank(tank.id);
    navigate('/dashboard');
  };

  const fish = tank.fishIds.map(getFishById).filter(Boolean);
  const plants = tank.plantIds.map(getPlantById).filter(Boolean);

  const typeLabel = tank.type.charAt(0).toUpperCase() + tank.type.slice(1);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <span className="text-2xl">{tank.emoji}</span>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-slate-900 truncate">{tank.name}</h1>
          <p className="text-xs text-slate-400">{typeLabel} · {tank.volume} {tank.volumeUnit}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/tanks/${tank.id}/log`} className="btn-primary text-sm py-1.5">
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Log Reading</span>
          </Link>
          <button
            onClick={() => setConfirmDelete(!confirmDelete)}
            className="text-slate-400 hover:text-red-500 transition-colors p-2"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {confirmDelete && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center gap-3">
          <p className="text-sm text-red-700 font-medium flex-1">Delete {tank.name}? This cannot be undone.</p>
          <button onClick={handleDelete} className="btn-danger text-sm py-1.5">Delete</button>
          <button onClick={() => setConfirmDelete(false)} className="btn-secondary text-sm py-1.5">Cancel</button>
        </div>
      )}

      <div className="p-6 space-y-5">
        {/* Alerts */}
        {tankAlerts.length > 0 && (
          <AlertBanner alerts={tankAlerts} />
        )}

        {/* Health overview */}
        <div className="card">
          <div className="flex items-center gap-6">
            <HealthScore score={healthScore} size="lg" />
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 mb-1">Tank Health</h3>
              {latestReading ? (
                <>
                  <p className="text-sm text-slate-500 mb-2">
                    Based on latest reading · {format(parseISO(latestReading.timestamp), 'MMM d, h:mm a')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PARAM_KEYS.map((param) => {
                      const value = latestReading[param] as number | undefined;
                      if (!value || !ranges[param]) return null;
                      const status = getParameterStatus(param as string, value, tank.type);
                      const unit = PARAMETER_UNITS[param as string] || '';
                      return (
                        <span
                          key={param}
                          className={clsx(
                            'text-xs px-2 py-1 rounded-lg font-medium',
                            status === 'safe' && 'bg-emerald-50 text-emerald-700',
                            status === 'warning' && 'bg-amber-50 text-amber-700',
                            status === 'critical' && 'bg-red-50 text-red-700',
                          )}
                        >
                          {PARAMETER_LABELS[param as string]}: {value.toFixed(2)}{unit}
                        </span>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-sm text-slate-400 mb-3">No readings logged yet.</p>
                  <Link to={`/tanks/${tank.id}/log`} className="btn-primary text-sm">
                    <PlusIcon className="w-4 h-4" />
                    Log First Reading
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
          {(['overview', 'charts', 'tasks', 'livestock', 'feeding', 'journal'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'shrink-0 flex-1 text-sm font-semibold py-2 px-3 rounded-lg capitalize transition-all',
                activeTab === tab
                  ? 'bg-white text-ocean-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="section-title mb-4">Tank Info</h3>
              <dl className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-xs text-slate-400 font-medium">Type</dt>
                  <dd className="text-sm font-semibold text-slate-800 mt-0.5">{typeLabel}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400 font-medium">Volume</dt>
                  <dd className="text-sm font-semibold text-slate-800 mt-0.5">{tank.volume} {tank.volumeUnit}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400 font-medium">Set Up</dt>
                  <dd className="text-sm font-semibold text-slate-800 mt-0.5">{format(parseISO(tank.setupDate), 'MMM d, yyyy')}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-400 font-medium">Readings</dt>
                  <dd className="text-sm font-semibold text-slate-800 mt-0.5">{readings.length}</dd>
                </div>
              </dl>
              {tank.description && (
                <p className="text-sm text-slate-500 mt-3 pt-3 border-t border-slate-100">{tank.description}</p>
              )}
            </div>

            {/* Recent readings table */}
            {readings.length > 0 && (
              <div className="card p-0 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                  <BeakerIcon className="w-4 h-4 text-ocean-500" />
                  <h3 className="section-title">Recent Readings</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                        {PARAM_KEYS.filter((k) => readings.some((r) => r[k] !== undefined)).map((k) => (
                          <th key={k} className="text-right px-3 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                            {PARAMETER_LABELS[k as string]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {readings.slice(0, 7).map((reading) => (
                        <tr key={reading.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-2.5 text-slate-500 text-xs whitespace-nowrap">
                            {format(parseISO(reading.timestamp), 'MMM d, h:mm a')}
                          </td>
                          {PARAM_KEYS.filter((k) => readings.some((r) => r[k] !== undefined)).map((param) => {
                            const value = reading[param] as number | undefined;
                            if (value === undefined) return <td key={param} className="px-3 py-2.5 text-right text-slate-300">—</td>;
                            const status = getParameterStatus(param as string, value, tank.type);
                            return (
                              <td key={param} className={clsx(
                                'px-3 py-2.5 text-right font-medium text-xs whitespace-nowrap',
                                status === 'safe' && 'text-emerald-600',
                                status === 'warning' && 'text-amber-600',
                                status === 'critical' && 'text-red-600',
                                status === 'unknown' && 'text-slate-500',
                              )}>
                                {value.toFixed(2)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          {/* Stocking Level */}
          {(() => {
            const instances = fishInstances.filter((fi) => fi.healthStatus !== 'deceased');
            if (instances.length === 0) return null;
            const totalInches = instances.reduce((sum, fi) => {
              const species = fishDatabase.find((f) => f.id === fi.speciesId);
              if (!species) return sum;
              const match = species.maxSize.match(/[\d.]+/);
              return sum + (match ? parseFloat(match[0]) : 2);
            }, 0);
            const tankGal = tank.volumeUnit === 'liters' ? tank.volume / 3.785 : tank.volume;
            const ratio = totalInches / tankGal;
            const pct = Math.min(ratio / 2, 1) * 100;
            const { label, color, bg } =
              ratio < 0.5 ? { label: 'Understocked', color: 'bg-blue-400', bg: 'text-blue-700' } :
              ratio < 1   ? { label: 'Lightly Stocked', color: 'bg-emerald-400', bg: 'text-emerald-700' } :
              ratio < 1.5 ? { label: 'Moderately Stocked', color: 'bg-amber-400', bg: 'text-amber-700' } :
              ratio < 2   ? { label: 'Heavily Stocked', color: 'bg-orange-500', bg: 'text-orange-700' } :
                            { label: 'Overstocked', color: 'bg-red-500', bg: 'text-red-700' };
            return (
              <div className="card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="section-title">Stocking Level</h3>
                  <span className={`text-xs font-bold ${bg}`}>{label}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-2">
                  <div className={`h-3 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-slate-500">
                  ~{totalInches.toFixed(1)}" of fish in {tankGal.toFixed(0)} gal tank
                  {' '}· Based on simplified inch-per-gallon guideline
                </p>
              </div>
            );
          })()}
          </div>
        )}

        {/* Tab: Charts */}
        {activeTab === 'charts' && (
          <div className="space-y-4">
            {readings.length < 2 ? (
              <div className="card text-center py-10">
                <p className="text-slate-400 text-sm">Log at least 2 readings to see charts.</p>
              </div>
            ) : (
              PARAM_KEYS.filter((k) => readings.some((r) => r[k] !== undefined)).map((param) => (
                <div key={param} className="card">
                  <ParameterChart
                    readings={readings}
                    parameter={param}
                    tankType={tank.type}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Tasks */}
        {activeTab === 'tasks' && (
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="card text-center py-10">
                <WrenchScrewdriverIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No maintenance tasks for this tank.</p>
                <Link to="/maintenance" className="btn-primary mt-4 mx-auto">
                  <PlusIcon className="w-4 h-4" />
                  Add Task
                </Link>
              </div>
            ) : (
              tasks
                .sort((a, b) => parseISO(a.nextDue).getTime() - parseISO(b.nextDue).getTime())
                .map((task) => {
                  const isOverdue = isPast(parseISO(task.nextDue));
                  return (
                    <div key={task.id} className={clsx('card flex items-start gap-3', isOverdue && 'border-amber-200')}>
                      <button
                        onClick={() => completeTask(task.id)}
                        className="shrink-0 mt-0.5 text-slate-300 hover:text-emerald-500 transition-colors"
                      >
                        <CheckCircleIcon className="w-6 h-6" />
                      </button>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">{task.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={clsx(
                            'flex items-center gap-1 text-xs font-medium',
                            isOverdue ? 'text-amber-600' : 'text-slate-400'
                          )}>
                            <ClockIcon className="w-3.5 h-3.5" />
                            {isOverdue ? 'Overdue · ' : 'Due '}
                            {format(parseISO(task.nextDue), 'MMM d')}
                          </span>
                          <span className="text-xs text-slate-400">Every {task.frequencyDays}d</span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="shrink-0 text-slate-300 hover:text-red-400 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
            )}
          </div>
        )}

        {/* Tab: Livestock */}
        {activeTab === 'livestock' && (
          <div className="space-y-4">
            {/* Individual fish instances */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="section-title">Individual Fish ({fishInstances.length})</h3>
                <button onClick={() => setShowAddFish(!showAddFish)} className="btn-primary text-xs py-1.5">
                  <PlusIcon className="w-3.5 h-3.5" />
                  Track Fish
                </button>
              </div>

              {showAddFish && (
                <form
                  className="bg-slate-50 rounded-xl p-4 mb-4 space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!fishForm.speciesId) return;
                    addFishInstance({ ...fishForm, tankId: tank.id });
                    setFishForm({ speciesId: '', nickname: '', dateAdded: new Date().toISOString().slice(0,10), healthStatus: 'healthy', notes: '' });
                    setShowAddFish(false);
                  }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Species *</label>
                      <select
                        required
                        value={fishForm.speciesId}
                        onChange={(e) => setFishForm((p) => ({ ...p, speciesId: e.target.value }))}
                        className="input text-sm"
                      >
                        <option value="">Select species...</option>
                        {fishDatabase.map((f) => (
                          <option key={f.id} value={f.id}>{f.emoji} {f.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Nickname</label>
                      <input
                        type="text"
                        value={fishForm.nickname}
                        onChange={(e) => setFishForm((p) => ({ ...p, nickname: e.target.value }))}
                        placeholder="e.g. Nemo"
                        className="input text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Date Added</label>
                      <input
                        type="date"
                        value={fishForm.dateAdded}
                        onChange={(e) => setFishForm((p) => ({ ...p, dateAdded: e.target.value }))}
                        className="input text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Health</label>
                      <select
                        value={fishForm.healthStatus}
                        onChange={(e) => setFishForm((p) => ({ ...p, healthStatus: e.target.value as FishHealthStatus }))}
                        className="input text-sm"
                      >
                        <option value="healthy">Healthy</option>
                        <option value="sick">Sick</option>
                        <option value="quarantine">Quarantine</option>
                        <option value="deceased">Deceased</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Notes</label>
                      <input
                        type="text"
                        value={fishForm.notes}
                        onChange={(e) => setFishForm((p) => ({ ...p, notes: e.target.value }))}
                        placeholder="Optional"
                        className="input text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary text-sm">Add Fish</button>
                    <button type="button" onClick={() => setShowAddFish(false)} className="btn-secondary text-sm">Cancel</button>
                  </div>
                </form>
              )}

              {fishInstances.length === 0 ? (
                <p className="text-slate-400 text-sm">No individual fish tracked yet. Click "Track Fish" to add one.</p>
              ) : (
                <div className="space-y-2">
                  {fishInstances.map((fi) => {
                    const species = getFishById(fi.speciesId);
                    return (
                      <div key={fi.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <span className="text-xl">{species?.emoji || '🐟'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-sm">
                            {fi.nickname || species?.name || 'Unknown'}
                          </p>
                          {fi.nickname && species && (
                            <p className="text-xs text-slate-400">{species.name}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className={clsx(
                              'text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1',
                              fi.healthStatus === 'healthy' && 'bg-emerald-100 text-emerald-700',
                              fi.healthStatus === 'sick' && 'bg-red-100 text-red-700',
                              fi.healthStatus === 'quarantine' && 'bg-amber-100 text-amber-700',
                              fi.healthStatus === 'deceased' && 'bg-slate-200 text-slate-500',
                            )}>
                              <HeartIcon className="w-3 h-3" />
                              {fi.healthStatus}
                            </span>
                            <span className="text-xs text-slate-400">
                              Since {format(parseISO(fi.dateAdded), 'MMM d, yyyy')}
                            </span>
                          </div>
                          {fi.notes && <p className="text-xs text-slate-400 mt-0.5 truncate">{fi.notes}</p>}
                        </div>
                        <div className="flex items-center gap-1">
                          <select
                            value={fi.healthStatus}
                            onChange={(e) => updateFishInstance(fi.id, { healthStatus: e.target.value as FishHealthStatus })}
                            className="text-xs border border-slate-200 rounded-lg px-1.5 py-1 bg-white focus:outline-none"
                          >
                            <option value="healthy">Healthy</option>
                            <option value="sick">Sick</option>
                            <option value="quarantine">Quarantine</option>
                            <option value="deceased">Deceased</option>
                          </select>
                          <button
                            onClick={() => deleteFishInstance(fi.id)}
                            className="text-slate-300 hover:text-red-400 transition-colors p-1"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Species in tank */}
            <div className="card">
              <h3 className="section-title mb-3">Species ({fish.length})</h3>
              {fish.length === 0 ? (
                <p className="text-slate-400 text-sm">No fish species in this tank.</p>
              ) : (
                <div className="space-y-2">
                  {fish.map((f) => f && (
                    <div key={f.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                      <span className="text-2xl">{f.emoji}</span>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{f.name}</p>
                        <p className="text-xs text-slate-400 italic">{f.scientificName}</p>
                        <div className="flex gap-2 mt-1">
                          <span className={clsx(
                            'text-xs px-2 py-0.5 rounded-full font-medium',
                            f.difficulty === 'beginner' && 'bg-emerald-100 text-emerald-700',
                            f.difficulty === 'intermediate' && 'bg-amber-100 text-amber-700',
                            f.difficulty === 'advanced' && 'bg-red-100 text-red-700',
                          )}>
                            {f.difficulty}
                          </span>
                          <span className="text-xs text-slate-400">Up to {f.maxSize}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Plants */}
            <div className="card">
              <h3 className="section-title mb-3">Plants ({plants.length})</h3>
              {plants.length === 0 ? (
                <p className="text-slate-400 text-sm">No plants in this tank.</p>
              ) : (
                <div className="space-y-2">
                  {plants.map((p) => p && (
                    <div key={p.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                      <span className="text-2xl">{p.emoji}</span>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{p.name}</p>
                        <p className="text-xs text-slate-400 italic">{p.scientificName}</p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          <span className={clsx(
                            'text-xs px-2 py-0.5 rounded-full font-medium',
                            p.difficulty === 'beginner' && 'bg-emerald-100 text-emerald-700',
                            p.difficulty === 'intermediate' && 'bg-amber-100 text-amber-700',
                            p.difficulty === 'advanced' && 'bg-red-100 text-red-700',
                          )}>
                            {p.difficulty}
                          </span>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                            {p.lightRequirement} light
                          </span>
                          {p.co2Required && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">CO₂</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Feeding */}
        {activeTab === 'feeding' && (
          <div className="space-y-4">
            {/* Schedules */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="section-title">Feeding Schedules ({feedingSchedules.length})</h3>
                <button onClick={() => setShowAddSchedule(!showAddSchedule)} className="btn-primary text-xs py-1.5">
                  <PlusIcon className="w-3.5 h-3.5" />
                  Add Schedule
                </button>
              </div>

              {showAddSchedule && (
                <form
                  className="bg-slate-50 rounded-xl p-4 mb-4 space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    addFeedingSchedule({ ...scheduleForm, tankId: tank.id });
                    setScheduleForm({ foodType: '', amount: '', timesPerDay: 2, notes: '' });
                    setShowAddSchedule(false);
                  }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Food Type *</label>
                      <input
                        required
                        type="text"
                        value={scheduleForm.foodType}
                        onChange={(e) => setScheduleForm((p) => ({ ...p, foodType: e.target.value }))}
                        placeholder="e.g. Flake, Pellet, Frozen"
                        className="input text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Amount</label>
                      <input
                        type="text"
                        value={scheduleForm.amount}
                        onChange={(e) => setScheduleForm((p) => ({ ...p, amount: e.target.value }))}
                        placeholder="e.g. A pinch"
                        className="input text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Times Per Day</label>
                      <input
                        type="number"
                        min={1}
                        max={6}
                        value={scheduleForm.timesPerDay}
                        onChange={(e) => setScheduleForm((p) => ({ ...p, timesPerDay: parseInt(e.target.value) || 1 }))}
                        className="input text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">Notes</label>
                      <input
                        type="text"
                        value={scheduleForm.notes}
                        onChange={(e) => setScheduleForm((p) => ({ ...p, notes: e.target.value }))}
                        placeholder="Optional"
                        className="input text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary text-sm">Add Schedule</button>
                    <button type="button" onClick={() => setShowAddSchedule(false)} className="btn-secondary text-sm">Cancel</button>
                  </div>
                </form>
              )}

              {feedingSchedules.length === 0 ? (
                <p className="text-slate-400 text-sm">No feeding schedules set up.</p>
              ) : (
                <div className="space-y-2">
                  {feedingSchedules.map((s) => (
                    <div key={s.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <span className="text-xl">🍽️</span>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">{s.foodType}</p>
                        <p className="text-xs text-slate-500">
                          {s.amount && `${s.amount} · `}
                          {s.timesPerDay}× per day
                          {s.notes && ` · ${s.notes}`}
                        </p>
                      </div>
                      <button
                        onClick={() => logFeeding({
                          tankId: tank.id,
                          timestamp: new Date().toISOString(),
                          foodType: s.foodType,
                          amount: s.amount,
                          notes: '',
                        })}
                        className="text-xs bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0"
                      >
                        Log Fed
                      </button>
                      <button
                        onClick={() => deleteFeedingSchedule(s.id)}
                        className="text-slate-300 hover:text-red-400 transition-colors p-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick log */}
            <div className="card">
              <h3 className="section-title mb-3">Quick Log Feeding</h3>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  const foodType = fd.get('foodType') as string;
                  if (!foodType.trim()) return;
                  logFeeding({
                    tankId: tank.id,
                    timestamp: new Date().toISOString(),
                    foodType,
                    amount: fd.get('amount') as string || '',
                    notes: '',
                  });
                  (e.target as HTMLFormElement).reset();
                }}
              >
                <input name="foodType" type="text" placeholder="Food type" className="input text-sm flex-1" required />
                <input name="amount" type="text" placeholder="Amount" className="input text-sm w-24" />
                <button type="submit" className="btn-primary text-sm shrink-0">Log</button>
              </form>
            </div>

            {/* Feeding history */}
            {feedingLogs.length > 0 && (
              <div className="card p-0 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h3 className="section-title">Feeding History</h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {feedingLogs.slice(0, 20).map((log) => (
                    <div key={log.id} className="flex items-center gap-3 px-5 py-3">
                      <span className="text-base">🍽️</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">{log.foodType}</p>
                        {log.amount && <p className="text-xs text-slate-400">{log.amount}</p>}
                      </div>
                      <p className="text-xs text-slate-400 shrink-0">
                        {format(parseISO(log.timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Journal */}
        {activeTab === 'journal' && (
          <div className="space-y-4">
            {/* New entry form */}
            <div className="card space-y-3">
              <h3 className="section-title">New Entry</h3>
              <div className="flex gap-2">
                {([
                  { mood: 'great' as JournalMood, emoji: '🌟', label: 'Great' },
                  { mood: 'good' as JournalMood, emoji: '😊', label: 'Good' },
                  { mood: 'okay' as JournalMood, emoji: '😐', label: 'Okay' },
                  { mood: 'concern' as JournalMood, emoji: '⚠️', label: 'Concern' },
                ]).map(({ mood, emoji, label }) => (
                  <button
                    key={mood}
                    onClick={() => setJournalForm((f) => ({ ...f, mood }))}
                    className={clsx(
                      'flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl border text-xs font-medium transition-all',
                      journalForm.mood === mood
                        ? 'border-ocean-400 bg-ocean-50 text-ocean-700'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    )}
                  >
                    <span className="text-lg">{emoji}</span>
                    {label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="Title (optional)"
                value={journalForm.title}
                onChange={(e) => setJournalForm((f) => ({ ...f, title: e.target.value }))}
                className="input text-sm"
              />
              <textarea
                placeholder="What's happening with your tank today?"
                value={journalForm.content}
                onChange={(e) => setJournalForm((f) => ({ ...f, content: e.target.value }))}
                rows={3}
                className="input text-sm resize-none"
              />
              <button
                onClick={() => {
                  if (!journalForm.content.trim()) return;
                  addJournalEntry({
                    tankId: tank.id,
                    timestamp: new Date().toISOString(),
                    title: journalForm.title,
                    content: journalForm.content,
                    mood: journalForm.mood,
                  });
                  setJournalForm({ title: '', content: '', mood: 'good' });
                }}
                disabled={!journalForm.content.trim()}
                className="btn-primary text-sm self-end disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save Entry
              </button>
            </div>

            {/* Entries */}
            {journalEntries.length === 0 ? (
              <div className="card text-center py-10">
                <p className="text-3xl mb-2">📓</p>
                <p className="text-slate-500 text-sm">No journal entries yet.</p>
                <p className="text-slate-400 text-xs mt-1">Document your tank's journey — observations, milestones, and changes.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {journalEntries.map((entry) => {
                  const moodEmoji = { great: '🌟', good: '😊', okay: '😐', concern: '⚠️' }[entry.mood];
                  const moodBg = { great: 'bg-yellow-50 border-yellow-200', good: 'bg-emerald-50 border-emerald-200', okay: 'bg-slate-50 border-slate-200', concern: 'bg-amber-50 border-amber-200' }[entry.mood];
                  return (
                    <div key={entry.id} className={`border rounded-xl p-4 ${moodBg}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{moodEmoji}</span>
                          <div>
                            {entry.title && <p className="font-semibold text-slate-800 text-sm">{entry.title}</p>}
                            <p className="text-xs text-slate-400">{format(parseISO(entry.timestamp), 'MMM d, yyyy · h:mm a')}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteJournalEntry(entry.id)}
                          className="text-slate-300 hover:text-red-400 transition-colors shrink-0"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-700 mt-2 whitespace-pre-wrap">{entry.content}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
