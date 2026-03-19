export type TankType = 'freshwater' | 'saltwater' | 'brackish' | 'planted' | 'reef';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type AlertSeverity = 'warning' | 'critical';
export type TaskType =
  | 'water_change'
  | 'filter_clean'
  | 'feeding'
  | 'parameter_test'
  | 'gravel_vacuum'
  | 'glass_clean'
  | 'custom';
export type LightRequirement = 'low' | 'medium' | 'high';
export type GrowthRate = 'slow' | 'medium' | 'fast';
export type PlantPlacement = 'foreground' | 'midground' | 'background' | 'floating';

export interface Tank {
  id: string;
  name: string;
  type: TankType;
  volume: number;
  volumeUnit: 'gallons' | 'liters';
  description: string;
  setupDate: string;
  fishIds: string[];
  plantIds: string[];
  emoji: string;
}

export interface WaterReading {
  id: string;
  tankId: string;
  timestamp: string;
  ph?: number;
  ammonia?: number;
  nitrite?: number;
  nitrate?: number;
  temperature?: number;
  salinity?: number;
  gh?: number;
  kh?: number;
  phosphate?: number;
  dissolvedOxygen?: number;
  notes?: string;
}

export interface MaintenanceTask {
  id: string;
  tankId: string;
  taskType: TaskType;
  title: string;
  description: string;
  frequencyDays: number;
  lastCompleted?: string;
  nextDue: string;
}

export interface Fish {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  tankType: TankType[];
  difficulty: Difficulty;
  minTankSize: number;
  temperatureRange: [number, number];
  phRange: [number, number];
  compatibleWith: string[];
  incompatibleWith: string[];
  description: string;
  careNotes: string;
  maxSize: string;
  lifespan: string;
  emoji: string;
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  difficulty: Difficulty;
  lightRequirement: LightRequirement;
  co2Required: boolean;
  growthRate: GrowthRate;
  placement: PlantPlacement;
  temperatureRange: [number, number];
  phRange: [number, number];
  description: string;
  careNotes: string;
  emoji: string;
}

export interface AppAlert {
  id: string;
  tankId: string;
  tankName: string;
  parameter: string;
  severity: AlertSeverity;
  message: string;
  value: number;
  unit: string;
  timestamp: string;
  dismissed: boolean;
}

export interface ParameterRange {
  min: number;
  max: number;
  unit: string;
  name: string;
  criticalMin?: number;
  criticalMax?: number;
}

export type ParameterRangeMap = Record<string, ParameterRange>;
