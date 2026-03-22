import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import {
  HomeIcon,
  WrenchScrewdriverIcon,
  SparklesIcon,
  ShieldCheckIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  WrenchScrewdriverIcon as WrenchScrewdriverIconSolid,
  SparklesIcon as SparklesIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
  CalculatorIcon as CalculatorIconSolid,
} from '@heroicons/react/24/solid';
import { useStore } from '../store';

const MOBILE_NAV = [
  { to: '/dashboard',    label: 'Home',   icon: HomeIcon,                 iconActive: HomeIconSolid },
  { to: '/maintenance',  label: 'Tasks',  icon: WrenchScrewdriverIcon,    iconActive: WrenchScrewdriverIconSolid, badge: true },
  { to: '/compatibility',label: 'Compat', icon: ShieldCheckIcon,          iconActive: ShieldCheckIconSolid },
  { to: '/calculators',  label: 'Calc',   icon: CalculatorIcon,           iconActive: CalculatorIconSolid },
  { to: '/ai',           label: 'AI',     icon: SparklesIcon,             iconActive: SparklesIconSolid },
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
        <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50" style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(0,0,0,0.08)',
        }}>
          <div className="flex items-center justify-around py-2 px-1">
            {MOBILE_NAV.map(({ to, label, icon: Icon, iconActive: IconActive, badge }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                    isActive ? 'text-ocean-600' : 'text-slate-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive
                      ? <IconActive className="w-5 h-5 text-ocean-600" />
                      : <Icon className="w-5 h-5" />
                    }
                    <span className={`text-[10px] font-semibold ${isActive ? 'text-ocean-600' : 'text-slate-400'}`}>
                      {label}
                    </span>
                    {badge && activeAlerts.length > 0 && (
                      <span className="absolute top-1 right-1.5 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                        {activeAlerts.length > 9 ? '9+' : activeAlerts.length}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
          {/* iOS safe area */}
          <div className="h-safe-bottom" />
        </nav>
      </main>
    </div>
  );
}
