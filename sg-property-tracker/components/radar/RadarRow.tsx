'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { EnBlocSignal } from '@/utils/enblocSignal';
import { SignalBadge } from './SignalBadge';
import { ScoreBar } from './ScoreBar';
import { TransactionTimeline } from './TransactionTimeline';
import { formatPSF } from '@/utils/formatters';

interface Props {
  signal: EnBlocSignal;
  rank: number;
}

export function RadarRow({ signal, rank }: Props) {
  const [expanded, setExpanded] = useState(false);

  const psfRange = signal.recent180.length >= 2
    ? (() => {
        const psfs = signal.recent180.map((t) => t.psf);
        return `${formatPSF(Math.min(...psfs))} – ${formatPSF(Math.max(...psfs))}`;
      })()
    : signal.meanPSF > 0 ? formatPSF(signal.meanPSF) : '—';

  const newSaleFlag = signal.newSalePct > 0.3;

  return (
    <>
      <tr
        className={`border-t border-gray-100 text-sm cursor-pointer ${
          expanded ? 'bg-gray-50' : 'hover:bg-gray-50'
        }`}
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="px-4 py-3 text-gray-400 text-xs w-8">{rank}</td>
        <td className="px-4 py-3">
          <div className="font-medium text-gray-900">{signal.street}</div>
          <div className="text-xs text-gray-400">D{signal.district}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <SignalBadge level={signal.level} score={signal.score} />
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          <span className={`text-sm font-semibold ${
            signal.recentCount >= 3 ? 'text-red-600' :
            signal.recentCount >= 2 ? 'text-orange-600' : 'text-gray-700'
          }`}>
            {signal.recentCount}
          </span>
          <span className="text-xs text-gray-400 ml-1">/ {signal.allTimeCount}</span>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-gray-600 text-xs">{psfRange}</td>
        <td className="px-4 py-3 whitespace-nowrap text-center">
          {newSaleFlag ? (
            <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">
              {Math.round(signal.newSalePct * 100)}%
            </span>
          ) : (
            <span className="text-xs text-gray-400">
              {signal.newSalePct > 0 ? `${Math.round(signal.newSalePct * 100)}%` : '—'}
            </span>
          )}
        </td>
        <td className="px-4 py-3 text-gray-400">
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </td>
      </tr>

      {expanded && (
        <tr className="bg-gray-50 border-t-0">
          <td colSpan={7} className="px-6 pb-5 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Score breakdown */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Signal Breakdown
                </h4>
                <div className="space-y-2">
                  <ScoreBar label="Activity Surge" value={signal.surgeRaw} color="bg-blue-400" weight="×0.40" />
                  <ScoreBar label="PSF Convergence" value={signal.convergenceRaw} color="bg-purple-400" weight="×0.35" />
                  <ScoreBar label="Clustering" value={signal.clusteringRaw} color="bg-orange-400" weight="×0.25" />
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                  <span>PSF coefficient of variation</span>
                  <span className="font-mono">
                    {signal.psfCV < 1 ? `${(signal.psfCV * 100).toFixed(1)}%` : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                  <span>New Sale transactions</span>
                  <span className="font-mono">
                    {signal.recent180.filter((t) => t.typeOfSale === '1').length} / {signal.recent180.length}
                  </span>
                </div>
              </div>

              {/* Transaction timeline */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Recent Transactions (last 180 days)
                </h4>
                {signal.recent180.length > 0 ? (
                  <TransactionTimeline
                    transactions={signal.recent180}
                    referenceDate={signal.referenceDate}
                  />
                ) : (
                  <p className="text-xs text-gray-400">No recent transactions in window.</p>
                )}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="mt-4 text-[10px] text-gray-400 italic">
              En bloc signals are derived from publicly available URA transaction patterns only. High scores indicate unusual clustering activity — not confirmation of any collective sale attempt.
            </p>
          </td>
        </tr>
      )}
    </>
  );
}
