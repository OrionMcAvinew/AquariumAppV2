import { Link } from 'react-router-dom';
import { useStore } from '../store';
import TankCard from '../components/TankCard';
import AlertBanner from '../components/AlertBanner';
import {
  PlusIcon,
  BeakerIcon,
  CalendarDaysIcon,
  BellAlertIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO, isPast } from 'date-fns';
import clsx from 'clsx';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  status?: 'default' | 'critical' | 'warning' | 'good';
}

function StatCard({ label, value, icon: Icon, status = 'default' }: StatCardProps) {
  const colors = {
    default:  { bg: 'bg-ocean-50',   icon: 'text-ocean-500',   value: 'text-ocean-700',   border: 'border-ocean-100' },
    critical: { bg: 'bg-red-50',     icon: 'text-red-500',     value: 'text-red-700',     border: 'border-red-100' },
    warning:  { bg: 'bg-amber-50',   icon: 'text-amber-500',   value: 'text-amber-700',   border: 'border-amber-100' },
    good:     { bg: 'bg-emerald-50', icon: 'text-emerald-500', value: 'text-emerald-700', border: 'border-emerald-100' },
  }[status];

  return (
    <div className={clsx('bg-white rounded-2xl border p-5 flex items-center gap-4', colors.border)}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,.05)' }}>
      <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', colors.bg)}>
        <Icon className={clsx('w-5 h-5', colors.icon)} />
      </div>
      <div>
        <p className={clsx('text-2xl font-bold leading-none mb-0.5', colors.value)}>{value}</p>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const tanks = useStore((s) => s.tanks);
  const userName = useStore((s) => s.userName);
  const getLatestReading = useStore((s) => s.getLatestReading);
  const activeAlerts = useStore((s) => s.getActiveAlerts());
  const overdueTasks = useStore((s) => s.getOverdueTasks());
  const maintenanceTasks = useStore((s) => s.maintenanceTasks);

  const upcomingTasks = maintenanceTasks
    .filter((t) => !isPast(parseISO(t.nextDue)))
    .sort((a, b) => parseISO(a.nextDue).getTime() - parseISO(b.nextDue).getTime())
    .slice(0, 5);

  const criticalAlerts = activeAlerts.filter((a) => a.severity === 'critical');
  const warningAlerts  = activeAlerts.filter((a) => a.severity === 'warning');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen">

      {/* ── Hero header ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #0c2d48 60%, #0f3460 100%)',
      }}>
        {/* Subtle wave overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(14,165,233,0.6) 0%, transparent 60%)',
        }} />

        <div className="relative px-6 py-8 max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-ocean-300 text-sm font-medium mb-1">
                {format(new Date(), "EEEE, MMMM d")}
              </p>
              <h1 className="text-white text-2xl font-bold tracking-tight mb-0.5">
                {greeting}{userName ? `, ${userName}` : ''} 👋
              </h1>
              <p className="text-slate-400 text-sm">
                {tanks.length === 0
                  ? 'Set up your first aquarium to get started.'
                  : `You're managing ${tanks.length} aquarium${tanks.length !== 1 ? 's' : ''}.`}
              </p>
            </div>
            <Link to="/tanks/new" className="btn-primary shrink-0">
              <PlusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Add Tank</span>
            </Link>
          </div>

          {/* Stat cards — inside hero, partially overlapping */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pb-2">
            <StatCard
              label="Aquariums"
              value={tanks.length}
              icon={BeakerIcon}
              status="default"
            />
            <StatCard
              label="Critical Alerts"
              value={criticalAlerts.length}
              icon={BellAlertIcon}
              status={criticalAlerts.length > 0 ? 'critical' : 'good'}
            />
            <StatCard
              label="Overdue Tasks"
              value={overdueTasks.length}
              icon={ExclamationTriangleIcon}
              status={overdueTasks.length > 0 ? 'warning' : 'good'}
            />
            <StatCard
              label="Upcoming"
              value={upcomingTasks.length}
              icon={ClipboardDocumentListIcon}
              status="default"
            />
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="px-6 py-6 max-w-7xl mx-auto space-y-6">

        {/* Alerts */}
        {activeAlerts.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <BellAlertIcon className="w-4 h-4 text-red-500" />
              <h2 className="section-title">Active Alerts</h2>
              <span className="ml-1 bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-2 py-0.5 rounded-full">
                {activeAlerts.length}
              </span>
            </div>
            <AlertBanner alerts={[...criticalAlerts, ...warningAlerts].slice(0, 5)} />
            {activeAlerts.length > 5 && (
              <p className="text-xs text-slate-400 mt-2 text-center">
                +{activeAlerts.length - 5} more — check individual tanks
              </p>
            )}
          </section>
        )}

        {/* Tanks grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="section-title">My Tanks</h2>
            </div>
          </div>

          {tanks.length === 0 ? (
            <div className="card text-center py-14">
              <div className="w-16 h-16 bg-ocean-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🐠</span>
              </div>
              <h3 className="text-base font-semibold text-slate-700 mb-1">No tanks yet</h3>
              <p className="text-slate-400 text-sm mb-5">Add your first aquarium to start tracking parameters and livestock.</p>
              <Link to="/tanks/new" className="btn-primary mx-auto">
                <PlusIcon className="w-4 h-4" />
                Add Your First Tank
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {tanks.map((tank) => (
                <TankCard
                  key={tank.id}
                  tank={tank}
                  latestReading={getLatestReading(tank.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Upcoming tasks */}
        {upcomingTasks.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CalendarDaysIcon className="w-4 h-4 text-teal-500" />
                <h2 className="section-title">Upcoming Tasks</h2>
              </div>
              <Link to="/maintenance" className="text-xs text-ocean-600 hover:text-ocean-700 font-semibold">
                View all →
              </Link>
            </div>
            <div className="card p-0 overflow-hidden divide-y divide-slate-100">
              {upcomingTasks.map((task) => {
                const tank = tanks.find((t) => t.id === task.tankId);
                const dueDate = parseISO(task.nextDue);
                const isOverdue = isPast(dueDate);
                return (
                  <div key={task.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-base shrink-0">
                      {tank?.emoji || '🐠'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{task.title}</p>
                      <p className="text-xs text-slate-400 truncate">{tank?.name}</p>
                    </div>
                    <div className={clsx(
                      'flex items-center gap-1 shrink-0 text-xs font-semibold',
                      isOverdue ? 'text-red-500' : 'text-slate-400'
                    )}>
                      {!isOverdue && <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-400" />}
                      {isOverdue ? 'Overdue' : format(dueDate, 'MMM d')}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
