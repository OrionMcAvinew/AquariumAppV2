import { useState } from 'react';
import { useStore } from '../store';
import ParameterChart from '../components/ParameterChart';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { WaterReading } from '../types';
import { subDays, parseISO } from 'date-fns';
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
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <ChartBarIcon className="w-6 h-6 text-ocean-500" />
          <h1 className="page-title">Analytics</h1>
        </div>
        <p className="text-slate-500 text-sm">Parameter trends and statistics</p>
      </div>

      {tanks.length === 0 ? (
        <div className="card text-center py-12">
          <ChartBarIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400">No tanks found. Add a tank to see analytics.</p>
        </div>
      ) : (
        <>
          {/* Controls */}
          <div className="flex flex-wrap gap-3 mb-5">
            <select
              value={selectedTankId}
              onChange={(e) => setSelectedTankId(e.target.value)}
              className="input-field w-auto flex-1"
            >
              {tanks.map((t) => (
                <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
              ))}
            </select>

            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {TIME_RANGES.map(({ label, days }) => (
                <button
                  key={days}
                  onClick={() => setTimeRange(days)}
                  className={clsx(
                    'text-xs font-semibold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap',
                    timeRange === days
                      ? 'bg-white text-ocean-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {readings.length === 0 ? (
            <div className="card text-center py-12">
              <ChartBarIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No readings in this time period.</p>
              <p className="text-slate-300 text-sm mt-1">Log some water parameters to see charts.</p>
            </div>
          ) : (
            <>
              {/* Summary stats */}
              {stats.length > 0 && (
                <div className="card mb-5">
                  <h3 className="section-title mb-3">Summary ({readings.length} readings)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 rounded-xl">
                          <th className="text-left px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Parameter</th>
                          <th className="text-right px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Avg</th>
                          <th className="text-right px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Min</th>
                          <th className="text-right px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Max</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {stats.map(({ param, avg, min, max }) => (
                          <tr key={param} className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-medium text-slate-700 capitalize">{param}</td>
                            <td className="px-3 py-2 text-right text-slate-600 font-mono">{avg.toFixed(3).replace(/\.?0+$/, '')}</td>
                            <td className="px-3 py-2 text-right text-slate-600 font-mono">{min.toFixed(3).replace(/\.?0+$/, '')}</td>
                            <td className="px-3 py-2 text-right text-slate-600 font-mono">{max.toFixed(3).replace(/\.?0+$/, '')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Charts */}
              {tank && (
                <div className="space-y-4">
                  {availableParams.map((param) => (
                    <div key={param} className="card">
                      <ParameterChart
                        readings={readings}
                        parameter={param}
                        tankType={tank.type}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
