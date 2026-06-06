import { Property } from '@/types/property';
import { formatPrice, formatPSF } from '@/utils/formatters';
import { uraSpaceSVY21 } from '@/lib/links';
import { ExternalLink } from 'lucide-react';

interface Props {
  transactions: Property[];
  referenceDate: Date;
}

const typeOfSaleLabel: Record<string, string> = {
  '1': 'New Sale',
  '2': 'Sub Sale',
  '3': 'Resale',
};

function monthsAgo(date: Date, ref: Date): number {
  return Math.round((ref.getTime() - date.getTime()) / (30 * 24 * 60 * 60 * 1000));
}

function parseDate(d: string): Date {
  const [y, m] = d.split('-').map(Number);
  return new Date(y, m - 1, 15);
}

export function TransactionTimeline({ transactions, referenceDate }: Props) {
  const sorted = [...transactions].sort(
    (a, b) => parseDate(b.contractDateParsed).getTime() - parseDate(a.contractDateParsed).getTime(),
  );

  return (
    <div className="space-y-1.5">
      {sorted.map((t) => {
        const ago = monthsAgo(parseDate(t.contractDateParsed), referenceDate);
        const isNew = t.typeOfSale === '1';
        return (
          <div key={t.id} className="flex items-center gap-3 text-xs py-1 border-b border-gray-50 last:border-0">
            <span className="w-16 text-gray-400 shrink-0">
              {ago === 0 ? 'This month' : `${ago}mo ago`}
            </span>
            <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${
              isNew ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {typeOfSaleLabel[t.typeOfSale] ?? t.typeOfSale}
            </span>
            <span className="flex-1 font-medium text-gray-800">{formatPrice(t.priceSgd)}</span>
            <span className="text-gray-500">{formatPSF(t.psf)}</span>
            {t.x && t.y && (
              <a
                href={uraSpaceSVY21(t.x, t.y)}
                target="_blank"
                rel="noopener noreferrer"
                title="View in URA Space"
                className="text-gray-300 hover:text-blue-500 shrink-0"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
