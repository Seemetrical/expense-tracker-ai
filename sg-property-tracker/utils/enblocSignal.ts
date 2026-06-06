import { Property } from '@/types/property';

export type SignalLevel = 'normal' | 'watch' | 'elevated' | 'alert';

export interface EnBlocSignal {
  street: string;
  district: string;
  score: number;
  level: SignalLevel;
  // sub-scores (0–100 before weighting)
  surgeRaw: number;
  convergenceRaw: number;
  clusteringRaw: number;
  // context data
  allTimeCount: number;
  recentCount: number; // last 90 days
  recent180: Property[];
  recentTransactions: Property[]; // last 90 days
  meanPSF: number;
  psfCV: number; // coefficient of variation
  newSalePct: number; // fraction that are "New Sale"
  referenceDate: Date; // most recent txn date used as "now"
}

// Parse "YYYY-MM-01" → Date (use mid-month for accuracy)
function parseDate(d: string): Date {
  const [y, m] = d.split('-').map(Number);
  return new Date(y, m - 1, 15);
}

function std(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

export function computeSignal(transactions: Property[], referenceDate: Date): EnBlocSignal {
  const street = transactions[0].street;
  const district = transactions[0].district;

  const sorted = [...transactions].sort(
    (a, b) => parseDate(a.contractDateParsed).getTime() - parseDate(b.contractDateParsed).getTime(),
  );

  const refMs = referenceDate.getTime();
  const MS_90 = 90 * 24 * 60 * 60 * 1000;
  const MS_180 = 180 * 24 * 60 * 60 * 1000;
  const MS_24M = 2 * 365 * 24 * 60 * 60 * 1000;

  const recent90 = sorted.filter((t) => refMs - parseDate(t.contractDateParsed).getTime() <= MS_90);
  const recent180 = sorted.filter((t) => refMs - parseDate(t.contractDateParsed).getTime() <= MS_180);
  const baseline = sorted.filter(
    (t) => {
      const age = refMs - parseDate(t.contractDateParsed).getTime();
      return age > MS_180 && age <= MS_180 + MS_24M;
    },
  );

  // ── 1. Activity Surge (weight 40%) ─────────────────────────────────────────
  // Compare recent 90d count vs baseline monthly average × 3
  const baselineDays = Math.min(24 * 30, baseline.length > 0 ? 24 * 30 : 180);
  const baselinePer90 = baseline.length > 0
    ? (baseline.length / baselineDays) * 90
    : 0.5; // no history = treat as low baseline

  const surgeRatio = recent90.length / baselinePer90;
  let surgeRaw = 0;
  if (surgeRatio >= 1.5) surgeRaw = Math.min(100, 40 + (surgeRatio - 1.5) * 30);
  else if (surgeRatio >= 1.0) surgeRaw = surgeRatio * 26;
  // Minimum: need at least 2 recent transactions to score
  if (recent90.length < 2) surgeRaw = 0;

  // ── 2. Price Convergence (weight 35%) ───────────────────────────────────────
  const psfs = recent180.map((t) => t.psf).filter((p) => p > 0);
  let convergenceRaw = 0;
  let psfCV = 1;
  let meanPSF = 0;
  if (psfs.length >= 2) {
    meanPSF = psfs.reduce((a, b) => a + b, 0) / psfs.length;
    psfCV = meanPSF > 0 ? std(psfs) / meanPSF : 1;
    if (psfCV < 0.05) convergenceRaw = 100;
    else if (psfCV < 0.10) convergenceRaw = 80;
    else if (psfCV < 0.15) convergenceRaw = 55;
    else if (psfCV < 0.20) convergenceRaw = 30;
    else if (psfCV < 0.25) convergenceRaw = 10;
  }
  if (recent180.length < 2) convergenceRaw = 0;

  // ── 3. Clustering Density (weight 25%) ──────────────────────────────────────
  // New-sale percentage (developer involvement proxy)
  const newSalePct = recent90.length > 0
    ? recent90.filter((t) => t.typeOfSale === '1').length / recent90.length
    : 0;

  // Tightest 30-day window density
  let maxIn30d = 0;
  for (let i = 0; i < recent90.length; i++) {
    const anchor = parseDate(recent90[i].contractDateParsed).getTime();
    const inWindow = recent90.filter(
      (t) => Math.abs(parseDate(t.contractDateParsed).getTime() - anchor) <= 30 * 24 * 60 * 60 * 1000,
    ).length;
    maxIn30d = Math.max(maxIn30d, inWindow);
  }
  const temporalDensity = recent90.length > 0 ? maxIn30d / recent90.length : 0;
  const clusteringRaw = Math.min(100, newSalePct * 60 + temporalDensity * 40 * 100);

  // ── Composite score ──────────────────────────────────────────────────────────
  const score = Math.round(surgeRaw * 0.40 + convergenceRaw * 0.35 + clusteringRaw * 0.25);

  const level: SignalLevel =
    score >= 66 ? 'alert' :
    score >= 46 ? 'elevated' :
    score >= 21 ? 'watch' : 'normal';

  return {
    street,
    district,
    score,
    level,
    surgeRaw: Math.round(surgeRaw),
    convergenceRaw: Math.round(convergenceRaw),
    clusteringRaw: Math.round(clusteringRaw),
    allTimeCount: sorted.length,
    recentCount: recent90.length,
    recent180,
    recentTransactions: recent90,
    meanPSF,
    psfCV,
    newSalePct,
    referenceDate,
  };
}

export function buildRadar(allTransactions: Property[]): EnBlocSignal[] {
  if (!allTransactions.length) return [];

  // Use the most recent transaction date as "now" (handles stale data gracefully)
  const dates = allTransactions.map((t) => parseDate(t.contractDateParsed).getTime());
  const referenceDate = new Date(Math.max(...dates));

  // Group by street
  const byStreet = new Map<string, Property[]>();
  for (const t of allTransactions) {
    const existing = byStreet.get(t.street) ?? [];
    existing.push(t);
    byStreet.set(t.street, existing);
  }

  const signals: EnBlocSignal[] = [];
  for (const [, txns] of byStreet) {
    // Need at least 3 all-time transactions for meaningful baseline
    if (txns.length < 3) continue;
    // Need at least 1 recent transaction to be relevant
    const refMs = referenceDate.getTime();
    const MS_180 = 180 * 24 * 60 * 60 * 1000;
    const hasRecent = txns.some(
      (t) => refMs - parseDate(t.contractDateParsed).getTime() <= MS_180,
    );
    if (!hasRecent) continue;

    signals.push(computeSignal(txns, referenceDate));
  }

  // Sort: Alerts first, then by score descending
  return signals.sort((a, b) => b.score - a.score);
}
