import { useState } from 'react';
import { useStore } from '../store';
import ParameterChart from '../components/ParameterChart';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { WaterReading } from '../types';
import { subDays, parseISO } from 'date-fns';
import { PARAMETER_LABELS, PARAMETER_UNITS } from '../utils/parameterRanges';
import clsx from 'clsx';

type ParamKey = keyof Omit<WaterReading, 'id' | 'tankId' | 'timestamp' | 'notes'>;

const PARAM_KEYS: ParamKey[] = [
  'ph', 'ammonia', 'nitrite', 'nitrate', 'temperature',
  'salinity', 'gh', 'kh', 'phosphate', 'dissolvedOxygen', 'calcium', 'magnesium',
];

const TIME_RANGES = [
  { label: '7 days', days: 7 },
  { label: '14 days', days: 14 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
  { label: 'All time', days: 9999 },
];

export default function Analytics() {
  const tanks = useStore((s) => s.tanks);
  const getTankReadings = useStore((s) => s.getTankReadings);
  const [selectedTankId, setSelectedTankId] = useState(tanks[0]?.id || '');
  const [timeRange, setTimeRange] = useState(30);

  const tank = tanks.find((t) => t.id === selectedTankId);
  const allReadings = tank ? getTankReadings(tank.id) : [];

  const cutoff = subDays(new Date(), timeRange);
  const readings = allReadings.filter((r) => {
    if (timeRange >= 9999) return true;
    return parseISO(r.timestamp) >= cutoff;
  });

  const availableParams = PARAM_KEYS.filter((k) =>
    readings.some((r) => r[k] !== undefined && r[k] !== null)
  );

  // Calculate averages for stats
  const stats = availableParams.map((param) => {
    const values = readings
      .map((r) => r[param] as number | undefined)
      .filter((v): v is number => v !== undefined);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { param, avg, min, max, count: values.length };
  });

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
            <ChartBarIcon className="w-5 h-5 text-ocean-400" />
            <h1 className="text-white text-2xl font-bold tracking-tight">Analytics</h1>
          </div>
          <p className="text-slate-400 text-sm mb-5">Parameter trends and statistics across your tanks</p>

          {/* Controls inside hero */}
          {tanks.length > 0 && (
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedTankId}
                onChange={(e) => setSelectedTankId(e.target.value)}
                className="flex-1 min-w-[160px] bg-white/10 border border-white/20 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-400 backdrop-blur-sm"
              >
                {tanks.map((t) => (
                  <option key={t.id} value={t.id} className="text-slate-900 bg-white">{t.emoji} {t.name}</option>
                ))}
              </select>

              <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
                {TIME_RANGES.map(({ label, days }) => (
                  <button
                    key={days}
                    onClick={() => setTimeRange(days)}
                    className={clsx(
                      'text-xs font-semibold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap',
                      timeRange === days
                        ? 'bg-white text-ocean-700 shadow'
                        : 'text-white/60 hover:text-white/90 hover:bg-white/10'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="px-6 py-5 max-w-4xl mx-auto">
        {tanks.length === 0 ? (
          <div className="card text-center py-12">
            <ChartBarIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400">No tanks found. Add a tank to see analytics.</p>
          </div>
        ) : readings.length === 0 ? (
          <div className="card text-center py-12">
            <ChartBarIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No readings in this time period.</p>
            <p className="text-slate-300 text-sm mt-1">Log some water parameters to see charts.</p>
          </div>
        ) : (
          <>
            {/* Summary stat cards */}
            {stats.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="section-title">Summary</h3>
                  <span className="text-xs text-slate-400 font-medium">{readings.length} readings</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {stats.map(({ param, avg, min, max }) => {
                    const label = PARAMETER_LABELS[param as string] || String(param);
                    const unit  = PARAMETER_UNITS[param as string]  || '';
                    return (
                      <div key={param} className="card py-3 px-3">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                        <p className="text-lg font-bold text-slate-900 leading-none mb-2">
                          {avg.toFixed(2).replace(/\.?0+$/, '')}
                          <span className="text-xs text-slate-400 font-normal ml-0.5">{unit}</span>
                        </p>
                        <div className="flex gap-2 text-[11px]">
                          <span className="text-slate-400">↓{min.toFixed(1)}</span>
                          <span className="text-slate-400">↑{max.toFixed(1)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Charts */}
            {tank && (
              <div className="space-y-4">
                {availableParams.map((param) => (
                  <div key={param} className="card">
                    <ParameterChart readings={readings} parameter={param} tankType={tank.type} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
