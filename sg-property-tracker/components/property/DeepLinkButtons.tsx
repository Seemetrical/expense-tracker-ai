import { Map, MapPin, Camera } from 'lucide-react';
import { uraSpaceSVY21, uraSpaceLatLng, googleMaps, streetView } from '@/lib/links';
import { Property, WatchlistItem } from '@/types/property';

interface Props {
  item: Property | WatchlistItem;
}

function IconLink({
  href,
  title,
  icon,
  disabled,
}: {
  href?: string;
  title: string;
  icon: React.ReactNode;
  disabled?: boolean;
}) {
  if (disabled || !href) {
    return (
      <span
        title={title}
        className="inline-flex items-center justify-center w-7 h-7 rounded text-gray-300 cursor-not-allowed"
      >
        {icon}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className="inline-flex items-center justify-center w-7 h-7 rounded text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
    >
      {icon}
    </a>
  );
}

export function DeepLinkButtons({ item }: Props) {
  const hasEnrichment = 'enrichment' in item
    ? !!item.enrichment
    : true; // WatchlistItem always has lat/lng

  const lat = 'enrichment' in item ? item.enrichment?.lat : (item as WatchlistItem).lat;
  const lng = 'enrichment' in item ? item.enrichment?.lng : (item as WatchlistItem).lng;
  const x = 'x' in item ? item.x : undefined;
  const y = 'y' in item ? item.y : undefined;

  const uraHref = hasEnrichment && lat && lng
    ? uraSpaceLatLng(lat, lng)
    : x && y
    ? uraSpaceSVY21(x, y)
    : undefined;

  const mapsHref = hasEnrichment && lat && lng ? googleMaps(lat, lng) : undefined;
  const svHref = hasEnrichment && lat && lng ? streetView(lat, lng) : undefined;

  return (
    <div className="flex items-center gap-0.5">
      <IconLink href={uraHref} title="URA Space — Planning Decisions" icon={<Map className="w-4 h-4" />} />
      <IconLink href={mapsHref} title="Google Maps" icon={<MapPin className="w-4 h-4" />} disabled={!mapsHref} />
      <IconLink href={svHref} title="Street View" icon={<Camera className="w-4 h-4" />} disabled={!svHref} />
    </div>
  );
}
