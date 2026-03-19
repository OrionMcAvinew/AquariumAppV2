import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { addDays, formatISO, parseISO } from 'date-fns';
import { Tank, WaterReading, MaintenanceTask, AppAlert } from '../types';
import { SAMPLE_TANKS, SAMPLE_READINGS, SAMPLE_TASKS } from '../data/sampleData';
import { getRangesForTankType, getParameterStatus, PARAMETER_LABELS, PARAMETER_UNITS } from '../utils/parameterRanges';

interface AppState {
  tanks: Tank[];
  waterReadings: WaterReading[];
  maintenanceTasks: MaintenanceTask[];
  alerts: AppAlert[];
  seeded: boolean;

  // Tank actions
  addTank: (tank: Omit<Tank, 'id'>) => string;
  updateTank: (id: string, updates: Partial<Tank>) => void;
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

  // Seeding
  seedData: () => void;

  // Selectors
  getTankReadings: (tankId: string) => WaterReading[];
  getLatestReading: (tankId: string) => WaterReading | undefined;
  getTankTasks: (tankId: string) => MaintenanceTask[];
  getOverdueTasks: () => MaintenanceTask[];
  getActiveAlerts: () => AppAlert[];
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      tanks: [],
      waterReadings: [],
      maintenanceTasks: [],
      alerts: [],
      seeded: false,

      addTank: (tank) => {
        const id = uuidv4();
        set((state) => ({ tanks: [...state.tanks, { ...tank, id }] }));
        return id;
      },

      updateTank: (id, updates) =>
        set((state) => ({
          tanks: state.tanks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTank: (id) =>
        set((state) => ({
          tanks: state.tanks.filter((t) => t.id !== id),
          waterReadings: state.waterReadings.filter((r) => r.tankId !== id),
          maintenanceTasks: state.maintenanceTasks.filter((t) => t.tankId !== id),
          alerts: state.alerts.filter((a) => a.tankId !== id),
        })),

      addReading: (reading) => {
        const id = uuidv4();
        set((state) => ({
          waterReadings: [...state.waterReadings, { ...reading, id }],
        }));
        // Generate alerts after adding a reading
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
          ] as const;

          for (const param of paramKeys) {
            const value = latest[param as keyof WaterReading] as number | undefined;
            if (value === undefined || value === null) continue;

            const range = ranges[param];
            if (!range) continue;

            const status = getParameterStatus(param, value, tank.type);
            if (status === 'safe') continue;

            // Check if we already have an active (non-dismissed) alert for this
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
    }),
    {
      name: 'aquarium-app-storage',
    }
  )
);
