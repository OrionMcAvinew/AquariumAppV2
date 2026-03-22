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
  SparklesIcon,
  WrenchIcon,
  ShieldCheckIcon,
  CalculatorIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { useStore } from '../store';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
      { to: '/maintenance', label: 'Maintenance', icon: WrenchScrewdriverIcon, badge: true },
      { to: '/equipment', label: 'Equipment', icon: WrenchIcon },
      { to: '/analytics', label: 'Analytics', icon: ChartBarIcon },
    ],
  },
  {
    label: 'Tools',
    items: [
      { to: '/compatibility', label: 'Compatibility', icon: ShieldCheckIcon },
      { to: '/calculators', label: 'Calculators', icon: CalculatorIcon },
      { to: '/database', label: 'Database', icon: BookOpenIcon },
      { to: '/wishlist', label: 'Wishlist', icon: BookmarkIcon },
    ],
  },
  {
    label: 'More',
    items: [
      { to: '/ai', label: 'AI Advisor', icon: SparklesIcon },
      { to: '/settings', label: 'Settings', icon: Cog6ToothIcon },
    ],
  },
];

export default function Sidebar() {
  const activeAlerts = useStore((s) => s.getActiveAlerts());

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 min-h-screen" style={{
      background: 'linear-gradient(180deg, #0f172a 0%, #0f1f2e 100%)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
    }}>

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        {/* Monogram badge */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0d9488 100%)' }}>
          <span className="text-white font-bold text-sm tracking-tight">AQ</span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-white leading-tight tracking-tight">AquaManager</h1>
          <p className="text-[11px] text-slate-500 font-medium">Smart Aquarium Tracking</p>
        </div>
      </div>

      {/* Quick Add */}
      <div className="px-4 pb-4">
        <NavLink
          to="/tanks/new"
          className="flex items-center justify-center gap-2 w-full text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all duration-150 hover:opacity-90 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            boxShadow: '0 1px 6px rgba(14,165,233,0.4), inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
        >
          <PlusIcon className="w-4 h-4" />
          Add New Tank
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-4 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-[10px] font-semibold tracking-widest uppercase text-slate-600">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={clsx('w-[18px] h-[18px] shrink-0', isActive ? 'text-ocean-400' : '')} />
                      <span className="flex-1">{label}</span>
                      {badge && activeAlerts.length > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                          {activeAlerts.length}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Alerts footer */}
      {activeAlerts.length > 0 && (
        <div className="mx-3 mb-3 rounded-xl p-3" style={{
          background: 'rgba(239,68,68,0.12)',
          border: '1px solid rgba(239,68,68,0.25)',
        }}>
          <div className="flex items-center gap-2 text-red-400">
            <BellIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs font-semibold">
              {activeAlerts.length} Active Alert{activeAlerts.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-[11px] text-red-500/80 mt-0.5 leading-snug">
            Check parameter readings.
          </p>
        </div>
      )}

      {/* Version */}
      <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-[11px] text-slate-600 font-medium">v2.0</p>
      </div>
    </aside>
  );
}
