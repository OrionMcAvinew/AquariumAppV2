import { Link } from 'react-router-dom';
import { Tank, WaterReading } from '../types';
import { calculateTankHealthScore, getParameterStatus, PARAMETER_LABELS, PARAMETER_UNITS } from '../utils/parameterRanges';
import { format, parseISO } from 'date-fns';
import HealthScore from './HealthScore';
import clsx from 'clsx';

interface Props {
  tank: Tank;
  latestReading?: WaterReading;
}

function getTankGradientClass(type: Tank['type']) {
  const map: Record<Tank['type'], string> = {
    freshwater: 'tank-gradient-freshwater',
    saltwater: 'tank-gradient-saltwater',
    reef: 'tank-gradient-reef',
    planted: 'tank-gradient-planted',
    brackish: 'tank-gradient-brackish',
  };
  return map[type] || 'tank-gradient-freshwater';
}

const KEY_PARAMS = ['ph', 'ammonia', 'nitrite', 'nitrate', 'temperature'] as const;

export default function TankCard({ tank, latestReading }: Props) {
  const readingValues: Partial<Record<string, number>> = latestReading
    ? {
        ph: latestReading.ph,
        ammonia: latestReading.ammonia,
        nitrite: latestReading.nitrite,
        nitrate: latestReading.nitrate,
        temperature: latestReading.temperature,
        salinity: latestReading.salinity,
      }
    : {};

  const healthScore = latestReading
    ? calculateTankHealthScore(readingValues as Record<string, number>, tank.type)
    : 0;

  const typeLabel = tank.type.charAt(0).toUpperCase() + tank.type.slice(1);

  return (
    <Link to={`/tanks/${tank.id}`} className="block group">
      <div className="card p-0 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        {/* Header gradient */}
        <div className={clsx('relative p-5 text-white', getTankGradientClass(tank.type))}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{tank.emoji}</span>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{tank.name}</h3>
                  <p className="text-white/70 text-xs font-medium uppercase tracking-wide">{typeLabel} · {tank.volume} {tank.volumeUnit}</p>
                </div>
              </div>
            </div>
            {latestReading ? (
              <HealthScore score={healthScore} size="sm" />
            ) : (
              <span className="text-white/60 text-xs">No data</span>
            )}
          </div>
        </div>

        {/* Parameter readings */}
        <div className="p-4">
          {latestReading ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                {KEY_PARAMS.map((param) => {
                  const value = latestReading[param];
                  if (value === undefined) return null;
                  const status = getParameterStatus(param, value, tank.type);
                  const unit = PARAMETER_UNITS[param] || '';
                  const label = PARAMETER_LABELS[param] || param;
                  return (
                    <div key={param} className="bg-slate-50 rounded-lg p-2">
                      <p className="text-xs text-slate-500 font-medium">{label}</p>
                      <p className={clsx(
                        'text-sm font-bold',
                        status === 'safe' && 'text-emerald-600',
                        status === 'warning' && 'text-amber-600',
                        status === 'critical' && 'text-red-600',
                        status === 'unknown' && 'text-slate-600',
                      )}>
                        {value.toFixed((['ph', 'salinity'] as string[]).includes(param) ? 2 : 1)}{unit}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400">
                Last tested {format(parseISO(latestReading.timestamp), 'MMM d, h:mm a')}
              </p>
            </>
          ) : (
            <div className="text-center py-3">
              <p className="text-sm text-slate-400">No readings yet</p>
              <p className="text-xs text-slate-300 mt-1">Tap to log your first reading</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
