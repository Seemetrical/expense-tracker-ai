import { NextRequest, NextResponse } from 'next/server';
import { enrichCoordinates } from '@/lib/onemap';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.x !== 'string' || typeof body.y !== 'string') {
    return NextResponse.json({ error: 'x and y are required strings' }, { status: 400 });
  }

  const x = parseFloat(body.x);
  const y = parseFloat(body.y);
  if (isNaN(x) || isNaN(y)) {
    return NextResponse.json({ error: 'x and y must be numeric' }, { status: 400 });
  }

  try {
    const result = await enrichCoordinates(x, y);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Enrichment failed';
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
