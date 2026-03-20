import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../store';
import { ArrowLeftIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { getRangesForTankType, PARAMETER_LABELS } from '../utils/parameterRanges';
import { formatISO } from 'date-fns';
import clsx from 'clsx';

type ParamKey = 'ph' | 'ammonia' | 'nitrite' | 'nitrate' | 'temperature' | 'salinity' | 'gh' | 'kh' | 'phosphate' | 'dissolvedOxygen' | 'calcium' | 'magnesium';

const ALL_PARAMS: { key: ParamKey; placeholder: string; step: string }[] = [
  { key: 'ph', placeholder: '7.0', step: '0.1' },
  { key: 'ammonia', placeholder: '0.0', step: '0.01' },
  { key: 'nitrite', placeholder: '0.0', step: '0.01' },
  { key: 'nitrate', placeholder: '10', step: '0.5' },
  { key: 'temperature', placeholder: '78', step: '0.1' },
  { key: 'salinity', placeholder: '1.025', step: '0.001' },
  { key: 'gh', placeholder: '8', step: '0.5' },
  { key: 'kh', placeholder: '8', step: '0.5' },
  { key: 'phosphate', placeholder: '0.1', step: '0.01' },
  { key: 'dissolvedOxygen', placeholder: '7.0', step: '0.1' },
  { key: 'calcium', placeholder: '420', step: '1' },
  { key: 'magnesium', placeholder: '1300', step: '5' },
];

export default function AddParameter() {
  const { tankId } = useParams<{ tankId: string }>();
  const navigate = useNavigate();
  const tanks = useStore((s) => s.tanks);
  const addReading = useStore((s) => s.addReading);

  const tank = tanks.find((t) => t.id === tankId);
  const [values, setValues] = useState<Partial<Record<ParamKey, string>>>({});
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!tank) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500">Tank not found.</p>
        <Link to="/dashboard" className="btn-primary mt-4 mx-auto">Dashboard</Link>
      </div>
    );
  }

  const ranges = getRangesForTankType(tank.type);
  const relevantParams = ALL_PARAMS.filter((p) => ranges[p.key]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reading: Record<string, unknown> = {
      tankId: tank.id,
      timestamp: formatISO(new Date()),
      notes: notes.trim() || undefined,
    };

    for (const { key } of relevantParams) {
      const raw = values[key];
      if (raw && raw.trim() !== '') {
        reading[key] = parseFloat(raw);
      }
    }

    const hasAnyValue = relevantParams.some(({ key }) => values[key] && values[key]!.trim() !== '');
    if (!hasAnyValue) return;

    addReading(reading as Parameters<typeof addReading>[0]);
    setSubmitted(true);
    setTimeout(() => navigate(`/tanks/${tank.id}`), 800);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <BeakerIcon className="w-5 h-5 text-ocean-500" />
        <div>
          <h1 className="text-lg font-bold text-slate-900">Log Water Reading</h1>
          <p className="text-xs text-slate-400">{tank.emoji} {tank.name}</p>
        </div>
      </div>

      <div className="p-6">
        {submitted ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Reading Logged!</h2>
            <p className="text-slate-500">Checking parameter ranges and generating alerts...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="card">
              <p className="text-sm text-slate-500 mb-4">
                Fill in the parameters you tested. You don't need to enter all of them.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relevantParams.map(({ key, placeholder, step }) => {
                  const range = ranges[key];
                  return (
                    <div key={key}>
                      <label className="label">
                        {PARAMETER_LABELS[key] || key}
                        {range && (
                          <span className="text-slate-400 font-normal ml-1 text-xs">
                            ({range.min}–{range.max} {range.unit})
                          </span>
                        )}
                      </label>
                      <input
                        type="number"
                        step={step}
                        min={0}
                        placeholder={placeholder}
                        value={values[key] ?? ''}
                        onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                        className="input-field"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <label className="label">Notes (optional)</label>
              <textarea
                rows={3}
                placeholder="Any observations about your tank today..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className={clsx('btn-primary flex-1 justify-center', submitted && 'opacity-50 cursor-not-allowed')}
                disabled={submitted}
              >
                <BeakerIcon className="w-4 h-4" />
                Save Reading
              </button>
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
