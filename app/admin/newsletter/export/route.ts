import { NextResponse } from 'next/server';

import { getAuthContext } from '@/lib/auth';
import { listNewsletterSignups } from '@/lib/server/newsletter';

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
  const status = url.searchParams.get('status') ?? undefined;

  const signups = await listNewsletterSignups({
    search: search || undefined,
    status: status || undefined,
    limit: undefined
  });

  const header = [
    'id',
    'email',
    'status',
    'consent',
    'consent_at',
    'source_path',
    'double_opt_in_sent_at',
    'confirmed_at',
    'created_at',
    'updated_at'
  ]
    .map((value) => `"${value}"`)
    .join(',');

  const rows = signups
    .map((signup) =>
      [
        signup.id,
        signup.email,
        signup.status,
        signup.consent,
        signup.consentAt,
        signup.sourcePath,
        signup.doubleOptInSentAt,
        signup.confirmedAt,
        signup.createdAt,
        signup.updatedAt
      ]
        .map(escapeCsv)
        .join(',')
    )
    .join('\n');

  const csv = `${header}\n${rows}`;

  return new NextResponse(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="newsletter-signups-${Date.now()}.csv"`
    }
  });
}
