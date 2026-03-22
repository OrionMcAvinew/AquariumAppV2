import { Link } from 'react-router-dom';
import { Tank, WaterReading } from '../types';
import { calculateTankHealthScore, getParameterStatus, PARAMETER_LABELS, PARAMETER_UNITS } from '../utils/parameterRanges';
import { format, parseISO } from 'date-fns';
import HealthScore from './HealthScore';
import clsx from 'clsx';
import { PlusIcon } from '@heroicons/react/24/outline';

interface Props {
  tank: Tank;
  latestReading?: WaterReading;
}

function getTankGradientClass(type: Tank['type']) {
  const map: Record<Tank['type'], string> = {
    freshwater: 'tank-gradient-freshwater',
    saltwater:  'tank-gradient-saltwater',
    reef:       'tank-gradient-reef',
    planted:    'tank-gradient-planted',
    brackish:   'tank-gradient-brackish',
  };
  return map[type] || 'tank-gradient-freshwater';
}

const KEY_PARAMS = ['ph', 'ammonia', 'nitrite', 'nitrate', 'temperature'] as const;

export default function TankCard({ tank, latestReading }: Props) {
  const readingValues: Partial<Record<string, number>> = latestReading
    ? {
        ph:          latestReading.ph,
        ammonia:     latestReading.ammonia,
        nitrite:     latestReading.nitrite,
        nitrate:     latestReading.nitrate,
        temperature: latestReading.temperature,
        salinity:    latestReading.salinity,
      }
    : {};

  const healthScore = latestReading
    ? calculateTankHealthScore(readingValues as Record<string, number>, tank.type)
    : 0;

  const typeLabel = tank.type.charAt(0).toUpperCase() + tank.type.slice(1);

  return (
    <div className="group relative">
      <Link to={`/tanks/${tank.id}`} className="block">
        <div
          className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-200 hover:-translate-y-1"
          style={{
            boxShadow: '0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              '0 8px 24px rgba(0,0,0,.10), 0 2px 8px rgba(0,0,0,.06)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              '0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)';
          }}
        >
          {/* Header — photo or gradient */}
          <div className={clsx('relative p-5 text-white overflow-hidden', !tank.photoUrl && getTankGradientClass(tank.type))}>
            {tank.photoUrl && (
              <>
                <img
                  src={tank.photoUrl}
                  alt={tank.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20" />
              </>
            )}
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)' }}
            />
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl drop-shadow">{tank.emoji}</span>
                <div>
                  <h3 className="font-bold text-base leading-tight drop-shadow-sm">{tank.name}</h3>
                  <p className="text-white/70 text-xs font-medium uppercase tracking-wider mt-0.5">
                    {typeLabel} · {tank.volume} {tank.volumeUnit}
                  </p>
                </div>
              </div>
              {latestReading ? (
                <HealthScore score={healthScore} size="sm" />
              ) : (
                <span className="text-white/50 text-xs mt-1">No data</span>
              )}
            </div>
          </div>

          {/* Parameter readings */}
          <div className="p-4">
            {latestReading ? (
              <>
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {KEY_PARAMS.map((param) => {
                    const value = latestReading[param];
                    if (value === undefined) return null;
                    const status = getParameterStatus(param, value, tank.type);
                    const unit   = PARAMETER_UNITS[param] || '';
                    const label  = PARAMETER_LABELS[param] || param;
                    return (
                      <div key={param} className="rounded-xl p-2.5 bg-slate-50 border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide leading-none mb-1">{label}</p>
                        <p className={clsx(
                          'text-sm font-bold leading-none',
                          status === 'safe'     && 'text-emerald-600',
                          status === 'warning'  && 'text-amber-600',
                          status === 'critical' && 'text-red-600',
                          status === 'unknown'  && 'text-slate-600',
                        )}>
                          {value.toFixed((['ph', 'salinity'] as string[]).includes(param) ? 2 : 1)}
                          <span className="text-[9px] font-medium ml-0.5 opacity-70">{unit}</span>
                        </p>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400">
                  Last tested {format(parseISO(latestReading.timestamp), 'MMM d, h:mm a')}
                </p>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-slate-400 font-medium">No readings yet</p>
                <p className="text-xs text-slate-300 mt-1">Tap to log your first reading</p>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Quick-Log button */}
      <Link
        to={`/tanks/${tank.id}/log`}
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-3.5 right-3.5 flex items-center gap-1 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all z-10 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
        style={{
          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
          boxShadow: '0 2px 8px rgba(14,165,233,0.5)',
        }}
        title="Log water reading"
      >
        <PlusIcon className="w-3.5 h-3.5" />
        Log
      </Link>
    </div>
  );
}
