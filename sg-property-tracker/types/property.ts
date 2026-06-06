export interface URATransaction {
  _id: number;
  street: string;
  project: string;
  contractDate: string; // "Mar25"
  area: string; // sqm as string
  price: string; // SGD as string
  propertyType: 'Detached House' | 'Semi-Detached House' | 'Terrace House';
  tenure: string;
  typeOfSale: '1' | '2' | '3'; // 1=New Sale, 2=Sub Sale, 3=Resale
  district: string;
  x: string; // SVY21 easting
  y: string; // SVY21 northing
}

export interface EnrichedLocation {
  lat: number;
  lng: number;
  fullAddress: string;
  postalCode: string;
}

export interface Property extends URATransaction {
  id: string; // `${street}-${contractDate}-${price}-${area}`
  areaSqft: number; // area (sqm) × 10.7639
  priceSgd: number;
  psf: number; // priceSgd / areaSqft
  contractDateParsed: string; // "YYYY-MM-01"
  tenureNormalized: 'Freehold' | '999yr' | '99yr' | 'Other';
  enrichment?: EnrichedLocation;
}

export interface WatchlistItem {
  id: string;
  fullAddress: string;
  postalCode: string;
  propertyType: Property['propertyType'];
  transactionDate: string; // "YYYY-MM-DD"
  price: number;
  areaSqft: number;
  psf: number;
  tenure: string;
  lat: number;
  lng: number;
  street: string;
  district: string;
  syncStatus?: 'pending' | 'synced' | 'error';
  addedAt: string;
}

export interface TransactionFilters {
  search: string;
  district: string;
  propertyType: string;
  tenure: string;
  typeOfSale: string;
  dateFrom: string; // "YYYY-MM"
  dateTo: string;
}

export type SortField = 'contractDate' | 'price' | 'area' | 'psf' | 'district' | 'propertyType';
export type SortOrder = 'asc' | 'desc';

export interface TransactionsApiResponse {
  records: Property[];
  total: number;
  offset: number;
}

export interface EnrichResponse {
  lat: number;
  lng: number;
  fullAddress: string | null;
  postalCode: string | null;
}

export interface SyncResponse {
  appended: number;
  range: string;
}
