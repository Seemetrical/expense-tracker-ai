import { SignalLevel } from '@/utils/enblocSignal';

interface Props {
  level: SignalLevel;
  score?: number;
  size?: 'sm' | 'md';
}

const config: Record<SignalLevel, { label: string; bg: string; text: string; dot: string }> = {
  normal: { label: 'Normal', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  watch: { label: 'Watch', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  elevated: { label: 'Elevated', bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  alert: { label: 'Alert', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

export function SignalBadge({ level, score, size = 'sm' }: Props) {
  const c = config[level];
  const padding = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';
  const animate = level === 'alert' ? 'animate-pulse' : '';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${c.bg} ${c.text} ${padding}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${animate}`} />
      {c.label}
      {score !== undefined && <span className="opacity-70">· {score}</span>}
    </span>
  );
}
