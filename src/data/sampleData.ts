import { Tank, WaterReading, MaintenanceTask } from '../types';
import { subDays, formatISO, addDays } from 'date-fns';

const now = new Date();

export const SAMPLE_TANKS: Tank[] = [
  {
    id: 'tank-1',
    name: 'Tropical Community',
    type: 'freshwater',
    volume: 29,
    volumeUnit: 'gallons',
    description: 'A vibrant community tank with tetras, corydoras, and live plants.',
    setupDate: formatISO(subDays(now, 120)),
    fishIds: ['neon-tetra', 'corydoras', 'guppy'],
    plantIds: ['java-fern', 'amazon-sword', 'java-moss'],
    emoji: '🐠',
  },
  {
    id: 'tank-2',
    name: 'Reef Corner',
    type: 'reef',
    volume: 40,
    volumeUnit: 'gallons',
    description: 'A thriving mini reef with SPS and LPS corals.',
    setupDate: formatISO(subDays(now, 60)),
    fishIds: ['clownfish', 'royal-gramma', 'firefish-goby'],
    plantIds: [],
    emoji: '🪸',
  },
  {
    id: 'tank-3',
    name: "Betta's Palace",
    type: 'planted',
    volume: 10,
    volumeUnit: 'gallons',
    description: 'A lush planted nano tank for a beautiful betta fish.',
    setupDate: formatISO(subDays(now, 45)),
    fishIds: ['betta', 'corydoras'],
    plantIds: ['anubias', 'java-moss', 'cryptocoryne', 'frogbit'],
    emoji: '🐡',
  },
];

function makeReadings(
  tankId: string,
  baseValues: Record<string, number>,
  count: number
): WaterReading[] {
  const readings: WaterReading[] = [];
  for (let i = count; i >= 0; i--) {
    const jitter = (base: number, pct: number) =>
      parseFloat((base + (Math.random() - 0.5) * 2 * base * pct).toFixed(3));

    const reading: WaterReading = {
      id: `reading-${tankId}-${i}`,
      tankId,
      timestamp: formatISO(subDays(now, i * 3)),
    };

    for (const [key, val] of Object.entries(baseValues)) {
      (reading as unknown as Record<string, unknown>)[key] = jitter(val, 0.04);
    }

    readings.push(reading);
  }
  return readings;
}

export const SAMPLE_READINGS: WaterReading[] = [
  ...makeReadings('tank-1', { ph: 7.0, ammonia: 0.0, nitrite: 0.0, nitrate: 10, temperature: 78 }, 14),
  ...makeReadings('tank-2', { ph: 8.2, ammonia: 0.0, nitrite: 0.0, nitrate: 2, temperature: 78, salinity: 1.025 }, 14),
  ...makeReadings('tank-3', { ph: 6.8, ammonia: 0.0, nitrite: 0.0, nitrate: 8, temperature: 79 }, 14),
];

export const SAMPLE_TASKS: MaintenanceTask[] = [
  {
    id: 'task-1',
    tankId: 'tank-1',
    taskType: 'water_change',
    title: '25% Water Change',
    description: 'Replace 25% of water with dechlorinated water at the same temperature.',
    frequencyDays: 7,
    lastCompleted: formatISO(subDays(now, 5)),
    nextDue: formatISO(addDays(now, 2)),
  },
  {
    id: 'task-2',
    tankId: 'tank-1',
    taskType: 'filter_clean',
    title: 'Filter Media Rinse',
    description: 'Rinse mechanical filter media in old tank water.',
    frequencyDays: 30,
    lastCompleted: formatISO(subDays(now, 20)),
    nextDue: formatISO(addDays(now, 10)),
  },
  {
    id: 'task-3',
    tankId: 'tank-1',
    taskType: 'parameter_test',
    title: 'Full Parameter Test',
    description: 'Test pH, ammonia, nitrite, nitrate, and temperature.',
    frequencyDays: 7,
    lastCompleted: formatISO(subDays(now, 2)),
    nextDue: formatISO(addDays(now, 5)),
  },
  {
    id: 'task-4',
    tankId: 'tank-2',
    taskType: 'water_change',
    title: '10% Water Change',
    description: 'Replace 10% with RODI water mixed to correct salinity.',
    frequencyDays: 3,
    lastCompleted: formatISO(subDays(now, 1)),
    nextDue: formatISO(addDays(now, 2)),
  },
  {
    id: 'task-5',
    tankId: 'tank-2',
    taskType: 'parameter_test',
    title: 'Saltwater Parameter Test',
    description: 'Test salinity, pH, ammonia, nitrite, nitrate, and phosphate.',
    frequencyDays: 7,
    lastCompleted: formatISO(subDays(now, 3)),
    nextDue: formatISO(addDays(now, 4)),
  },
  {
    id: 'task-6',
    tankId: 'tank-3',
    taskType: 'water_change',
    title: '20% Water Change',
    description: 'Replace 20% with dechlorinated, temperature-matched water.',
    frequencyDays: 7,
    lastCompleted: formatISO(subDays(now, 4)),
    nextDue: formatISO(addDays(now, 3)),
  },
  {
    id: 'task-7',
    tankId: 'tank-1',
    taskType: 'feeding',
    title: 'Feed Community Fish',
    description: 'Feed a small amount of flake and sinking pellets twice daily.',
    frequencyDays: 1,
    lastCompleted: formatISO(subDays(now, 0)),
    nextDue: formatISO(addDays(now, 1)),
  },
  {
    id: 'task-8',
    tankId: 'tank-3',
    taskType: 'feeding',
    title: 'Feed Betta',
    description: 'Feed betta pellets and occasional bloodworms. Skip one day per week.',
    frequencyDays: 1,
    lastCompleted: formatISO(subDays(now, 0)),
    nextDue: formatISO(addDays(now, 1)),
  },
];
