import { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Cog6ToothIcon, TrashIcon, BellIcon, InformationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { SAMPLE_TANKS, SAMPLE_READINGS, SAMPLE_TASKS } from '../data/sampleData';

const FEATURES = [
  {
    icon: '🐠',
    title: 'Tank Profiles',
    description: 'Track multiple tanks with different setups, species lists, and parameters.',
  },
  {
    icon: '🧪',
    title: 'Water Parameter Tracking',
    description: 'Log pH, ammonia, nitrite, nitrate, temperature, salinity, and more.',
  },
  {
    icon: '📊',
    title: 'Trend Charts',
    description: 'Visualize parameter history over time with color-coded safe ranges.',
  },
  {
    icon: '🔔',
    title: 'Smart Alerts',
    description: 'Automatic warnings and critical alerts when parameters go out of range.',
  },
  {
    icon: '🔧',
    title: 'Maintenance Reminders',
    description: 'Recurring tasks for water changes, filter cleaning, feeding, and more.',
  },
  {
    icon: '📖',
    title: 'Fish & Plant Database',
    description: '20+ fish and 15+ plants with care guides, compatibility, and requirements.',
  },
  {
    icon: '💯',
    title: 'Health Scores',
    description: 'Instant health score for each tank based on current water parameters.',
  },
  {
    icon: '📱',
    title: 'Mobile Friendly',
    description: 'Responsive design with bottom navigation for easy phone use.',
  },
];

export default function Settings() {
  const navigate = useNavigate();
  const { tanks, waterReadings, maintenanceTasks, alerts, clearDismissedAlerts, generateAlerts } = useStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const totalReadings = waterReadings.length;
  const totalAlerts = alerts.length;
  const activeAlerts = alerts.filter((a) => !a.dismissed).length;
  const dismissedAlerts = alerts.filter((a) => a.dismissed).length;

  const handleResetDemo = () => {
    useStore.setState({
      tanks: SAMPLE_TANKS,
      waterReadings: SAMPLE_READINGS,
      maintenanceTasks: SAMPLE_TASKS,
      alerts: [],
      seeded: true,
    });
    setTimeout(() => {
      useStore.getState().generateAlerts();
    }, 100);
    setShowResetConfirm(false);
    navigate('/dashboard');
  };

  const handleClearAll = () => {
    useStore.setState({
      tanks: [],
      waterReadings: [],
      maintenanceTasks: [],
      alerts: [],
      seeded: false,
    });
    setShowClearConfirm(false);
    navigate('/dashboard');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Cog6ToothIcon className="w-6 h-6 text-ocean-500" />
          <h1 className="page-title">Settings</h1>
        </div>
        <p className="text-slate-500 text-sm">App information and data management</p>
      </div>

      {/* Stats card */}
      <div className="card mb-4">
        <h3 className="section-title mb-3">Your Data</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Tanks', value: tanks.length, color: 'text-ocean-600' },
            { label: 'Readings', value: totalReadings, color: 'text-teal-600' },
            { label: 'Tasks', value: maintenanceTasks.length, color: 'text-purple-600' },
            { label: 'Alerts', value: activeAlerts, color: activeAlerts > 0 ? 'text-red-600' : 'text-emerald-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
              <p className={clsx('text-2xl font-bold', color)}>{value}</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alert management */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <BellIcon className="w-5 h-5 text-ocean-500" />
          <h3 className="section-title">Alerts</h3>
        </div>
        <p className="text-sm text-slate-500 mb-3">
          {activeAlerts} active · {dismissedAlerts} dismissed · {totalAlerts} total
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => generateAlerts()}
            className="btn-secondary text-sm"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Re-check All Tanks
          </button>
          {dismissedAlerts > 0 && (
            <button
              onClick={clearDismissedAlerts}
              className="btn-secondary text-sm"
            >
              <TrashIcon className="w-4 h-4" />
              Clear {dismissedAlerts} Dismissed
            </button>
          )}
        </div>
      </div>

      {/* Data management */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <TrashIcon className="w-5 h-5 text-slate-500" />
          <h3 className="section-title">Data Management</h3>
        </div>
        <p className="text-sm text-slate-400 mb-4">
          All data is stored locally in your browser's localStorage.
        </p>

        <div className="space-y-3">
          <div>
            <button
              onClick={() => setShowResetConfirm(!showResetConfirm)}
              className="btn-secondary w-full justify-center"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Reset to Demo Data
            </button>
            {showResetConfirm && (
              <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-sm text-amber-800 font-medium mb-2">
                  This will replace all your data with the demo tanks and readings.
                </p>
                <div className="flex gap-2">
                  <button onClick={handleResetDemo} className="btn-primary text-sm flex-1 justify-center bg-amber-500 hover:bg-amber-600">
                    Yes, Reset
                  </button>
                  <button onClick={() => setShowResetConfirm(false)} className="btn-secondary text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setShowClearConfirm(!showClearConfirm)}
              className="btn-danger w-full justify-center"
            >
              <TrashIcon className="w-4 h-4" />
              Clear All Data
            </button>
            {showClearConfirm && (
              <div className="mt-2 bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-sm text-red-800 font-medium mb-2">
                  This will permanently delete all tanks, readings, and tasks. Cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button onClick={handleClearAll} className="btn-danger text-sm flex-1 justify-center">
                    Yes, Delete Everything
                  </button>
                  <button onClick={() => setShowClearConfirm(false)} className="btn-secondary text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features list */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-4">
          <InformationCircleIcon className="w-5 h-5 text-ocean-500" />
          <h3 className="section-title">Features</h3>
        </div>
        <div className="space-y-3">
          {FEATURES.map(({ icon, title, description }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="text-xl shrink-0">{icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="card text-center">
        <span className="text-4xl block mb-3">🐠</span>
        <h3 className="font-bold text-slate-800 text-lg">AquaManager v2.0</h3>
        <p className="text-sm text-slate-500 mt-1">Smart Aquarium Management</p>
        <p className="text-xs text-slate-400 mt-3">
          Built with React, TypeScript, Tailwind CSS, Recharts &amp; Zustand.
          <br />
          Data stored locally — your fish info stays private.
        </p>
      </div>
    </div>
  );
}
