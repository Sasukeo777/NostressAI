import { NextResponse } from 'next/server';
import { listMembers } from '@/lib/server/members';

export async function GET() {
  const members = await listMembers();
  const premiumMembers = members.filter((member) => member.plan === 'plus');

  const header = ['email', 'display_name', 'favorite_pillars', 'updated_at'];
  const rows = premiumMembers.map((member) => [
    member.email,
    member.displayName ?? '',
    member.favoritePillars.join('|'),
    member.updatedAt
  ]);

  const csv = [header, ...rows]
    .map((cols) => cols.map((col) => `"${String(col).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="nostress-plus-members-${Date.now()}.csv"`
    }
  });
}
