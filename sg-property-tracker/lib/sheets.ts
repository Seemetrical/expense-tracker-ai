import { WatchlistItem } from '@/types/property';
import { SHEET_HEADERS } from '@/constants/filters';

function itemToRow(item: WatchlistItem): (string | number)[] {
  return [
    item.fullAddress,
    item.postalCode,
    item.propertyType,
    item.transactionDate,
    item.price,
    Math.round(item.areaSqft),
    Math.round(item.psf),
    item.tenure,
  ];
}

export async function appendToSheet(
  sheetId: string,
  accessToken: string,
  items: WatchlistItem[],
): Promise<{ appended: number; range: string }> {
  const values = items.map(itemToRow);

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/A1:H1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Sheets API error: ${err}`);
  }

  const data = await res.json();
  return {
    appended: data.updates?.updatedRows ?? items.length,
    range: data.updates?.updatedRange ?? '',
  };
}

export async function ensureHeaders(
  sheetId: string,
  accessToken: string,
): Promise<void> {
  // Read A1 to check if headers exist
  const checkUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/A1:H1`;
  const checkRes = await fetch(checkUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!checkRes.ok) return;
  const checkData = await checkRes.json();
  const existingRow: string[] = checkData.values?.[0] ?? [];

  if (existingRow[0] === 'Address') return; // headers already present

  // Write headers into row 1
  const writeUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/A1:H1?valueInputOption=RAW`;
  await fetch(writeUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: [SHEET_HEADERS] }),
  });
}
