import { useState } from 'react';
import { useStore } from '../store';
import { MaintenanceTask, TaskType } from '../types';
import {
  WrenchScrewdriverIcon,
  PlusIcon,
  CheckCircleIcon,
  TrashIcon,
  ClockIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO, isPast, differenceInDays } from 'date-fns';
import { formatISO, addDays } from 'date-fns';
import clsx from 'clsx';

const TASK_ICONS: Record<TaskType, string> = {
  water_change: '💧',
  filter_clean: '🔧',
  feeding: '🐟',
  parameter_test: '🧪',
  gravel_vacuum: '🧹',
  glass_clean: '✨',
  custom: '📋',
};

const TASK_TYPE_LABELS: Record<TaskType, string> = {
  water_change: 'Water Change',
  filter_clean: 'Filter Cleaning',
  feeding: 'Feeding',
  parameter_test: 'Parameter Test',
  gravel_vacuum: 'Gravel Vacuum',
  glass_clean: 'Glass Cleaning',
  custom: 'Custom',
};

export default function Maintenance() {
  const tanks = useStore((s) => s.tanks);
  const tasks = useStore((s) => s.maintenanceTasks);
  const completeTask = useStore((s) => s.completeTask);
  const deleteTask = useStore((s) => s.deleteTask);
  const addTask = useStore((s) => s.addTask);
  const [filter, setFilter] = useState<'all' | 'overdue' | 'upcoming'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    tankId: tanks[0]?.id || '',
    taskType: 'water_change' as TaskType,
    title: '',
    description: '',
    frequencyDays: '7',
  });

  const now = new Date();

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === 'overdue') return isPast(parseISO(t.nextDue));
      if (filter === 'upcoming') return !isPast(parseISO(t.nextDue));
      return true;
    })
    .sort((a, b) => parseISO(a.nextDue).getTime() - parseISO(b.nextDue).getTime());

  const overdueTasks = tasks.filter((t) => isPast(parseISO(t.nextDue)));

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.tankId || !newTask.title.trim()) return;

    const freqDays = parseInt(newTask.frequencyDays) || 7;
    addTask({
      tankId: newTask.tankId,
      taskType: newTask.taskType,
      title: newTask.title.trim() || TASK_TYPE_LABELS[newTask.taskType],
      description: newTask.description.trim(),
      frequencyDays: freqDays,
      nextDue: formatISO(addDays(now, freqDays)),
    });

    setNewTask({
      tankId: tanks[0]?.id || '',
      taskType: 'water_change',
      title: '',
      description: '',
      frequencyDays: '7',
    });
    setShowAddForm(false);
  };

  const getDueLabel = (task: MaintenanceTask) => {
    const dueDate = parseISO(task.nextDue);
    if (isPast(dueDate)) {
      const days = differenceInDays(now, dueDate);
      return days === 0 ? 'Due today' : `${days}d overdue`;
    }
    const days = differenceInDays(dueDate, now);
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days}d`;
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Maintenance</h1>
          <p className="text-slate-500 text-sm mt-1">
            {overdueTasks.length > 0
              ? `${overdueTasks.length} overdue task${overdueTasks.length !== 1 ? 's' : ''}`
              : 'All tasks on schedule'}
          </p>
        </div>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
          <PlusIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="card mb-5 border-ocean-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">New Maintenance Task</h3>
            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleAddTask} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label">Tank</label>
                <select
                  value={newTask.tankId}
                  onChange={(e) => setNewTask((t) => ({ ...t, tankId: e.target.value }))}
                  className="input-field"
                  required
                >
                  {tanks.map((t) => (
                    <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Task Type</label>
                <select
                  value={newTask.taskType}
                  onChange={(e) => {
                    const type = e.target.value as TaskType;
                    setNewTask((t) => ({
                      ...t,
                      taskType: type,
                      title: t.title || TASK_TYPE_LABELS[type],
                    }));
                  }}
                  className="input-field"
                >
                  {Object.entries(TASK_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Title</label>
              <input
                type="text"
                placeholder={TASK_TYPE_LABELS[newTask.taskType]}
                value={newTask.title}
                onChange={(e) => setNewTask((t) => ({ ...t, title: e.target.value }))}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Description (optional)</label>
              <textarea
                rows={2}
                placeholder="Any specific instructions..."
                value={newTask.description}
                onChange={(e) => setNewTask((t) => ({ ...t, description: e.target.value }))}
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="label">Repeat Every (days)</label>
              <input
                type="number"
                min={1}
                max={365}
                value={newTask.frequencyDays}
                onChange={(e) => setNewTask((t) => ({ ...t, frequencyDays: e.target.value }))}
                className="input-field"
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1 justify-center">
                <PlusIcon className="w-4 h-4" />
                Add Task
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-4">
        {(['all', 'overdue', 'upcoming'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'flex-1 text-sm font-semibold py-2 rounded-lg capitalize transition-all',
              filter === f ? 'bg-white text-ocean-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            {f}
            {f === 'overdue' && overdueTasks.length > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {overdueTasks.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tasks list */}
      {filteredTasks.length === 0 ? (
        <div className="card text-center py-12">
          <WrenchScrewdriverIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">
            {filter === 'overdue' ? 'No overdue tasks! 🎉' : 'No tasks yet'}
          </p>
          <p className="text-slate-300 text-sm mt-1">
            {filter === 'all' ? 'Add a maintenance task to get started.' : ''}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const tank = tanks.find((t) => t.id === task.tankId);
            const dueDate = parseISO(task.nextDue);
            const isOverdue = isPast(dueDate);
            const dueLabel = getDueLabel(task);

            return (
              <div
                key={task.id}
                className={clsx(
                  'card flex items-start gap-4 transition-all',
                  isOverdue && 'border-amber-200 bg-amber-50/50'
                )}
              >
                <div className="shrink-0 mt-0.5">
                  <button
                    onClick={() => completeTask(task.id)}
                    className="text-slate-300 hover:text-emerald-500 transition-colors"
                    title="Mark complete"
                  >
                    <CheckCircleIcon className="w-7 h-7" />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span className="text-lg">{TASK_ICONS[task.taskType]}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{task.title}</p>
                      {task.description && (
                        <p className="text-sm text-slate-500 mt-0.5 leading-snug">{task.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {tank && (
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        {tank.emoji} {tank.name}
                      </span>
                    )}
                    <span className={clsx(
                      'flex items-center gap-1 text-xs font-semibold',
                      isOverdue ? 'text-amber-600' : 'text-slate-500'
                    )}>
                      <ClockIcon className="w-3.5 h-3.5" />
                      {dueLabel}
                    </span>
                    <span className="text-xs text-slate-400">
                      Repeats every {task.frequencyDays}d
                    </span>
                    {task.lastCompleted && (
                      <span className="text-xs text-slate-400">
                        Last: {format(parseISO(task.lastCompleted), 'MMM d')}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="shrink-0 text-slate-300 hover:text-red-400 transition-colors"
                  title="Delete task"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
