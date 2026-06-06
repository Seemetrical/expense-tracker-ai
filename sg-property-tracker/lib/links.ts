// URA Space — works with SVY21 coords (pre-enrichment) or WGS84 (post-enrichment)
export function uraSpaceSVY21(x: string, y: string): string {
  return `https://www.ura.gov.sg/maps/?service=PLANNINGDECISION&x=${x}&y=${y}`;
}

export function uraSpaceLatLng(lat: number, lng: number): string {
  return `https://www.ura.gov.sg/maps/?service=PLANNINGDECISION&lat=${lat}&lng=${lng}&zoom=18`;
}

// Google Maps — drop a pin at the property
export function googleMaps(lat: number, lng: number): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function googleMapsAddress(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

// Google Street View
export function streetView(lat: number, lng: number): string {
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}&heading=0&pitch=0&fov=90`;
}
