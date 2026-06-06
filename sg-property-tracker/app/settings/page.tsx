'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSheets } from '@/hooks/useSheets';
import { useToast } from '@/app/providers';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { Suspense } from 'react';

function SettingsContent() {
  const { connected, sheetId, setSheetId, disconnect } = useSheets();
  const { addToast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('connected') === 'true') {
      addToast('Google account connected successfully', 'success');
    }
    if (searchParams.get('error')) {
      addToast('Google authentication failed. Please try again.', 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-lg font-semibold text-gray-900">Settings</h1>

      {/* Google Sheets Auth */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Google Sheets Integration</h2>
        <p className="text-xs text-gray-500 mb-4">
          Connect your Google account to sync watchlist items directly to a Google Sheet.
        </p>

        <div className="flex items-center gap-3 mb-4">
          {connected ? (
            <>
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-gray-700">Google account connected</span>
              <button
                onClick={disconnect}
                className="ml-auto text-xs text-red-500 hover:text-red-700 underline"
              >
                Disconnect
              </button>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-gray-300" />
              <span className="text-sm text-gray-500">Not connected</span>
              <a
                href="/api/sheets/auth"
                className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium"
              >
                Connect Google Account
              </a>
            </>
          )}
        </div>
      </div>

      {/* Sheet ID */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Google Sheet ID</h2>
        <p className="text-xs text-gray-500 mb-3">
          The ID from your sheet URL:{' '}
          <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
            docs.google.com/spreadsheets/d/<strong>[SHEET-ID]</strong>/edit
          </code>
        </p>
        <input
          type="text"
          value={sheetId}
          onChange={(e) => setSheetId(e.target.value)}
          placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
        />
        <p className="text-xs text-gray-400 mt-2">
          Row 1 in your sheet should have these headers:{' '}
          <span className="font-mono">Address | Postal Code | Property Type | Transaction Date | Price (SGD) | Area (sqft) | Price PSF | Tenure</span>
          {' '}(auto-created on first sync if missing).
        </p>
      </div>

      {/* Setup guide */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">First-time Setup</h2>
        <ol className="space-y-2 text-xs text-gray-600 list-decimal list-inside">
          <li>
            Go to{' '}
            <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-0.5">
              Google Cloud Console <ExternalLink className="w-3 h-3" />
            </a>
            {' '}→ create a project → enable <strong>Google Sheets API</strong>
          </li>
          <li>APIs & Services → Credentials → Create OAuth 2.0 Client ID (Web application)</li>
          <li>Add authorized redirect URI: <code className="bg-gray-100 px-1 rounded">http://localhost:3000/api/sheets/callback</code></li>
          <li>Copy Client ID and Client Secret into <code className="bg-gray-100 px-1 rounded">.env.local</code></li>
          <li>Generate ENCRYPTION_KEY: <code className="bg-gray-100 px-1 rounded">node -e &quot;console.log(require(&apos;crypto&apos;).randomBytes(32).toString(&apos;hex&apos;))&quot;</code></li>
          <li>Create a Google Sheet, paste the Sheet ID above, then click <strong>Connect Google Account</strong></li>
        </ol>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsContent />
    </Suspense>
  );
}
