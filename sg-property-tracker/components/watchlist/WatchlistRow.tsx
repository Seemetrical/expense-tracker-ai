'use client';

import { Trash2, Check, Clock, AlertCircle } from 'lucide-react';
import { WatchlistItem } from '@/types/property';
import { PropertyTypeBadge } from '@/components/property/PropertyTypeBadge';
import { TenureBadge } from '@/components/property/TenureBadge';
import { DeepLinkButtons } from '@/components/property/DeepLinkButtons';
import { formatPrice, formatPSF, formatArea, formatDate } from '@/utils/formatters';

interface Props {
  item: WatchlistItem;
  onRemove: (id: string) => void;
}

const syncIcons = {
  synced: <Check className="w-3 h-3 text-emerald-500" />,
  pending: <Clock className="w-3 h-3 text-amber-500" />,
  error: <AlertCircle className="w-3 h-3 text-red-400" />,
};

export function WatchlistRow({ item, onRemove }: Props) {
  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50 text-sm">
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900 text-xs">{item.fullAddress}</div>
        <div className="text-xs text-gray-400">D{item.district}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-600">{item.postalCode}</td>
      <td className="px-4 py-3 whitespace-nowrap"><PropertyTypeBadge type={item.propertyType} /></td>
      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{formatDate(item.transactionDate)}</td>
      <td className="px-4 py-3 whitespace-nowrap font-medium">{formatPrice(item.price)}</td>
      <td className="px-4 py-3 whitespace-nowrap text-gray-600">{formatArea(item.areaSqft)}</td>
      <td className="px-4 py-3 whitespace-nowrap text-gray-600">{formatPSF(item.psf)}</td>
      <td className="px-4 py-3 whitespace-nowrap"><TenureBadge normalized={item.tenure} /></td>
      <td className="px-4 py-3 whitespace-nowrap">
        <DeepLinkButtons item={item} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-center">
        {item.syncStatus ? syncIcons[item.syncStatus] : <Clock className="w-3 h-3 text-gray-300" />}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <button
          onClick={() => onRemove(item.id)}
          title="Remove from watchlist"
          className="text-gray-300 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
