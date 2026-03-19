import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { WaterReading, TankType } from '../types';
import { getRangesForTankType, PARAMETER_LABELS, PARAMETER_UNITS } from '../utils/parameterRanges';
import { format, parseISO } from 'date-fns';

interface Props {
  readings: WaterReading[];
  parameter: keyof Omit<WaterReading, 'id' | 'tankId' | 'timestamp' | 'notes'>;
  tankType: TankType;
  color?: string;
}

const COLORS: Record<string, string> = {
  ph: '#0ea5e9',
  ammonia: '#f59e0b',
  nitrite: '#ef4444',
  nitrate: '#f97316',
  temperature: '#8b5cf6',
  salinity: '#06b6d4',
  gh: '#10b981',
  kh: '#14b8a6',
  phosphate: '#ec4899',
  dissolvedOxygen: '#22c55e',
};

export default function ParameterChart({ readings, parameter, tankType, color }: Props) {
  const ranges = getRangesForTankType(tankType);
  const range = ranges[parameter as string];
  const label = PARAMETER_LABELS[parameter as string] || String(parameter);
  const unit = PARAMETER_UNITS[parameter as string] || '';
  const lineColor = color || COLORS[parameter as string] || '#0ea5e9';

  const data = [...readings]
    .sort((a, b) => parseISO(a.timestamp).getTime() - parseISO(b.timestamp).getTime())
    .filter((r) => r[parameter] !== undefined && r[parameter] !== null)
    .map((r) => ({
      date: format(parseISO(r.timestamp), 'MMM d'),
      value: Number(r[parameter]),
      fullDate: r.timestamp,
    }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
        No data for {label}
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label: xLabel }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      let statusColor = '#22c55e';
      if (range) {
        if (val < range.min || val > range.max) {
          statusColor =
            (range.criticalMin !== undefined && val < range.criticalMin) ||
            (range.criticalMax !== undefined && val > range.criticalMax)
              ? '#ef4444'
              : '#f59e0b';
        }
      }
      return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2">
          <p className="text-xs text-slate-500 font-medium">{xLabel}</p>
          <p className="text-sm font-bold" style={{ color: statusColor }}>
            {val.toFixed(3).replace(/\.?0+$/, '')} {unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-700">{label}</h4>
        {range && (
          <span className="text-xs text-slate-400">
            Safe: {range.min}–{range.max} {unit}
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          {range && (
            <>
              <ReferenceLine y={range.min} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} />
              <ReferenceLine y={range.max} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} />
            </>
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            dot={{ fill: lineColor, r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
