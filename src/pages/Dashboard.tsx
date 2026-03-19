import { Link } from 'react-router-dom';
import { useStore } from '../store';
import TankCard from '../components/TankCard';
import AlertBanner from '../components/AlertBanner';
import { PlusIcon, BeakerIcon, CalendarDaysIcon, BellAlertIcon } from '@heroicons/react/24/outline';
import { format, parseISO, isPast } from 'date-fns';
import clsx from 'clsx';

export default function Dashboard() {
  const tanks = useStore((s) => s.tanks);
  const getLatestReading = useStore((s) => s.getLatestReading);
  const activeAlerts = useStore((s) => s.getActiveAlerts());
  const overdueTasks = useStore((s) => s.getOverdueTasks());
  const maintenanceTasks = useStore((s) => s.maintenanceTasks);

  const upcomingTasks = maintenanceTasks
    .filter((t) => !isPast(parseISO(t.nextDue)))
    .sort((a, b) => parseISO(a.nextDue).getTime() - parseISO(b.nextDue).getTime())
    .slice(0, 4);

  const criticalAlerts = activeAlerts.filter((a) => a.severity === 'critical');
  const warningAlerts = activeAlerts.filter((a) => a.severity === 'warning');

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            {format(new Date(), "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <Link to="/tanks/new" className="btn-primary">
          <PlusIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Add Tank</span>
        </Link>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="card text-center py-4">
          <p className="text-3xl font-bold text-ocean-600">{tanks.length}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Tanks</p>
        </div>
        <div className={clsx('card text-center py-4', criticalAlerts.length > 0 && 'border-red-200 bg-red-50')}>
          <p className={clsx('text-3xl font-bold', criticalAlerts.length > 0 ? 'text-red-600' : 'text-emerald-600')}>
            {criticalAlerts.length}
          </p>
          <p className="text-xs text-slate-500 font-medium mt-1">Critical Alerts</p>
        </div>
        <div className={clsx('card text-center py-4', overdueTasks.length > 0 && 'border-amber-200 bg-amber-50')}>
          <p className={clsx('text-3xl font-bold', overdueTasks.length > 0 ? 'text-amber-600' : 'text-emerald-600')}>
            {overdueTasks.length}
          </p>
          <p className="text-xs text-slate-500 font-medium mt-1">Overdue Tasks</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-3xl font-bold text-teal-600">{upcomingTasks.length}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">Upcoming</p>
        </div>
      </div>

      {/* Alerts */}
      {activeAlerts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BellAlertIcon className="w-5 h-5 text-red-500" />
            <h2 className="section-title">Active Alerts</h2>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{activeAlerts.length}</span>
          </div>
          <AlertBanner alerts={[...criticalAlerts, ...warningAlerts].slice(0, 5)} />
          {activeAlerts.length > 5 && (
            <p className="text-xs text-slate-400 mt-2 text-center">
              +{activeAlerts.length - 5} more alerts — check individual tanks
            </p>
          )}
        </div>
      )}

      {/* Tanks grid */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BeakerIcon className="w-5 h-5 text-ocean-500" />
          <h2 className="section-title">My Tanks</h2>
        </div>

        {tanks.length === 0 ? (
          <div className="card text-center py-12">
            <span className="text-5xl block mb-3">🐠</span>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No tanks yet</h3>
            <p className="text-slate-400 text-sm mb-4">Add your first aquarium to start tracking.</p>
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
      </div>

      {/* Upcoming tasks */}
      {upcomingTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="w-5 h-5 text-teal-500" />
              <h2 className="section-title">Upcoming Tasks</h2>
            </div>
            <Link to="/maintenance" className="text-sm text-ocean-600 hover:text-ocean-700 font-medium">
              View all →
            </Link>
          </div>
          <div className="card p-0 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {upcomingTasks.map((task) => {
                const tank = tanks.find((t) => t.id === task.tankId);
                const dueDate = parseISO(task.nextDue);
                const isOverdue = isPast(dueDate);
                return (
                  <div key={task.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-xl">{tank?.emoji || '🐠'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{task.title}</p>
                      <p className="text-xs text-slate-400 truncate">{tank?.name}</p>
                    </div>
                    <span className={clsx(
                      'text-xs font-semibold shrink-0',
                      isOverdue ? 'text-red-500' : 'text-slate-400'
                    )}>
                      {isOverdue ? 'Overdue' : format(dueDate, 'MMM d')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
