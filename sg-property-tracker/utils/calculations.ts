export function sqmToSqft(sqm: number): number {
  return sqm * 10.7639;
}

export function computePSF(priceSgd: number, areaSqft: number): number {
  if (areaSqft <= 0) return 0;
  return priceSgd / areaSqft;
}

// Parses URA contract date string like "Mar25" → "2025-03-01"
export function parseContractDate(contractDate: string): string {
  const monthMap: Record<string, string> = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
  };
  const month = contractDate.slice(0, 3);
  const yearShort = contractDate.slice(3);
  const year = parseInt(yearShort, 10) >= 50 ? `19${yearShort}` : `20${yearShort}`;
  const mm = monthMap[month] ?? '01';
  return `${year}-${mm}-01`;
}

export function normalizeTenure(tenure: string): 'Freehold' | '999yr' | '99yr' | 'Other' {
  if (!tenure) return 'Other';
  const t = tenure.toLowerCase();
  if (t.includes('freehold')) return 'Freehold';
  if (t.startsWith('999')) return '999yr';
  if (t.startsWith('99')) return '99yr';
  return 'Other';
}
