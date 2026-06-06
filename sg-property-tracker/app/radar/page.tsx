'use client';

import { useRadar } from '@/hooks/useRadar';
import { RadarTable } from '@/components/radar/RadarTable';
import { SignalBadge } from '@/components/radar/SignalBadge';
import { Spinner } from '@/components/ui/Spinner';
import { Radio } from 'lucide-react';
import { SignalLevel } from '@/utils/enblocSignal';

export default function RadarPage() {
  const { signals, counts, isLoading, error } = useRadar();

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-5 h-5 text-red-500" />
            <h1 className="text-lg font-semibold text-gray-900">En Bloc Radar</h1>
          </div>
          <p className="text-xs text-gray-500 max-w-xl">
            Automatically detects streets showing unusual transaction clustering — a pattern historically associated with developer en bloc accumulation. Scores combine activity surge vs historical baseline, PSF price convergence, and temporal clustering density.
          </p>
        </div>
        <div className="text-xs text-gray-400 text-right shrink-0 ml-4">
          <div>Source: URA via data.gov.sg</div>
          <div>Updated Tue & Fri</div>
        </div>
      </div>

      {/* Signal summary cards */}
      {!isLoading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { level: 'alert', count: counts.alert, desc: 'Active acquisition signal' },
            { level: 'elevated', count: counts.elevated, desc: 'Notable cluster forming' },
            { level: 'watch', count: counts.watch, desc: 'Slightly elevated activity' },
            { level: 'normal', count: counts.normal, desc: 'Baseline activity' },
          ].map(({ level, count, desc }) => (
            <div key={level} className="bg-white rounded-lg border border-gray-200 px-4 py-3">
              <SignalBadge level={level as SignalLevel} size="md" />
              <div className="mt-2 text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* How it works */}
      <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
        <strong>How signals are scored:</strong> Activity Surge (40%) — recent 90-day transaction rate vs street&apos;s 2-year baseline ·
        PSF Convergence (35%) — coefficient of variation in recent prices, low variance = developer fixing price ·
        Clustering (25%) — temporal density and New Sale proportion.
        Minimum 3 all-time transactions required.
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          Failed to load transaction data.
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Spinner className="w-6 h-6 text-blue-500" />
          <span className="ml-2 text-sm text-gray-500">Analysing {counts.total || '…'} streets…</span>
        </div>
      ) : (
        <RadarTable signals={signals} />
      )}
    </div>
  );
}
