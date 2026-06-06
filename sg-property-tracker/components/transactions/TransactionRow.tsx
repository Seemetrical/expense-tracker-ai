'use client';

import { BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { Property, EnrichResponse, WatchlistItem } from '@/types/property';
import { PropertyTypeBadge } from '@/components/property/PropertyTypeBadge';
import { TenureBadge } from '@/components/property/TenureBadge';
import { DeepLinkButtons } from '@/components/property/DeepLinkButtons';
import { EnrichButton } from './EnrichButton';
import { formatPrice, formatPSF, formatArea, formatDate, formatSaleType } from '@/utils/formatters';

type EnrichState = 'idle' | 'loading' | 'done' | 'error' | 'no-coords';

interface Props {
  property: Property;
  enrichState: EnrichState;
  enrichResult?: EnrichResponse;
  onEnrich: () => void;
  onAddWatchlist: (item: WatchlistItem) => void;
  isWatched: boolean;
}

export function TransactionRow({
  property,
  enrichState,
  enrichResult,
  onEnrich,
  onAddWatchlist,
  isWatched,
}: Props) {
  const enriched: Property = enrichResult
    ? {
        ...property,
        enrichment: {
          lat: enrichResult.lat,
          lng: enrichResult.lng,
          fullAddress: enrichResult.fullAddress ?? '',
          postalCode: enrichResult.postalCode ?? '',
        },
      }
    : property;

  function handleAdd() {
    if (!enrichResult) return;
    const item: WatchlistItem = {
      id: property.id,
      fullAddress: enrichResult.fullAddress ?? property.street,
      postalCode: enrichResult.postalCode ?? '',
      propertyType: property.propertyType,
      transactionDate: property.contractDateParsed,
      price: property.priceSgd,
      areaSqft: property.areaSqft,
      psf: property.psf,
      tenure: property.tenureNormalized,
      lat: enrichResult.lat,
      lng: enrichResult.lng,
      street: property.street,
      district: property.district,
      addedAt: new Date().toISOString(),
    };
    onAddWatchlist(item);
  }

  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50 text-sm">
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900">{property.street}</div>
        {property.project && (
          <div className="text-xs text-gray-400">{property.project}</div>
        )}
        {enrichResult?.fullAddress && (
          <div className="text-xs text-emerald-600 mt-0.5">{enrichResult.fullAddress}</div>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <PropertyTypeBadge type={property.propertyType} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-gray-700">{formatDate(property.contractDateParsed)}</td>
      <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{formatPrice(property.priceSgd)}</td>
      <td className="px-4 py-3 whitespace-nowrap text-gray-600">{formatArea(property.areaSqft)}</td>
      <td className="px-4 py-3 whitespace-nowrap text-gray-600">{formatPSF(property.psf)}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        <TenureBadge normalized={property.tenureNormalized} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-gray-500 text-xs">D{property.district}</td>
      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">{formatSaleType(property.typeOfSale)}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        <EnrichButton state={enrichState} onEnrich={onEnrich} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <DeepLinkButtons item={enriched} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <button
          onClick={handleAdd}
          disabled={isWatched || !enrichResult}
          title={!enrichResult ? 'Enrich first to add to watchlist' : isWatched ? 'Already in watchlist' : 'Add to watchlist'}
          className={`inline-flex items-center justify-center w-7 h-7 rounded transition-colors ${
            isWatched
              ? 'text-amber-500 cursor-default'
              : !enrichResult
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
          }`}
        >
          {isWatched ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
        </button>
      </td>
    </tr>
  );
}
