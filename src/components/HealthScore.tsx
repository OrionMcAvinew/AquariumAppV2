import clsx from 'clsx';

interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

function getHealthColor(score: number) {
  if (score >= 90) return { ring: 'text-emerald-500', bg: 'bg-emerald-500', label: 'Excellent' };
  if (score >= 70) return { ring: 'text-teal-500', bg: 'bg-teal-500', label: 'Good' };
  if (score >= 50) return { ring: 'text-amber-500', bg: 'bg-amber-500', label: 'Fair' };
  return { ring: 'text-red-500', bg: 'bg-red-500', label: 'Poor' };
}

export default function HealthScore({ score, size = 'md' }: Props) {
  const { ring, label } = getHealthColor(score);
  const radius = size === 'lg' ? 40 : size === 'md' ? 30 : 20;
  const strokeWidth = size === 'lg' ? 6 : 4;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;
  const center = svgSize / 2;

  const textSize = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-sm';
  const labelSize = size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          {/* Score ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            className={ring}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={clsx('font-bold leading-none', textSize, ring)}>{score}</span>
        </div>
      </div>
      <span className={clsx('font-semibold', labelSize, ring)}>{label}</span>
    </div>
  );
}
