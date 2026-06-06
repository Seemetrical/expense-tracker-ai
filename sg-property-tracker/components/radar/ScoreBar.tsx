interface Props {
  label: string;
  value: number; // 0–100
  color: string; // tailwind bg class
  weight: string;
}

export function ScoreBar({ label, value, color, weight }: Props) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-24 text-gray-500 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
      <span className="w-8 text-right text-gray-400 shrink-0">{value}</span>
      <span className="w-8 text-right text-gray-300 shrink-0 text-[10px]">{weight}</span>
    </div>
  );
}
