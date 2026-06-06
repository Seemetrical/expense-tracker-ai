import { NextRequest, NextResponse } from 'next/server';
import { exchangeCode } from '@/lib/oauth';
import { encryptTokens } from '@/utils/session';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const csrfCookie = req.cookies.get('sg_pt_csrf')?.value;
  if (!code || !state || state !== csrfCookie) {
    return NextResponse.redirect(new URL('/settings?error=oauth_failed', req.nextUrl.origin));
  }

  try {
    const tokens = await exchangeCode(code);
    const encrypted = encryptTokens({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? '',
      expiresAt: Date.now() + tokens.expires_in * 1000,
    });

    const response = NextResponse.redirect(new URL('/settings?connected=true', req.nextUrl.origin));
    response.cookies.delete('sg_pt_csrf');
    response.cookies.set('sg_pt_tokens', encrypted, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.redirect(new URL('/settings?error=token_exchange_failed', req.nextUrl.origin));
  }
}
