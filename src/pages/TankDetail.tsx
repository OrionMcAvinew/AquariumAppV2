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
  PencilSquareIcon,
  BeakerIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO, isPast } from 'date-fns';
import { WaterReading } from '../types';
import clsx from 'clsx';
import { useState } from 'react';

const PARAM_KEYS: Array<keyof Omit<WaterReading, 'id' | 'tankId' | 'timestamp' | 'notes'>> = [
  'ph', 'ammonia', 'nitrite', 'nitrate', 'temperature', 'salinity', 'gh', 'kh', 'phosphate', 'dissolvedOxygen',
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
  const [activeTab, setActiveTab] = useState<'overview' | 'charts' | 'tasks' | 'inhabitants'>('overview');

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
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {(['overview', 'charts', 'tasks', 'inhabitants'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'flex-1 text-sm font-semibold py-2 rounded-lg capitalize transition-all',
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

        {/* Tab: Inhabitants */}
        {activeTab === 'inhabitants' && (
          <div className="space-y-4">
            <div className="card">
              <h3 className="section-title mb-3">Fish ({fish.length})</h3>
              {fish.length === 0 ? (
                <p className="text-slate-400 text-sm">No fish added to this tank.</p>
              ) : (
                <div className="space-y-3">
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

            <div className="card">
              <h3 className="section-title mb-3">Plants ({plants.length})</h3>
              {plants.length === 0 ? (
                <p className="text-slate-400 text-sm">No plants added to this tank.</p>
              ) : (
                <div className="space-y-3">
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
      </div>
    </div>
  );
}
