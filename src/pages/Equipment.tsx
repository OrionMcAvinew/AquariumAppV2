import { useState } from 'react';
import { useStore } from '../store';
import {
  WrenchScrewdriverIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { format, parseISO, isPast, formatDistanceToNow } from 'date-fns';
import { Equipment, EquipmentType } from '../types';
import clsx from 'clsx';

const EQUIPMENT_TYPE_LABELS: Record<EquipmentType, string> = {
  filter: 'Filter',
  heater: 'Heater',
  light: 'Light',
  pump: 'Pump',
  skimmer: 'Protein Skimmer',
  co2: 'CO₂ System',
  uv_sterilizer: 'UV Sterilizer',
  powerhead: 'Powerhead',
  other: 'Other',
};

const EQUIPMENT_TYPE_EMOJIS: Record<EquipmentType, string> = {
  filter: '🌀',
  heater: '🌡️',
  light: '💡',
  pump: '⚙️',
  skimmer: '🫧',
  co2: '💨',
  uv_sterilizer: '🔵',
  powerhead: '🌊',
  other: '🔧',
};

const MAINTENANCE_PRESETS: Record<EquipmentType, number> = {
  filter: 30,
  heater: 90,
  light: 180,
  pump: 60,
  skimmer: 14,
  co2: 30,
  uv_sterilizer: 90,
  powerhead: 60,
  other: 30,
};

const EMPTY_FORM = {
  tankId: '',
  name: '',
  type: 'filter' as EquipmentType,
  brand: '',
  model: '',
  purchaseDate: new Date().toISOString().slice(0, 10),
  maintenanceFrequencyDays: 30,
  notes: '',
};

export default function EquipmentPage() {
  const tanks = useStore((s) => s.tanks);
  const equipment = useStore((s) => s.equipment);
  const addEquipment = useStore((s) => s.addEquipment);
  const deleteEquipment = useStore((s) => s.deleteEquipment);
  const completeEquipmentMaintenance = useStore((s) => s.completeEquipmentMaintenance);
  const updateEquipment = useStore((s) => s.updateEquipment);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filterTank, setFilterTank] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active');

  const now = new Date();
  const overdueItems = equipment.filter(
    (e) => e.status === 'active' && e.nextMaintenance && isPast(parseISO(e.nextMaintenance))
  );

  const filtered = equipment.filter((e) => {
    if (filterTank !== 'all' && e.tankId !== filterTank && !(filterTank === 'unassigned' && !e.tankId)) return false;
    if (filterStatus !== 'all' && e.status !== filterStatus) return false;
    return true;
  });

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const now = new Date();
    addEquipment({
      tankId: form.tankId || null,
      name: form.name,
      type: form.type,
      brand: form.brand,
      model: form.model,
      purchaseDate: form.purchaseDate,
      maintenanceFrequencyDays: form.maintenanceFrequencyDays,
      lastMaintained: null,
      nextMaintenance: form.maintenanceFrequencyDays > 0
        ? new Date(now.getTime() + form.maintenanceFrequencyDays * 86400000).toISOString()
        : null,
      notes: form.notes,
      status: 'active',
    });
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const handleTypeChange = (type: EquipmentType) => {
    setForm((prev) => ({
      ...prev,
      type,
      maintenanceFrequencyDays: MAINTENANCE_PRESETS[type],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-3 sticky top-0 z-10">
        <div className="flex-1">
          <h1 className="text-lg font-bold text-slate-900">Equipment</h1>
          <p className="text-xs text-slate-400">{equipment.filter((e) => e.status === 'active').length} active items</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          <PlusIcon className="w-4 h-4" />
          Add Equipment
        </button>
      </div>

      <div className="p-6 space-y-5">
        {/* Overdue banner */}
        {overdueItems.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-amber-800 text-sm">
                {overdueItems.length} item{overdueItems.length !== 1 ? 's' : ''} need maintenance
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                {overdueItems.map((e) => e.name).join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Add form */}
        {showForm && (
          <div className="card">
            <h3 className="section-title mb-4">Add Equipment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Canister Filter"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Type *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => handleTypeChange(e.target.value as EquipmentType)}
                    className="input"
                  >
                    {Object.entries(EQUIPMENT_TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
                    placeholder="e.g. Fluval"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    value={form.model}
                    onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))}
                    placeholder="e.g. FX6"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Tank (optional)
                  </label>
                  <select
                    value={form.tankId}
                    onChange={(e) => setForm((p) => ({ ...p, tankId: e.target.value }))}
                    className="input"
                  >
                    <option value="">Unassigned</option>
                    {tanks.map((t) => (
                      <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={form.purchaseDate}
                    onChange={(e) => setForm((p) => ({ ...p, purchaseDate: e.target.value }))}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Maintenance Every (days)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.maintenanceFrequencyDays}
                    onChange={(e) => setForm((p) => ({ ...p, maintenanceFrequencyDays: parseInt(e.target.value) || 0 }))}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    value={form.notes}
                    onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="Optional notes"
                    className="input"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" className="btn-primary">Add Equipment</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <select
            value={filterTank}
            onChange={(e) => setFilterTank(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-ocean-400"
          >
            <option value="all">All Tanks</option>
            <option value="unassigned">Unassigned</option>
            {tanks.map((t) => (
              <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-ocean-400"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="replaced">Replaced</option>
          </select>
        </div>

        {/* Equipment list */}
        {filtered.length === 0 ? (
          <div className="card text-center py-12">
            <WrenchScrewdriverIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-medium">No equipment found</p>
            <p className="text-slate-300 text-xs mt-1">Add filters, heaters, lights, and more</p>
            <button onClick={() => setShowForm(true)} className="btn-primary mt-4 mx-auto">
              <PlusIcon className="w-4 h-4" />
              Add Equipment
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const tank = tanks.find((t) => t.id === item.tankId);
              const isOverdue = item.status === 'active' && item.nextMaintenance && isPast(parseISO(item.nextMaintenance));
              const isDueSoon = item.status === 'active' && item.nextMaintenance && !isOverdue &&
                parseISO(item.nextMaintenance).getTime() - now.getTime() < 7 * 86400000;

              return (
                <div key={item.id} className={clsx('card', isOverdue && 'border-amber-200 bg-amber-50/30')}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{EQUIPMENT_TYPE_EMOJIS[item.type]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-slate-800">{item.name}</p>
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                          {EQUIPMENT_TYPE_LABELS[item.type]}
                        </span>
                        {item.status !== 'active' && (
                          <span className={clsx(
                            'text-xs px-2 py-0.5 rounded-full font-medium',
                            item.status === 'inactive' && 'bg-slate-200 text-slate-600',
                            item.status === 'replaced' && 'bg-red-100 text-red-600',
                          )}>
                            {item.status}
                          </span>
                        )}
                      </div>
                      {(item.brand || item.model) && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {[item.brand, item.model].filter(Boolean).join(' ')}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        {tank && (
                          <span className="text-xs text-slate-500">{tank.emoji} {tank.name}</span>
                        )}
                        {item.purchaseDate && (
                          <span className="text-xs text-slate-400">
                            Purchased {format(parseISO(item.purchaseDate), 'MMM yyyy')}
                          </span>
                        )}
                        {item.nextMaintenance && (
                          <span className={clsx(
                            'flex items-center gap-1 text-xs font-medium',
                            isOverdue ? 'text-amber-600' : isDueSoon ? 'text-yellow-600' : 'text-slate-400'
                          )}>
                            {isOverdue ? <ExclamationTriangleIcon className="w-3.5 h-3.5" /> : <ClockIcon className="w-3.5 h-3.5" />}
                            {isOverdue
                              ? `Overdue by ${formatDistanceToNow(parseISO(item.nextMaintenance))}`
                              : `Due ${format(parseISO(item.nextMaintenance), 'MMM d')}`
                            }
                          </span>
                        )}
                      </div>
                      {item.notes && <p className="text-xs text-slate-400 mt-1">{item.notes}</p>}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {item.status === 'active' && item.maintenanceFrequencyDays > 0 && (
                        <button
                          onClick={() => completeEquipmentMaintenance(item.id)}
                          className="text-slate-300 hover:text-emerald-500 transition-colors p-1.5"
                          title="Mark maintenance done"
                        >
                          <CheckCircleIcon className="w-5 h-5" />
                        </button>
                      )}
                      <select
                        value={item.status}
                        onChange={(e) => updateEquipment(item.id, { status: e.target.value as Equipment['status'] })}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none"
                        title="Change status"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="replaced">Replaced</option>
                      </select>
                      <button
                        onClick={() => deleteEquipment(item.id)}
                        className="text-slate-300 hover:text-red-400 transition-colors p-1.5"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
