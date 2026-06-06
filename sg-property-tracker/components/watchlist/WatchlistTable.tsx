import { WatchlistItem } from '@/types/property';
import { WatchlistRow } from './WatchlistRow';
import { Bookmark } from 'lucide-react';

interface Props {
  items: WatchlistItem[];
  onRemove: (id: string) => void;
}

export function WatchlistTable({ items, onRemove }: Props) {
  if (!items.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center py-24 text-gray-400">
        <Bookmark className="w-8 h-8 mb-3 opacity-30" />
        <p className="text-sm">No saved properties yet.</p>
        <p className="text-xs mt-1">Enrich a transaction and click the bookmark icon to save it here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Postal</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Area</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">PSF</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenure</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Links</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Sync</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <WatchlistRow key={item.id} item={item} onRemove={onRemove} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
