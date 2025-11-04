import { NextResponse } from 'next/server';

import { getAuthContext } from '@/lib/auth';
import { listContactMessages } from '@/lib/server/contactMessages';

function escapeCsv(value: string | boolean | null | undefined) {
  if (value === null || value === undefined) return '';
  const stringValue = typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const { role } = await getAuthContext();
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const url = new URL(request.url);
  const search = url.searchParams.get('search') ?? undefined;

  const messages = await listContactMessages({
    search: search || undefined,
    limit: undefined
  });

  const header = [
    'id',
    'full_name',
    'email',
    'message',
    'consent',
    'consent_at',
    'origin_path',
    'user_agent',
    'created_at',
    'updated_at'
  ]
    .map((value) => `"${value}"`)
    .join(',');

  const rows = messages
    .map((message) =>
      [
        message.id,
        message.fullName,
        message.email,
        message.message,
        message.consent,
        message.consentAt,
        message.originPath,
        message.userAgent,
        message.createdAt,
        message.updatedAt
      ]
        .map(escapeCsv)
        .join(',')
    )
    .join('\n');

  const csv = `${header}\n${rows}`;

  return new NextResponse(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="contact-messages-${Date.now()}.csv"`
    }
  });
}
