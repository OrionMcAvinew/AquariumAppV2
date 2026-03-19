import { AppAlert } from '../types';
import { useStore } from '../store';
import {
  ExclamationTriangleIcon,
  XMarkIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO } from 'date-fns';
import clsx from 'clsx';

interface Props {
  alerts: AppAlert[];
  compact?: boolean;
}

export default function AlertBanner({ alerts, compact = false }: Props) {
  const dismissAlert = useStore((s) => s.dismissAlert);

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={clsx(
            'flex items-start gap-3 rounded-xl border p-3',
            alert.severity === 'critical'
              ? 'bg-red-50 border-red-200'
              : 'bg-amber-50 border-amber-200'
          )}
        >
          {alert.severity === 'critical' ? (
            <BellAlertIcon className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          ) : (
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={clsx(
                  'text-xs font-bold uppercase tracking-wide',
                  alert.severity === 'critical' ? 'text-red-600' : 'text-amber-600'
                )}
              >
                {alert.severity}
              </span>
              <span className="text-xs text-slate-500 font-medium">{alert.tankName}</span>
            </div>
            {!compact && (
              <>
                <p className={clsx(
                  'text-sm font-medium mt-0.5',
                  alert.severity === 'critical' ? 'text-red-800' : 'text-amber-800'
                )}>
                  {alert.message}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {format(parseISO(alert.timestamp), 'MMM d, h:mm a')}
                </p>
              </>
            )}
            {compact && (
              <p className={clsx(
                'text-xs truncate mt-0.5',
                alert.severity === 'critical' ? 'text-red-700' : 'text-amber-700'
              )}>
                {alert.message}
              </p>
            )}
          </div>
          <button
            onClick={() => dismissAlert(alert.id)}
            className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
