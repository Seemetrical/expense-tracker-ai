interface ConvertResponse {
  latitude: string;
  longitude: string;
}

interface RevGeocodeResult {
  BUILDINGNAME: string;
  BLOCK: string;
  ROAD: string;
  POSTALCODE: string;
}

interface RevGeocodeResponse {
  GeocodeInfo: RevGeocodeResult[];
}

export async function svy21ToWgs84(x: number, y: number): Promise<{ lat: number; lng: number }> {
  const url = `https://www.onemap.gov.sg/api/common/convert/3414to4326?X=${x}&Y=${y}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OneMap convert error: ${res.status}`);
  const data: ConvertResponse = await res.json();
  return { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) };
}

async function revGeocode(lat: number, lng: number, buffer: number): Promise<RevGeocodeResult | null> {
  const url = `https://www.onemap.gov.sg/api/public/revgeocode?location=${lat},${lng}&buffer=${buffer}&addressType=All`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data: RevGeocodeResponse = await res.json();
  return data.GeocodeInfo?.[0] ?? null;
}

export function assembleAddress(result: RevGeocodeResult): { fullAddress: string; postalCode: string } {
  const { BUILDINGNAME, BLOCK, ROAD, POSTALCODE } = result;
  const block = BLOCK?.trim();
  const road = ROAD?.trim();
  const postal = POSTALCODE?.trim();
  const building = BUILDINGNAME?.trim();

  const streetPart = block ? `${block} ${road}` : road;
  const addressLine = building && building !== 'NIL'
    ? `${building}, ${streetPart}, SINGAPORE ${postal}`
    : `${streetPart}, SINGAPORE ${postal}`;

  return { fullAddress: addressLine, postalCode: postal };
}

export async function enrichCoordinates(x: number, y: number): Promise<{
  lat: number;
  lng: number;
  fullAddress: string | null;
  postalCode: string | null;
}> {
  const { lat, lng } = await svy21ToWgs84(x, y);

  let result = await revGeocode(lat, lng, 40);
  if (!result) {
    result = await revGeocode(lat, lng, 80);
  }

  if (!result) {
    return { lat, lng, fullAddress: null, postalCode: null };
  }

  const { fullAddress, postalCode } = assembleAddress(result);
  return { lat, lng, fullAddress, postalCode };
}
