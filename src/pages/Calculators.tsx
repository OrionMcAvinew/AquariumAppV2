import { useState, useMemo } from 'react';
import { useStore } from '../store';
import clsx from 'clsx';
import { CalculatorIcon, BeakerIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

type Tab = 'waterchange' | 'dosing' | 'saltmix';

// ─── Water Change Calculator ──────────────────────────────────────────────────
function WaterChangeCalc() {
  const tanks = useStore((s) => s.tanks);
  const getTankReadings = useStore((s) => s.getTankReadings);

  const [tankId, setTankId] = useState(tanks[0]?.id ?? '');
  const [volume, setVolume] = useState('');
  const [unit, setUnit] = useState<'gallons' | 'liters'>('gallons');
  const [currentNO3, setCurrentNO3] = useState('');
  const [targetNO3, setTargetNO3] = useState('');

  const selectedTank = tanks.find((t) => t.id === tankId);

  // Auto-fill from selected tank
  const fillFromTank = () => {
    if (!selectedTank) return;
    setVolume(String(selectedTank.volume));
    setUnit(selectedTank.volumeUnit);
    const readings = getTankReadings(selectedTank.id);
    const latest = readings.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];
    if (latest?.nitrate != null) setCurrentNO3(String(latest.nitrate));
  };

  const result = useMemo(() => {
    const vol = parseFloat(volume);
    const curr = parseFloat(currentNO3);
    const tgt = parseFloat(targetNO3);
    if (!vol || !curr || !tgt || tgt >= curr || vol <= 0) return null;

    const fraction = 1 - tgt / curr;
    const changeVol = vol * fraction;
    const pct = fraction * 100;

    // Convert for display
    const changeGal = unit === 'liters' ? changeVol / 3.785 : changeVol;
    const changeLit = unit === 'gallons' ? changeVol * 3.785 : changeVol;

    return {
      fraction,
      pct,
      changeGal: changeGal.toFixed(1),
      changeLit: changeLit.toFixed(1),
      changeVol: changeVol.toFixed(1),
      unit,
    };
  }, [volume, currentNO3, targetNO3, unit]);

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">
        Calculate how many gallons to remove and replace to hit a target nitrate level in a single water change.
      </p>

      {/* Tank quick-fill */}
      {tanks.length > 0 && (
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Auto-fill from tank</label>
            <select
              value={tankId}
              onChange={(e) => setTankId(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              {tanks.map((t) => (
                <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={fillFromTank}
            className="flex items-center gap-1.5 px-3 py-2 bg-ocean-500 text-white rounded-xl text-sm font-medium hover:bg-ocean-400 transition-colors shrink-0"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Fill
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Tank Volume</label>
          <div className="flex gap-1">
            <input
              type="number"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder="100"
              className="flex-1 border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as any)}
              className="border border-slate-300 rounded-xl px-2 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              <option value="gallons">gal</option>
              <option value="liters">L</option>
            </select>
          </div>
        </div>
        <div /> {/* spacer */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Current Nitrate (ppm)</label>
          <input
            type="number"
            value={currentNO3}
            onChange={(e) => setCurrentNO3(e.target.value)}
            placeholder="40"
            className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Target Nitrate (ppm)</label>
          <input
            type="number"
            value={targetNO3}
            onChange={(e) => setTargetNO3(e.target.value)}
            placeholder="10"
            className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
          />
        </div>
      </div>

      {result && (
        <div className="bg-ocean-50 border border-ocean-200 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-ocean-800">Result</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white rounded-xl p-3">
              <p className="text-2xl font-bold text-ocean-600">{result.changeGal}</p>
              <p className="text-xs text-slate-500 mt-0.5">gallons</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-2xl font-bold text-ocean-600">{result.changeLit}</p>
              <p className="text-xs text-slate-500 mt-0.5">liters</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-2xl font-bold text-ocean-600">{result.pct.toFixed(0)}%</p>
              <p className="text-xs text-slate-500 mt-0.5">water change</p>
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 rounded-full bg-ocean-500 transition-all"
              style={{ width: `${Math.min(result.fraction * 100, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">
            This assumes your replacement water has 0 ppm nitrate. Results represent a single water change.
          </p>
        </div>
      )}

      {parseFloat(targetNO3) >= parseFloat(currentNO3) && targetNO3 !== '' && currentNO3 !== '' && (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          Target must be lower than current nitrate level.
        </p>
      )}
    </div>
  );
}

// ─── Reef Dosing Calculator ───────────────────────────────────────────────────
interface DosingParam {
  label: string;
  key: 'ca' | 'alk' | 'mg';
  unit: string;
  ideal: string;
  supplement: string;
  supplementNote: string;
  // grams of dry supplement per 10 gallons to raise by 1 unit
  gramsPerTenGalPerUnit: number;
}

const DOSING_PARAMS: DosingParam[] = [
  {
    label: 'Calcium',
    key: 'ca',
    unit: 'ppm',
    ideal: '420',
    supplement: 'Calcium Chloride (CaCl₂)',
    supplementNote: 'Dissolve in 250mL RO/DI water before adding. Raise slowly — no more than 10–20 ppm per dose.',
    gramsPerTenGalPerUnit: 1.06,
  },
  {
    label: 'Alkalinity',
    key: 'alk',
    unit: 'dKH',
    ideal: '8.5',
    supplement: 'Baking Soda (NaHCO₃)',
    supplementNote: 'Dissolve in 250mL warm RO/DI water. Raise no more than 1–2 dKH per day. Soda ash (Na₂CO₃) raises alk without lowering pH — use ~0.67× the amount.',
    gramsPerTenGalPerUnit: 1.14,
  },
  {
    label: 'Magnesium',
    key: 'mg',
    unit: 'ppm',
    ideal: '1300',
    supplement: 'Epsom Salt (MgSO₄·7H₂O)',
    supplementNote: 'Dissolve in 500mL RO/DI water before dosing. Magnesium depletes slowly — check monthly. Do not over-dose.',
    gramsPerTenGalPerUnit: 3.9,
  },
];

function DosingCalc() {
  const tanks = useStore((s) => s.tanks);
  const getTankReadings = useStore((s) => s.getTankReadings);

  const reefTanks = tanks.filter((t) => t.type === 'reef' || t.type === 'saltwater');
  const [tankId, setTankId] = useState(reefTanks[0]?.id ?? '');
  const [volume, setVolume] = useState('');
  const [volUnit, setVolUnit] = useState<'gallons' | 'liters'>('gallons');
  const [vals, setVals] = useState<Record<string, { current: string; target: string }>>({
    ca: { current: '', target: '420' },
    alk: { current: '', target: '8.5' },
    mg: { current: '', target: '1300' },
  });

  const selectedTank = tanks.find((t) => t.id === tankId);

  const fillFromTank = () => {
    if (!selectedTank) return;
    setVolume(String(selectedTank.volume));
    setVolUnit(selectedTank.volumeUnit);
    const readings = getTankReadings(selectedTank.id).sort((a, b) =>
      b.timestamp.localeCompare(a.timestamp)
    );
    const latest = readings[0];
    if (!latest) return;
    setVals((prev) => ({
      ca: { ...prev.ca, current: latest.calcium != null ? String(latest.calcium) : prev.ca.current },
      alk: { ...prev.alk, current: latest.kh != null ? String(latest.kh) : prev.alk.current },
      mg: { ...prev.mg, current: latest.magnesium != null ? String(latest.magnesium) : prev.mg.current },
    }));
  };

  const volGal = useMemo(() => {
    const v = parseFloat(volume);
    if (!v) return 0;
    return volUnit === 'liters' ? v / 3.785 : v;
  }, [volume, volUnit]);

  const computeDose = (param: DosingParam) => {
    const cur = parseFloat(vals[param.key].current);
    const tgt = parseFloat(vals[param.key].target);
    if (!cur || !tgt || !volGal || tgt <= cur) return null;
    const delta = tgt - cur;
    const grams = delta * (volGal / 10) * param.gramsPerTenGalPerUnit;
    return { delta, grams };
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">
        Calculate how much dry supplement to add to reach target calcium, alkalinity, and magnesium levels.
      </p>

      {reefTanks.length === 0 ? (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-xl p-3">
          No reef or saltwater tanks found. Add a reef/saltwater tank to use this calculator.
        </p>
      ) : (
        <>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tank</label>
              <select
                value={tankId}
                onChange={(e) => setTankId(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ocean-500"
              >
                {reefTanks.map((t) => (
                  <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Volume</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  placeholder="75"
                  className="w-20 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                />
                <select
                  value={volUnit}
                  onChange={(e) => setVolUnit(e.target.value as any)}
                  className="border border-slate-300 rounded-xl px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ocean-500"
                >
                  <option value="gallons">gal</option>
                  <option value="liters">L</option>
                </select>
              </div>
            </div>
            <button
              onClick={fillFromTank}
              className="flex items-center gap-1.5 px-3 py-2 bg-ocean-500 text-white rounded-xl text-sm font-medium hover:bg-ocean-400 transition-colors shrink-0"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Fill
            </button>
          </div>

          <div className="space-y-4">
            {DOSING_PARAMS.map((param) => {
              const dose = computeDose(param);
              const cur = parseFloat(vals[param.key].current);
              const tgt = parseFloat(vals[param.key].target);
              const alreadyThere = cur >= tgt && cur > 0 && tgt > 0;
              return (
                <div key={param.key} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2.5 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-800">{param.label}</span>
                    <span className="text-xs text-slate-500">target: {param.ideal} {param.unit}</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                          Current ({param.unit})
                        </label>
                        <input
                          type="number"
                          value={vals[param.key].current}
                          onChange={(e) =>
                            setVals((v) => ({ ...v, [param.key]: { ...v[param.key], current: e.target.value } }))
                          }
                          placeholder={param.key === 'alk' ? '7.5' : param.key === 'ca' ? '380' : '1200'}
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">
                          Target ({param.unit})
                        </label>
                        <input
                          type="number"
                          value={vals[param.key].target}
                          onChange={(e) =>
                            setVals((v) => ({ ...v, [param.key]: { ...v[param.key], target: e.target.value } }))
                          }
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
                        />
                      </div>
                    </div>

                    {dose && volGal > 0 && (
                      <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 space-y-1">
                        <p className="text-sm font-bold text-teal-800">
                          Add <span className="text-teal-600">{dose.grams.toFixed(1)} g</span> of {param.supplement}
                        </p>
                        <p className="text-xs text-teal-600">{param.supplementNote}</p>
                      </div>
                    )}
                    {alreadyThere && (
                      <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                        ✓ Already at or above target — no dosing needed.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <strong>Disclaimer:</strong> These are approximations based on standard dry supplement purities. Always test your water 24 hours after dosing before adding more. When in doubt, dose conservatively.
          </p>
        </>
      )}
    </div>
  );
}

// ─── Salt Mix Calculator ──────────────────────────────────────────────────────
function SaltMixCalc() {
  const [volume, setVolume] = useState('');
  const [unit, setUnit] = useState<'gallons' | 'liters'>('gallons');
  const [targetSG, setTargetSG] = useState('1.025');
  const [saltBrand, setSaltBrand] = useState('generic');

  // Typical cups of salt per gallon to reach 1.025 SG varies by brand
  // Generic approximation: ~1/2 cup per gallon ≈ 120g per gallon at 1.025
  // More precise: about 35 g/L (35 ppt) for NSW-equivalent salinity
  // 1.025 SG ≈ 35 ppt salinity
  // At 1.024 SG ≈ 32 ppt, at 1.026 SG ≈ 36 ppt

  const SALT_RATIO = { generic: 35, instant: 34, red_sea: 35, reef_crystals: 35 };
  const BRANDS: { id: string; label: string }[] = [
    { id: 'generic', label: 'Generic / Tropic Marin' },
    { id: 'instant', label: 'Instant Ocean' },
    { id: 'red_sea', label: 'Red Sea Salt' },
    { id: 'reef_crystals', label: 'Reef Crystals' },
  ];

  const result = useMemo(() => {
    const vol = parseFloat(volume);
    const sg = parseFloat(targetSG);
    if (!vol || !sg) return null;

    // Salinity in ppt from SG (at 25°C): ppt ≈ (SG - 1) × 1000 × 1.291
    // More standard approximation: ppt ≈ 1.28 × (SG - 1) × 1000
    const ppt = (sg - 1) * 1280;

    const volLiters = unit === 'gallons' ? vol * 3.785 : vol;
    const volGallons = unit === 'liters' ? vol / 3.785 : vol;

    const grams = ppt * volLiters;
    const cups = grams / 240; // 1 cup ≈ 240g salt
    const lbs = grams / 453.6;
    const oz = grams / 28.35;

    return { grams: grams.toFixed(0), cups: cups.toFixed(1), lbs: lbs.toFixed(2), oz: oz.toFixed(1), ppt: ppt.toFixed(1), volLiters: volLiters.toFixed(1), volGallons: volGallons.toFixed(1) };
  }, [volume, unit, targetSG, saltBrand]);

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">
        How much dry salt mix to prepare a batch of saltwater at your target specific gravity.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Volume to prepare</label>
          <div className="flex gap-1">
            <input
              type="number"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              placeholder="20"
              className="flex-1 border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as any)}
              className="border border-slate-300 rounded-xl px-2 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ocean-500"
            >
              <option value="gallons">gal</option>
              <option value="liters">L</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Target SG</label>
          <input
            type="number"
            value={targetSG}
            onChange={(e) => setTargetSG(e.target.value)}
            step="0.001"
            placeholder="1.025"
            className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ocean-500"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1">Salt brand</label>
          <select
            value={saltBrand}
            onChange={(e) => setSaltBrand(e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ocean-500"
          >
            {BRANDS.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
          </select>
        </div>
      </div>

      {result && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
          <p className="text-sm font-semibold text-blue-800">
            For {result.volGallons} gal ({result.volLiters} L) at SG {targetSG} ({result.ppt} ppt)
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white rounded-xl p-3">
              <p className="text-2xl font-bold text-blue-600">{result.grams}</p>
              <p className="text-xs text-slate-500 mt-0.5">grams</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-2xl font-bold text-blue-600">{result.cups}</p>
              <p className="text-xs text-slate-500 mt-0.5">cups</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="text-2xl font-bold text-blue-600">{result.lbs}</p>
              <p className="text-xs text-slate-500 mt-0.5">lbs</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Mix salt into RO/DI water, aerate for 30–60 minutes, and verify SG with a refractometer or calibrated hydrometer before use.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string; emoji: string; desc: string }[] = [
  { id: 'waterchange', label: 'Water Change', emoji: '🚿', desc: 'Nitrate dilution' },
  { id: 'dosing', label: 'Reef Dosing', emoji: '🧪', desc: 'Ca / Alk / Mg' },
  { id: 'saltmix', label: 'Salt Mix', emoji: '🌊', desc: 'Prepare saltwater' },
];

export default function Calculators() {
  const [tab, setTab] = useState<Tab>('waterchange');

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
          <CalculatorIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Calculators</h1>
          <p className="text-sm text-slate-500">Practical tools for everyday tank maintenance</p>
        </div>
      </div>

      {/* Tab selector */}
      <div className="grid grid-cols-3 gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              'flex flex-col items-center gap-0.5 px-3 py-3 rounded-xl border text-sm font-medium transition-all',
              tab === t.id
                ? 'bg-teal-500 border-teal-500 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-600'
            )}
          >
            <span className="text-xl">{t.emoji}</span>
            <span className="font-semibold">{t.label}</span>
            <span className={clsx('text-xs', tab === t.id ? 'text-teal-100' : 'text-slate-400')}>{t.desc}</span>
          </button>
        ))}
      </div>

      {/* Active calculator */}
      <div className="card">
        {tab === 'waterchange' && <WaterChangeCalc />}
        {tab === 'dosing' && <DosingCalc />}
        {tab === 'saltmix' && <SaltMixCalc />}
      </div>
    </div>
  );
}
