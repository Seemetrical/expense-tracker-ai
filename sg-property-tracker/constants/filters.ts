export const PROPERTY_TYPES = [
  { value: 'Detached House', label: 'Detached' },
  { value: 'Semi-Detached House', label: 'Semi-Detached' },
  { value: 'Terrace House', label: 'Terrace' },
] as const;

export const TENURE_OPTIONS = [
  { value: 'Freehold', label: 'Freehold' },
  { value: '999yr', label: '999 Years' },
  { value: '99yr', label: '99 Years' },
  { value: 'Other', label: 'Other' },
] as const;

export const SALE_TYPE_OPTIONS = [
  { value: '1', label: 'New Sale' },
  { value: '2', label: 'Sub Sale' },
  { value: '3', label: 'Resale' },
] as const;

// Singapore districts 01–28
export const DISTRICTS = Array.from({ length: 28 }, (_, i) => {
  const d = String(i + 1).padStart(2, '0');
  return { value: d, label: `D${d}` };
});

export const PAGE_SIZE = 50;

// data.gov.sg URA Private Residential Property Transactions — Whole of Singapore
export const URA_DATASET_ID = 'd_7c69c943d5f0d89d6a9a773d2b51f337';

export const WATCHLIST_STORAGE_KEY = 'sg-property-watchlist';
export const SHEET_ID_STORAGE_KEY = 'sg-property-sheet-id';

// Google Sheet column headers (row 1)
export const SHEET_HEADERS = [
  'Address',
  'Postal Code',
  'Property Type',
  'Transaction Date',
  'Price (SGD)',
  'Area (sqft)',
  'Price PSF',
  'Tenure',
];
