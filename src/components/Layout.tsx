import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import {
  HomeIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CalculatorIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useStore } from '../store';

const MOBILE_NAV = [
  { to: '/dashboard', label: 'Home', icon: HomeIcon },
  { to: '/maintenance', label: 'Tasks', icon: WrenchScrewdriverIcon },
  { to: '/compatibility', label: 'Compat', icon: ShieldCheckIcon },
  { to: '/calculators', label: 'Calc', icon: CalculatorIcon },
  { to: '/ai', label: 'AI', icon: SparklesIcon },
];

export default function Layout() {
  const activeAlerts = useStore((s) => s.getActiveAlerts());

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <Outlet />
        </div>

        {/* Mobile bottom navigation */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-50 safe-area-bottom">
          <div className="flex items-center justify-around py-2 px-2">
            {MOBILE_NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors relative ${
                    isActive ? 'text-ocean-600' : 'text-slate-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-6 h-6 ${isActive ? 'text-ocean-600' : 'text-slate-400'}`} />
                    <span className={`text-xs font-medium ${isActive ? 'text-ocean-600' : 'text-slate-400'}`}>
                      {label}
                    </span>
                    {label === 'Tasks' && activeAlerts.length > 0 && (
                      <span className="absolute top-0 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {activeAlerts.length > 9 ? '9+' : activeAlerts.length}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </main>
    </div>
  );
}
