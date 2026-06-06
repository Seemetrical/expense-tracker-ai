interface Props {
  normalized: string;
}

const styles: Record<string, string> = {
  Freehold: 'bg-green-100 text-green-800',
  '999yr': 'bg-teal-100 text-teal-800',
  '99yr': 'bg-orange-100 text-orange-800',
  Other: 'bg-gray-100 text-gray-600',
};

export function TenureBadge({ normalized }: Props) {
  const style = styles[normalized] ?? styles.Other;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style}`}>
      {normalized}
    </span>
  );
}
