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
export type LightRequirement = 'low' | 'medium' | 'high' | 'very-high';
export type GrowthRate = 'slow' | 'medium' | 'fast';
export type PlantPlacement = 'foreground' | 'midground' | 'background' | 'floating';
export type CoralType = 'soft' | 'lps' | 'sps';
export type FlowRequirement = 'low' | 'medium' | 'high';
export type InvertType = 'shrimp' | 'snail' | 'crab' | 'urchin' | 'starfish' | 'other';

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
  photoUrl?: string;
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
  calcium?: number;
  magnesium?: number;
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
  imageUrl?: string;
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
  imageUrl?: string;
}

export interface Coral {
  id: string;
  name: string;
  scientificName: string;
  coralType: CoralType;
  difficulty: Difficulty;
  lightRequirement: LightRequirement;
  flowRequirement: FlowRequirement;
  placement: 'bottom' | 'middle' | 'top';
  aggressiveness: 'peaceful' | 'semi-aggressive' | 'aggressive';
  description: string;
  careNotes: string;
  emoji: string;
  imageUrl?: string;
}

export interface Invertebrate {
  id: string;
  name: string;
  scientificName: string;
  invertType: InvertType;
  tankType: TankType[];
  difficulty: Difficulty;
  minTankSize: number;
  temperatureRange: [number, number];
  description: string;
  careNotes: string;
  cleaningRole?: string;
  emoji: string;
  imageUrl?: string;
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

// Individual fish living in a tank (distinct from Fish species in database)
export type FishHealthStatus = 'healthy' | 'sick' | 'quarantine' | 'deceased';

export interface FishInstance {
  id: string;
  tankId: string;
  speciesId: string; // references Fish.id from fishDatabase
  nickname: string;
  dateAdded: string;
  healthStatus: FishHealthStatus;
  notes: string;
}

// Feeding
export interface FeedingSchedule {
  id: string;
  tankId: string;
  foodType: string;
  amount: string;
  timesPerDay: number;
  notes: string;
}

export interface FeedingLog {
  id: string;
  tankId: string;
  timestamp: string;
  foodType: string;
  amount: string;
  notes: string;
}

// Equipment
export type EquipmentType =
  | 'filter'
  | 'heater'
  | 'light'
  | 'pump'
  | 'skimmer'
  | 'co2'
  | 'uv_sterilizer'
  | 'powerhead'
  | 'other';

export type EquipmentStatus = 'active' | 'inactive' | 'replaced';

export interface Equipment {
  id: string;
  tankId: string | null;
  name: string;
  type: EquipmentType;
  brand: string;
  model: string;
  purchaseDate: string;
  maintenanceFrequencyDays: number;
  lastMaintained: string | null;
  nextMaintenance: string | null;
  notes: string;
  status: EquipmentStatus;
}

// AI Chat
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Tank Journal
export type JournalMood = 'great' | 'good' | 'okay' | 'concern';

export interface JournalEntry {
  id: string;
  tankId: string;
  timestamp: string;
  title: string;
  content: string;
  mood: JournalMood;
}

// Wishlist
export type WishlistSpeciesType = 'fish' | 'plant' | 'coral' | 'invertebrate';

export interface WishlistItem {
  id: string;
  speciesId: string;
  speciesType: WishlistSpeciesType;
  addedAt: string;
  notes: string;
}
