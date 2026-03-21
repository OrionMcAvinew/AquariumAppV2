import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { addDays, formatISO, parseISO } from 'date-fns';
import {
  Tank, WaterReading, MaintenanceTask, AppAlert,
  FishInstance, FeedingSchedule, FeedingLog, Equipment,
  JournalEntry, WishlistItem,
} from '../types';
import { SAMPLE_TANKS, SAMPLE_READINGS, SAMPLE_TASKS } from '../data/sampleData';
import { getRangesForTankType, getParameterStatus, PARAMETER_LABELS, PARAMETER_UNITS } from '../utils/parameterRanges';

interface AppState {
  tanks: Tank[];
  waterReadings: WaterReading[];
  maintenanceTasks: MaintenanceTask[];
  alerts: AppAlert[];
  seeded: boolean;

  // New state
  fishInstances: FishInstance[];
  feedingSchedules: FeedingSchedule[];
  feedingLogs: FeedingLog[];
  equipment: Equipment[];
  anthropicApiKey: string;

  // Tank actions
  addTank: (tank: Omit<Tank, 'id'>) => string;
  updateTank: (id: string, updates: Partial<Tank>) => void;
  updateTankPhoto: (id: string, photoUrl: string | undefined) => void;
  deleteTank: (id: string) => void;

  // Reading actions
  addReading: (reading: Omit<WaterReading, 'id'>) => void;
  deleteReading: (id: string) => void;

  // Task actions
  addTask: (task: Omit<MaintenanceTask, 'id'>) => void;
  updateTask: (id: string, updates: Partial<MaintenanceTask>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;

  // Alert actions
  dismissAlert: (id: string) => void;
  generateAlerts: () => void;
  clearDismissedAlerts: () => void;

  // Fish instance actions
  addFishInstance: (instance: Omit<FishInstance, 'id'>) => string;
  updateFishInstance: (id: string, updates: Partial<FishInstance>) => void;
  deleteFishInstance: (id: string) => void;

  // Feeding actions
  addFeedingSchedule: (schedule: Omit<FeedingSchedule, 'id'>) => string;
  updateFeedingSchedule: (id: string, updates: Partial<FeedingSchedule>) => void;
  deleteFeedingSchedule: (id: string) => void;
  logFeeding: (log: Omit<FeedingLog, 'id'>) => void;
  deleteFeedingLog: (id: string) => void;

  // Equipment actions
  addEquipment: (item: Omit<Equipment, 'id'>) => string;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;
  completeEquipmentMaintenance: (id: string) => void;

  // API key
  setApiKey: (key: string) => void;

  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  deleteJournalEntry: (id: string) => void;
  getTankJournalEntries: (tankId: string) => JournalEntry[];

  // Wishlist
  wishlistItems: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'id'>) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (speciesId: string, speciesType: string) => boolean;

  // Seeding
  seedData: () => void;

  // Selectors
  getTankReadings: (tankId: string) => WaterReading[];
  getLatestReading: (tankId: string) => WaterReading | undefined;
  getTankTasks: (tankId: string) => MaintenanceTask[];
  getOverdueTasks: () => MaintenanceTask[];
  getActiveAlerts: () => AppAlert[];
  getTankFishInstances: (tankId: string) => FishInstance[];
  getTankFeedingSchedules: (tankId: string) => FeedingSchedule[];
  getTankFeedingLogs: (tankId: string) => FeedingLog[];
  getTankEquipment: (tankId: string) => Equipment[];
  getOverdueEquipment: () => Equipment[];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      tanks: [],
      waterReadings: [],
      maintenanceTasks: [],
      alerts: [],
      seeded: false,
      fishInstances: [],
      feedingSchedules: [],
      feedingLogs: [],
      equipment: [],
      anthropicApiKey: '',
      journalEntries: [],
      wishlistItems: [],

      addTank: (tank) => {
        const id = uuidv4();
        set((state) => ({ tanks: [...state.tanks, { ...tank, id }] }));
        return id;
      },

      updateTank: (id, updates) =>
        set((state) => ({
          tanks: state.tanks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      updateTankPhoto: (id, photoUrl) =>
        set((state) => ({
          tanks: state.tanks.map((t) => (t.id === id ? { ...t, photoUrl } : t)),
        })),

      deleteTank: (id) =>
        set((state) => ({
          tanks: state.tanks.filter((t) => t.id !== id),
          waterReadings: state.waterReadings.filter((r) => r.tankId !== id),
          maintenanceTasks: state.maintenanceTasks.filter((t) => t.tankId !== id),
          alerts: state.alerts.filter((a) => a.tankId !== id),
          fishInstances: state.fishInstances.filter((f) => f.tankId !== id),
          feedingSchedules: state.feedingSchedules.filter((s) => s.tankId !== id),
          feedingLogs: state.feedingLogs.filter((l) => l.tankId !== id),
          equipment: state.equipment.filter((e) => e.tankId !== id),
          journalEntries: state.journalEntries.filter((j) => j.tankId !== id),
        })),

      addReading: (reading) => {
        const id = uuidv4();
        set((state) => ({
          waterReadings: [...state.waterReadings, { ...reading, id }],
        }));
        setTimeout(() => get().generateAlerts(), 0);
      },

      deleteReading: (id) =>
        set((state) => ({
          waterReadings: state.waterReadings.filter((r) => r.id !== id),
        })),

      addTask: (task) => {
        const id = uuidv4();
        set((state) => ({
          maintenanceTasks: [...state.maintenanceTasks, { ...task, id }],
        }));
      },

      updateTask: (id, updates) =>
        set((state) => ({
          maintenanceTasks: state.maintenanceTasks.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          maintenanceTasks: state.maintenanceTasks.filter((t) => t.id !== id),
        })),

      completeTask: (id) =>
        set((state) => ({
          maintenanceTasks: state.maintenanceTasks.map((t) => {
            if (t.id !== id) return t;
            const now = new Date();
            return {
              ...t,
              lastCompleted: formatISO(now),
              nextDue: formatISO(addDays(now, t.frequencyDays)),
            };
          }),
        })),

      dismissAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.map((a) =>
            a.id === id ? { ...a, dismissed: true } : a
          ),
        })),

      clearDismissedAlerts: () =>
        set((state) => ({
          alerts: state.alerts.filter((a) => !a.dismissed),
        })),

      generateAlerts: () => {
        const { tanks, waterReadings } = get();
        const newAlerts: AppAlert[] = [];

        for (const tank of tanks) {
          const tankReadings = waterReadings
            .filter((r) => r.tankId === tank.id)
            .sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime());

          const latest = tankReadings[0];
          if (!latest) continue;

          const ranges = getRangesForTankType(tank.type);
          const paramKeys = [
            'ph', 'ammonia', 'nitrite', 'nitrate', 'temperature',
            'salinity', 'gh', 'kh', 'phosphate', 'dissolvedOxygen',
            'calcium', 'magnesium',
          ] as const;

          for (const param of paramKeys) {
            const value = latest[param as keyof WaterReading] as number | undefined;
            if (value === undefined || value === null) continue;

            const range = ranges[param];
            if (!range) continue;

            const status = getParameterStatus(param, value, tank.type);
            if (status === 'safe') continue;

            const existingAlert = get().alerts.find(
              (a) => a.tankId === tank.id && a.parameter === param && !a.dismissed
            );
            if (existingAlert) continue;

            const label = PARAMETER_LABELS[param] || param;
            const unit = PARAMETER_UNITS[param] || '';
            const rangeStr = `${range.min}–${range.max} ${unit}`.trim();

            newAlerts.push({
              id: uuidv4(),
              tankId: tank.id,
              tankName: tank.name,
              parameter: param,
              severity: status === 'critical' ? 'critical' : 'warning',
              message: `${label} is ${value.toFixed(2)} ${unit} — safe range is ${rangeStr}`,
              value,
              unit,
              timestamp: latest.timestamp,
              dismissed: false,
            });
          }
        }

        if (newAlerts.length > 0) {
          set((state) => ({ alerts: [...state.alerts, ...newAlerts] }));
        }
      },

      // Fish instance actions
      addFishInstance: (instance) => {
        const id = uuidv4();
        set((state) => ({ fishInstances: [...state.fishInstances, { ...instance, id }] }));
        return id;
      },

      updateFishInstance: (id, updates) =>
        set((state) => ({
          fishInstances: state.fishInstances.map((f) => f.id === id ? { ...f, ...updates } : f),
        })),

      deleteFishInstance: (id) =>
        set((state) => ({
          fishInstances: state.fishInstances.filter((f) => f.id !== id),
        })),

      // Feeding actions
      addFeedingSchedule: (schedule) => {
        const id = uuidv4();
        set((state) => ({ feedingSchedules: [...state.feedingSchedules, { ...schedule, id }] }));
        return id;
      },

      updateFeedingSchedule: (id, updates) =>
        set((state) => ({
          feedingSchedules: state.feedingSchedules.map((s) => s.id === id ? { ...s, ...updates } : s),
        })),

      deleteFeedingSchedule: (id) =>
        set((state) => ({
          feedingSchedules: state.feedingSchedules.filter((s) => s.id !== id),
        })),

      logFeeding: (log) => {
        const id = uuidv4();
        set((state) => ({ feedingLogs: [...state.feedingLogs, { ...log, id }] }));
      },

      deleteFeedingLog: (id) =>
        set((state) => ({
          feedingLogs: state.feedingLogs.filter((l) => l.id !== id),
        })),

      // Equipment actions
      addEquipment: (item) => {
        const id = uuidv4();
        set((state) => ({ equipment: [...state.equipment, { ...item, id }] }));
        return id;
      },

      updateEquipment: (id, updates) =>
        set((state) => ({
          equipment: state.equipment.map((e) => e.id === id ? { ...e, ...updates } : e),
        })),

      deleteEquipment: (id) =>
        set((state) => ({
          equipment: state.equipment.filter((e) => e.id !== id),
        })),

      completeEquipmentMaintenance: (id) =>
        set((state) => ({
          equipment: state.equipment.map((e) => {
            if (e.id !== id) return e;
            const now = new Date();
            return {
              ...e,
              lastMaintained: formatISO(now),
              nextMaintenance: e.maintenanceFrequencyDays > 0
                ? formatISO(addDays(now, e.maintenanceFrequencyDays))
                : null,
            };
          }),
        })),

      setApiKey: (key) => set({ anthropicApiKey: key }),

      // Journal
      addJournalEntry: (entry) => {
        const id = uuidv4();
        set((state) => ({ journalEntries: [{ ...entry, id }, ...state.journalEntries] }));
      },
      deleteJournalEntry: (id) =>
        set((state) => ({ journalEntries: state.journalEntries.filter((j) => j.id !== id) })),
      getTankJournalEntries: (tankId) =>
        get().journalEntries.filter((j) => j.tankId === tankId),

      // Wishlist
      addToWishlist: (item) => {
        const id = uuidv4();
        set((state) => ({ wishlistItems: [...state.wishlistItems, { ...item, id }] }));
      },
      removeFromWishlist: (id) =>
        set((state) => ({ wishlistItems: state.wishlistItems.filter((w) => w.id !== id) })),
      isInWishlist: (speciesId, speciesType) =>
        get().wishlistItems.some((w) => w.speciesId === speciesId && w.speciesType === speciesType),

      seedData: () => {
        if (get().seeded) return;
        set({
          tanks: SAMPLE_TANKS,
          waterReadings: SAMPLE_READINGS,
          maintenanceTasks: SAMPLE_TASKS,
          seeded: true,
        });
        setTimeout(() => get().generateAlerts(), 0);
      },

      getTankReadings: (tankId) =>
        get()
          .waterReadings.filter((r) => r.tankId === tankId)
          .sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime()),

      getLatestReading: (tankId) => {
        const readings = get().getTankReadings(tankId);
        return readings[0];
      },

      getTankTasks: (tankId) =>
        get().maintenanceTasks.filter((t) => t.tankId === tankId),

      getOverdueTasks: () => {
        const now = new Date();
        return get().maintenanceTasks.filter(
          (t) => parseISO(t.nextDue) < now
        );
      },

      getActiveAlerts: () =>
        get().alerts.filter((a) => !a.dismissed),

      getTankFishInstances: (tankId) =>
        get().fishInstances.filter((f) => f.tankId === tankId),

      getTankFeedingSchedules: (tankId) =>
        get().feedingSchedules.filter((s) => s.tankId === tankId),

      getTankFeedingLogs: (tankId) =>
        get()
          .feedingLogs.filter((l) => l.tankId === tankId)
          .sort((a, b) => parseISO(b.timestamp).getTime() - parseISO(a.timestamp).getTime()),

      getTankEquipment: (tankId) =>
        get().equipment.filter((e) => e.tankId === tankId),

      getOverdueEquipment: () => {
        const now = new Date();
        return get().equipment.filter(
          (e) => e.status === 'active' && e.nextMaintenance && parseISO(e.nextMaintenance) < now
        );
      },
    }),
    {
      name: 'aquarium-app-storage',
    }
  )
);
