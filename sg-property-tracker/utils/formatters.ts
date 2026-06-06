export function formatPrice(sgd: number): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    maximumFractionDigits: 0,
  }).format(sgd);
}

export function formatPSF(psf: number): string {
  return `$${Math.round(psf).toLocaleString('en-SG')} psf`;
}

export function formatArea(sqft: number): string {
  return `${Math.round(sqft).toLocaleString('en-SG')} sqft`;
}

export function formatDate(isoDate: string): string {
  if (!isoDate) return '—';
  const [year, month] = isoDate.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

export function formatSaleType(code: string): string {
  const map: Record<string, string> = { '1': 'New Sale', '2': 'Sub Sale', '3': 'Resale' };
  return map[code] ?? code;
}
