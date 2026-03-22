import { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import {
  Cog6ToothIcon,
  TrashIcon,
  BellIcon,
  ArrowPathIcon,
  UserCircleIcon,
  CheckIcon,
  PencilIcon,
  ServerStackIcon,
  ChartBarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { SAMPLE_TANKS, SAMPLE_READINGS, SAMPLE_TASKS } from '../data/sampleData';
import { FISH_DATABASE } from '../data/fishDatabase';
import { PLANT_DATABASE } from '../data/plantDatabase';
import { CORAL_DATABASE } from '../data/coralDatabase';
import { INVERTEBRATE_DATABASE } from '../data/invertebrateDatabase';

const AVATAR_OPTIONS = ['🐠', '🐡', '🦈', '🐙', '🦑', '🦞', '🦀', '🐚', '🐬', '🌊'];

export default function Settings() {
  const navigate = useNavigate();
  const {
    tanks, waterReadings, maintenanceTasks, alerts, wishlistItems,
    clearDismissedAlerts, generateAlerts,
    userName, setUserName,
  } = useStore();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [avatar, setAvatar] = useState(() => localStorage.getItem('aq-avatar') || '🐠');

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const activeAlerts   = alerts.filter((a) => !a.dismissed).length;
  const dismissedAlerts = alerts.filter((a) =>  a.dismissed).length;
  const totalReadings  = waterReadings.length;

  const handleSaveName = () => {
    setUserName(nameInput.trim());
    setEditingName(false);
  };

  const handlePickAvatar = (emoji: string) => {
    setAvatar(emoji);
    localStorage.setItem('aq-avatar', emoji);
    setAvatarOpen(false);
  };

  const handleResetDemo = () => {
    useStore.setState({ tanks: SAMPLE_TANKS, waterReadings: SAMPLE_READINGS, maintenanceTasks: SAMPLE_TASKS, alerts: [], seeded: true });
    setTimeout(() => useStore.getState().generateAlerts(), 100);
    setShowResetConfirm(false);
    navigate('/dashboard');
  };

  const handleClearAll = () => {
    useStore.setState({ tanks: [], waterReadings: [], maintenanceTasks: [], alerts: [], seeded: false });
    setShowClearConfirm(false);
    navigate('/dashboard');
  };

  const stats = [
    { label: 'Tanks',    value: tanks.length,            color: 'text-ocean-600',   bg: 'bg-ocean-50',   icon: '🐠' },
    { label: 'Readings', value: totalReadings,            color: 'text-teal-600',    bg: 'bg-teal-50',    icon: '🧪' },
    { label: 'Tasks',    value: maintenanceTasks.length,  color: 'text-purple-600',  bg: 'bg-purple-50',  icon: '📋' },
    { label: 'Wishlist', value: wishlistItems.length,     color: 'text-violet-600',  bg: 'bg-violet-50',  icon: '⭐' },
  ];

  return (
    <div className="min-h-screen">
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="px-6 py-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Cog6ToothIcon className="w-5 h-5 text-slate-400" />
          <h1 className="page-title">Settings</h1>
        </div>

        {/* ── User profile card ───────────────────────────────────────── */}
        <div className="card mb-4 overflow-hidden">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <button
              onClick={() => setAvatarOpen(!avatarOpen)}
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0d9488)' }}
              title="Change avatar"
            >
              {avatar}
              <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center">
                <PencilIcon className="w-2.5 h-2.5 text-slate-500" />
              </span>
            </button>

            {/* Name */}
            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false); }}
                    placeholder="Your name"
                    className="input-field flex-1"
                    autoFocus
                    maxLength={32}
                  />
                  <button onClick={handleSaveName} className="btn-primary py-2 px-3">
                    <CheckIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-lg leading-tight truncate">
                      {userName || 'Set your name'}
                    </p>
                    <p className="text-sm text-slate-400">AquaManager user</p>
                  </div>
                  <button
                    onClick={() => { setNameInput(userName); setEditingName(true); }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 shrink-0"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Avatar picker */}
          {avatarOpen && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Choose avatar</p>
              <div className="flex gap-2 flex-wrap">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handlePickAvatar(emoji)}
                    className={clsx(
                      'w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all hover:scale-110',
                      avatar === emoji ? 'ring-2 ring-ocean-500 bg-ocean-50' : 'bg-slate-50 hover:bg-slate-100'
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Stats ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {stats.map(({ label, value, color, bg, icon }) => (
            <div key={label} className="card text-center py-3 px-2">
              <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 text-base', bg)}>
                {icon}
              </div>
              <p className={clsx('text-xl font-bold', color)}>{value}</p>
              <p className="text-[11px] text-slate-400 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Database size ─────────────────────────────────────────────── */}
        <div className="card mb-4">
          <div className="flex items-center gap-2 mb-3">
            <ServerStackIcon className="w-4 h-4 text-ocean-500" />
            <h3 className="section-title">Species Database</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Fish species',         value: FISH_DATABASE.length,        emoji: '🐠' },
              { label: 'Plant species',        value: PLANT_DATABASE.length,       emoji: '🌿' },
              { label: 'Coral species',        value: CORAL_DATABASE.length,       emoji: '🪸' },
              { label: 'Invertebrate species', value: INVERTEBRATE_DATABASE.length, emoji: '🦐' },
            ].map(({ label, value, emoji }) => (
              <div key={label} className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2.5">
                <span className="text-lg">{emoji}</span>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{value}</p>
                  <p className="text-[11px] text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Alerts ───────────────────────────────────────────────────── */}
        <div className="card mb-4">
          <div className="flex items-center gap-2 mb-3">
            <BellIcon className="w-4 h-4 text-ocean-500" />
            <h3 className="section-title">Alerts</h3>
            {activeAlerts > 0 && (
              <span className="badge-critical">{activeAlerts} active</span>
            )}
          </div>
          <p className="text-sm text-slate-400 mb-3">
            {activeAlerts} active · {dismissedAlerts} dismissed
          </p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => generateAlerts()} className="btn-secondary text-sm">
              <ArrowPathIcon className="w-4 h-4" />
              Re-check All Tanks
            </button>
            {dismissedAlerts > 0 && (
              <button onClick={clearDismissedAlerts} className="btn-secondary text-sm">
                <TrashIcon className="w-4 h-4" />
                Clear {dismissedAlerts} Dismissed
              </button>
            )}
          </div>
        </div>

        {/* ── Data management ───────────────────────────────────────────── */}
        <div className="card mb-4">
          <div className="flex items-center gap-2 mb-1">
            <ChartBarIcon className="w-4 h-4 text-slate-500" />
            <h3 className="section-title">Data Management</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">All data is stored locally in your browser.</p>

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
                    This will replace all your data with demo tanks and readings.
                  </p>
                  <div className="flex gap-2">
                    <button onClick={handleResetDemo} className="flex-1 justify-center text-sm bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-xl inline-flex items-center gap-2 transition-colors">
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
                    This will permanently delete all tanks, readings, and tasks.
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

        {/* ── About ─────────────────────────────────────────────────────── */}
        <div className="card text-center">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-2xl"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #0d9488)' }}
          >
            🐠
          </div>
          <h3 className="font-bold text-slate-800 text-base">AquaManager</h3>
          <p className="text-sm text-slate-400 mt-0.5">v2.0 · Smart Aquarium Management</p>
          <div className="flex items-center justify-center gap-1 mt-3 text-xs text-slate-400">
            <SparklesIcon className="w-3 h-3" />
            <span>Built with React, TypeScript, Tailwind CSS &amp; Zustand</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Data stored locally — your fish info stays private.</p>
        </div>
      </div>
    </div>
  );
}
