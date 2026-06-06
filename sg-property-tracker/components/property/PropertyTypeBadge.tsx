interface Props {
  type: string;
}

const styles: Record<string, string> = {
  'Detached House': 'bg-emerald-100 text-emerald-800',
  'Semi-Detached House': 'bg-blue-100 text-blue-800',
  'Terrace House': 'bg-amber-100 text-amber-800',
};

const labels: Record<string, string> = {
  'Detached House': 'Detached',
  'Semi-Detached House': 'Semi-D',
  'Terrace House': 'Terrace',
};

export function PropertyTypeBadge({ type }: Props) {
  const style = styles[type] ?? 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style}`}>
      {labels[type] ?? type}
    </span>
  );
}
