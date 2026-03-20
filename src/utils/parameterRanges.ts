import { ParameterRangeMap, TankType } from '../types';

export const FRESHWATER_RANGES: ParameterRangeMap = {
  ph: { min: 6.5, max: 7.5, criticalMin: 6.0, criticalMax: 8.0, unit: '', name: 'pH' },
  ammonia: { min: 0, max: 0.25, criticalMax: 1.0, unit: 'ppm', name: 'Ammonia' },
  nitrite: { min: 0, max: 0.25, criticalMax: 1.0, unit: 'ppm', name: 'Nitrite' },
  nitrate: { min: 0, max: 20, criticalMax: 40, unit: 'ppm', name: 'Nitrate' },
  temperature: { min: 72, max: 82, criticalMin: 65, criticalMax: 88, unit: '°F', name: 'Temperature' },
  gh: { min: 4, max: 12, unit: 'dGH', name: 'Hardness (GH)' },
  kh: { min: 4, max: 8, unit: 'dKH', name: 'Alkalinity (KH)' },
  phosphate: { min: 0, max: 0.5, criticalMax: 2.0, unit: 'ppm', name: 'Phosphate' },
  dissolvedOxygen: { min: 6, max: 14, criticalMin: 4, unit: 'mg/L', name: 'Dissolved O₂' },
};

export const SALTWATER_RANGES: ParameterRangeMap = {
  ph: { min: 8.1, max: 8.4, criticalMin: 7.8, criticalMax: 8.6, unit: '', name: 'pH' },
  ammonia: { min: 0, max: 0.02, criticalMax: 0.1, unit: 'ppm', name: 'Ammonia' },
  nitrite: { min: 0, max: 0.1, criticalMax: 0.5, unit: 'ppm', name: 'Nitrite' },
  nitrate: { min: 0, max: 5, criticalMax: 20, unit: 'ppm', name: 'Nitrate' },
  temperature: { min: 75, max: 80, criticalMin: 72, criticalMax: 84, unit: '°F', name: 'Temperature' },
  salinity: { min: 1.023, max: 1.026, criticalMin: 1.020, criticalMax: 1.028, unit: 'SG', name: 'Salinity' },
  phosphate: { min: 0, max: 0.05, criticalMax: 0.25, unit: 'ppm', name: 'Phosphate' },
  calcium: { min: 380, max: 450, criticalMin: 350, criticalMax: 480, unit: 'ppm', name: 'Calcium' },
  magnesium: { min: 1250, max: 1350, criticalMin: 1100, criticalMax: 1450, unit: 'ppm', name: 'Magnesium' },
  dissolvedOxygen: { min: 6, max: 14, criticalMin: 4, unit: 'mg/L', name: 'Dissolved O₂' },
};

export const REEF_RANGES: ParameterRangeMap = {
  ph: { min: 8.1, max: 8.4, criticalMin: 7.8, criticalMax: 8.6, unit: '', name: 'pH' },
  ammonia: { min: 0, max: 0.02, criticalMax: 0.05, unit: 'ppm', name: 'Ammonia' },
  nitrite: { min: 0, max: 0.05, criticalMax: 0.2, unit: 'ppm', name: 'Nitrite' },
  nitrate: { min: 0, max: 2, criticalMax: 10, unit: 'ppm', name: 'Nitrate' },
  temperature: { min: 76, max: 80, criticalMin: 74, criticalMax: 83, unit: '°F', name: 'Temperature' },
  salinity: { min: 1.025, max: 1.026, criticalMin: 1.023, criticalMax: 1.028, unit: 'SG', name: 'Salinity' },
  phosphate: { min: 0, max: 0.03, criticalMax: 0.1, unit: 'ppm', name: 'Phosphate' },
  calcium: { min: 400, max: 450, criticalMin: 350, criticalMax: 480, unit: 'ppm', name: 'Calcium' },
  magnesium: { min: 1280, max: 1350, criticalMin: 1150, criticalMax: 1450, unit: 'ppm', name: 'Magnesium' },
  kh: { min: 8, max: 12, criticalMin: 6, criticalMax: 14, unit: 'dKH', name: 'Alkalinity (dKH)' },
};

export const PLANTED_RANGES: ParameterRangeMap = {
  ph: { min: 6.5, max: 7.2, criticalMin: 5.5, criticalMax: 8.0, unit: '', name: 'pH' },
  ammonia: { min: 0, max: 0.25, criticalMax: 1.0, unit: 'ppm', name: 'Ammonia' },
  nitrite: { min: 0, max: 0.25, criticalMax: 1.0, unit: 'ppm', name: 'Nitrite' },
  nitrate: { min: 5, max: 30, criticalMax: 50, unit: 'ppm', name: 'Nitrate' },
  temperature: { min: 72, max: 82, criticalMin: 65, criticalMax: 88, unit: '°F', name: 'Temperature' },
  gh: { min: 3, max: 10, unit: 'dGH', name: 'Hardness (GH)' },
  kh: { min: 2, max: 6, unit: 'dKH', name: 'Alkalinity (KH)' },
  phosphate: { min: 0.5, max: 2.0, unit: 'ppm', name: 'Phosphate' },
};

export const BRACKISH_RANGES: ParameterRangeMap = {
  ph: { min: 7.5, max: 8.5, criticalMin: 7.0, criticalMax: 9.0, unit: '', name: 'pH' },
  ammonia: { min: 0, max: 0.25, criticalMax: 1.0, unit: 'ppm', name: 'Ammonia' },
  nitrite: { min: 0, max: 0.25, criticalMax: 1.0, unit: 'ppm', name: 'Nitrite' },
  nitrate: { min: 0, max: 20, criticalMax: 40, unit: 'ppm', name: 'Nitrate' },
  temperature: { min: 74, max: 82, criticalMin: 68, criticalMax: 86, unit: '°F', name: 'Temperature' },
  salinity: { min: 1.005, max: 1.015, criticalMin: 1.002, criticalMax: 1.020, unit: 'SG', name: 'Salinity' },
};

export function getRangesForTankType(tankType: TankType): ParameterRangeMap {
  switch (tankType) {
    case 'saltwater': return SALTWATER_RANGES;
    case 'reef': return REEF_RANGES;
    case 'planted': return PLANTED_RANGES;
    case 'brackish': return BRACKISH_RANGES;
    default: return FRESHWATER_RANGES;
  }
}

export type ParameterStatus = 'safe' | 'warning' | 'critical' | 'unknown';

export function getParameterStatus(
  param: string,
  value: number,
  tankType: TankType
): ParameterStatus {
  const ranges = getRangesForTankType(tankType);
  const range = ranges[param];
  if (!range) return 'unknown';

  if (
    (range.criticalMin !== undefined && value < range.criticalMin) ||
    (range.criticalMax !== undefined && value > range.criticalMax)
  ) {
    return 'critical';
  }
  if (value < range.min || value > range.max) {
    return 'warning';
  }
  return 'safe';
}

export function calculateTankHealthScore(
  readings: Partial<Record<string, number>>,
  tankType: TankType
): number {
  const ranges = getRangesForTankType(tankType);
  const params = Object.keys(readings).filter(
    (k) => readings[k] !== undefined && ranges[k]
  );

  if (params.length === 0) return 0;

  let score = 100;
  for (const param of params) {
    const value = readings[param] as number;
    const status = getParameterStatus(param, value, tankType);
    if (status === 'critical') score -= 20;
    else if (status === 'warning') score -= 8;
  }
  return Math.max(0, Math.min(100, score));
}

export const PARAMETER_LABELS: Record<string, string> = {
  ph: 'pH',
  ammonia: 'Ammonia',
  nitrite: 'Nitrite',
  nitrate: 'Nitrate',
  temperature: 'Temperature',
  salinity: 'Salinity',
  gh: 'Hardness (GH)',
  kh: 'Alkalinity (KH)',
  phosphate: 'Phosphate',
  dissolvedOxygen: 'Dissolved O₂',
  calcium: 'Calcium',
  magnesium: 'Magnesium',
};

export const PARAMETER_UNITS: Record<string, string> = {
  ph: '',
  ammonia: 'ppm',
  nitrite: 'ppm',
  nitrate: 'ppm',
  temperature: '°F',
  salinity: 'SG',
  gh: 'dGH',
  kh: 'dKH',
  phosphate: 'ppm',
  dissolvedOxygen: 'mg/L',
  calcium: 'ppm',
  magnesium: 'ppm',
};
