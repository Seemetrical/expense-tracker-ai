'use client';

import { useState } from 'react';
import { EnBlocSignal, SignalLevel } from '@/utils/enblocSignal';
import { RadarRow } from './RadarRow';

interface Props {
  signals: EnBlocSignal[];
}

const LEVELS: { value: '' | SignalLevel; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'alert', label: 'Alert' },
  { value: 'elevated', label: 'Elevated' },
  { value: 'watch', label: 'Watch' },
  { value: 'normal', label: 'Normal' },
];

export function RadarTable({ signals }: Props) {
  const [levelFilter, setLevelFilter] = useState<'' | SignalLevel>('');

  const filtered = levelFilter ? signals.filter((s) => s.level === levelFilter) : signals;

  if (!signals.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 flex items-center justify-center py-24 text-gray-400 text-sm">
        No streets with sufficient data yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Filter tabs */}
      <div className="flex items-center gap-1 px-4 py-3 border-b border-gray-100 bg-gray-50 overflow-x-auto">
        {LEVELS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setLevelFilter(value)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              levelFilter === value
                ? 'bg-gray-900 text-white'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            {label}
            {value && (
              <span className="ml-1 opacity-60">
                ({signals.filter((s) => s.level === value).length})
              </span>
            )}
            {!value && <span className="ml-1 opacity-60">({signals.length})</span>}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 w-8">#</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Street</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Signal</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent / Total</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">PSF Range</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">New Sale %</th>
              <th className="px-4 py-3 w-8" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((signal, i) => (
              <RadarRow key={signal.street} signal={signal} rank={i + 1} />
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          No streets at this signal level.
        </div>
      )}
    </div>
  );
}
