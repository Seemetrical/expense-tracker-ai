import { NextRequest, NextResponse } from 'next/server';
import { decryptTokens, encryptTokens } from '@/utils/session';
import { refreshAccessToken } from '@/lib/oauth';
import { appendToSheet, ensureHeaders } from '@/lib/sheets';
import { WatchlistItem } from '@/types/property';

export async function POST(req: NextRequest) {
  const tokenCookie = req.cookies.get('sg_pt_tokens')?.value;
  if (!tokenCookie) {
    return NextResponse.json({ error: 'Not authenticated with Google' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.sheetId || !Array.isArray(body.items)) {
    return NextResponse.json({ error: 'sheetId and items are required' }, { status: 400 });
  }

  let payload = decryptTokens(tokenCookie);

  // Refresh token if near expiry
  let tokenUpdated = false;
  if (payload.expiresAt - Date.now() < 60_000) {
    const refreshed = await refreshAccessToken(payload.refreshToken);
    payload = { ...payload, ...refreshed };
    tokenUpdated = true;
  }

  try {
    await ensureHeaders(body.sheetId, payload.accessToken);
    const result = await appendToSheet(body.sheetId, payload.accessToken, body.items as WatchlistItem[]);

    const response = NextResponse.json(result);

    if (tokenUpdated) {
      response.cookies.set('sg_pt_tokens', encryptTokens(payload), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      });
    }

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sync failed';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ disconnected: true });
  response.cookies.delete('sg_pt_tokens');
  return response;
}

// Check if connected
export async function GET(req: NextRequest) {
  const tokenCookie = req.cookies.get('sg_pt_tokens')?.value;
  if (!tokenCookie) {
    return NextResponse.json({ connected: false });
  }
  try {
    const payload = decryptTokens(tokenCookie);
    return NextResponse.json({ connected: true, expiresAt: payload.expiresAt });
  } catch {
    return NextResponse.json({ connected: false });
  }
}
