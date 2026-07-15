import { NextRequest, NextResponse } from 'next/server';
import { queryCollection } from '@/lib/firebaseServer';
import { Guest } from '@/lib/types';

export const dynamic = 'force-dynamic';

function publicGuest(guest: Guest) {
  return {
    id: guest.id,
    name: guest.name,
    partySize: guest.partySize,
    invitationToken: guest.invitationToken,
    email: '',
    createdAt: guest.createdAt,
    updatedAt: guest.updatedAt,
  };
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')?.trim();

  if (!token) {
    return NextResponse.json({ guest: null });
  }

  try {
    const guests = await queryCollection<Guest>('guests', [{ field: 'invitationToken', value: token }], 1);
    return NextResponse.json({ guest: guests[0] ? publicGuest(guests[0]) : null });
  } catch (error) {
    console.error('Invitation lookup failed:', error);
    return NextResponse.json({ guest: null }, { status: 200 });
  }
}
