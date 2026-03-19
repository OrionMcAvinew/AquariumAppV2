import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  HomeIcon,
  WrenchScrewdriverIcon,
  BookOpenIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PlusIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { useStore } from '../store';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/maintenance', label: 'Maintenance', icon: WrenchScrewdriverIcon },
  { to: '/database', label: 'Database', icon: BookOpenIcon },
  { to: '/analytics', label: 'Analytics', icon: ChartBarIcon },
  { to: '/settings', label: 'Settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const activeAlerts = useStore((s) => s.getActiveAlerts());

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white min-h-screen shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-700/50">
        <span className="text-3xl">🐠</span>
        <div>
          <h1 className="text-lg font-bold text-white leading-tight">AquaManager</h1>
          <p className="text-xs text-slate-400">Smart Aquarium Tracking</p>
        </div>
      </div>

      {/* Quick Add */}
      <div className="px-4 py-4 border-b border-slate-700/50">
        <NavLink
          to="/tanks/new"
          className="flex items-center gap-2 w-full bg-ocean-500 hover:bg-ocean-400 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors duration-150"
        >
          <PlusIcon className="w-4 h-4" />
          Add New Tank
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-ocean-500/20 text-ocean-300 border border-ocean-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
            {label === 'Maintenance' && activeAlerts.length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {activeAlerts.length}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Alerts indicator */}
      {activeAlerts.length > 0 && (
        <div className="mx-4 mb-4 bg-red-900/40 border border-red-700/50 rounded-xl p-3">
          <div className="flex items-center gap-2 text-red-300">
            <BellIcon className="w-4 h-4" />
            <span className="text-xs font-semibold">{activeAlerts.length} Active Alert{activeAlerts.length !== 1 ? 's' : ''}</span>
          </div>
          <p className="text-xs text-red-400 mt-1">
            Check parameter readings on affected tanks.
          </p>
        </div>
      )}

      {/* Version */}
      <div className="px-6 py-4 border-t border-slate-700/50">
        <p className="text-xs text-slate-500">AquaManager v2.0</p>
      </div>
    </aside>
  );
}
