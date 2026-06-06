import { NextRequest, NextResponse } from 'next/server';
import { fetchURATransactions } from '@/lib/ura';
import { Property } from '@/types/property';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const offset = parseInt(searchParams.get('offset') ?? '0', 10);
  const limit = parseInt(searchParams.get('limit') ?? '500', 10);
  const district = searchParams.get('district') ?? '';
  const propertyType = searchParams.get('propertyType') ?? '';
  const dateFrom = searchParams.get('dateFrom') ?? ''; // "YYYY-MM"
  const dateTo = searchParams.get('dateTo') ?? '';

  try {
    const { records, total } = await fetchURATransactions(offset, limit);

    let filtered: Property[] = records;

    if (district) {
      filtered = filtered.filter((r) => r.district === district);
    }
    if (propertyType) {
      filtered = filtered.filter((r) => r.propertyType === propertyType);
    }
    if (dateFrom) {
      filtered = filtered.filter((r) => r.contractDateParsed >= `${dateFrom}-01`);
    }
    if (dateTo) {
      filtered = filtered.filter((r) => r.contractDateParsed <= `${dateTo}-31`);
    }

    return NextResponse.json({ records: filtered, total, offset });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
