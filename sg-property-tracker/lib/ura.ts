import { URATransaction, Property } from '@/types/property';
import { sqmToSqft, computePSF, parseContractDate, normalizeTenure } from '@/utils/calculations';
import { URA_DATASET_ID } from '@/constants/filters';

const LANDED_TYPES = new Set(['Detached House', 'Semi-Detached House', 'Terrace House']);

export function buildURAUrl(offset = 0, limit = 500): string {
  const base = 'https://data.gov.sg/api/action/datastore_search';
  const params = new URLSearchParams({
    resource_id: URA_DATASET_ID,
    limit: String(limit),
    offset: String(offset),
  });
  return `${base}?${params}`;
}

export function normalizeTransaction(raw: URATransaction): Property | null {
  if (!LANDED_TYPES.has(raw.propertyType)) return null;

  const areaSqm = parseFloat(raw.area);
  const areaSqft = sqmToSqft(areaSqm);
  const priceSgd = parseFloat(raw.price);
  const contractDateParsed = parseContractDate(raw.contractDate);
  const tenureNormalized = normalizeTenure(raw.tenure);
  const psf = computePSF(priceSgd, areaSqft);
  const id = `${raw.street}-${raw.contractDate}-${raw.price}-${raw.area}`;

  return {
    ...raw,
    id,
    areaSqft,
    priceSgd,
    psf,
    contractDateParsed,
    tenureNormalized,
  };
}

interface DataGovResponse {
  success: boolean;
  result: {
    total: number;
    records: URATransaction[];
  };
}

export async function fetchURATransactions(offset = 0, limit = 500): Promise<{
  records: Property[];
  total: number;
  offset: number;
}> {
  const url = buildURAUrl(offset, limit);
  const headers: Record<string, string> = {};
  if (process.env.URA_API_KEY) {
    headers['Authorization'] = `Bearer ${process.env.URA_API_KEY}`;
  }

  const res = await fetch(url, {
    headers,
    next: { revalidate: 43200 },
  });

  if (!res.ok) {
    throw new Error(`URA API error: ${res.status} ${res.statusText}`);
  }

  const data: DataGovResponse = await res.json();
  const records = data.result.records
    .map(normalizeTransaction)
    .filter((r): r is Property => r !== null);

  return { records, total: data.result.total, offset };
}
