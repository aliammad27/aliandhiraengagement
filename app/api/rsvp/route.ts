import { NextRequest, NextResponse } from 'next/server';
import {
  createDocument,
  createInvitationToken,
  listCollection,
  queryCollection,
  updateDocument,
} from '@/lib/firebaseServer';
import { Guest, RSVPResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

type JsonRecord = Record<string, unknown>;

function cleanString(value: unknown, maxLength = 500) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function clampPartySize(value: unknown, max: number) {
  const partySize = Number(value);
  if (!Number.isFinite(partySize)) return 1;
  return Math.min(max, Math.max(1, Math.round(partySize)));
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

async function findExistingRsvp(guestId: string, eventId: string) {
  const rsvps = await listCollection<RSVPResponse>('rsvps');
  return rsvps.find((rsvp) => rsvp.guestId === guestId && rsvp.eventId === eventId) || null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as JsonRecord;
    const status = body.status === 'accepted' || body.status === 'declined' ? body.status : null;

    if (!status) {
      return jsonError('Please choose whether you can attend');
    }

    const invitationToken = cleanString(body.invitationToken, 120);
    const eventId = cleanString(body.eventId, 120) || 'main';
    let guest: Guest | null = null;

    if (invitationToken) {
      const guests = await queryCollection<Guest>('guests', [{ field: 'invitationToken', value: invitationToken }], 1);
      guest = guests[0] || null;

      if (!guest) {
        return jsonError('Invitation link was not found', 404);
      }
    }

    if (!guest) {
      const name = cleanString(body.guestName || body.name, 120);
      if (!name) return jsonError('Please tell us your name');

      const partySize = clampPartySize(body.partySize, 2);
      guest = await createDocument<Guest>('guests', {
        name,
        email: '',
        phone: '',
        partySize,
        invitationToken: createInvitationToken(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const maxPartySize = invitationToken ? Math.max(1, Number(guest.partySize) || 1) : 2;
    const requestedPartySize = clampPartySize(body.partySize, maxPartySize);

    if (status === 'accepted' && Number(body.partySize) > maxPartySize) {
      return jsonError('Party size is larger than this invitation allows');
    }

    const rsvpData = {
      guestId: guest.id,
      eventId,
      status,
      partySize: status === 'accepted' ? requestedPartySize : 0,
      dietaryRestrictions: cleanString(body.dietaryRestrictions, 300) || undefined,
      specialRequests: cleanString(body.specialRequests, 500) || undefined,
      respondedAt: new Date(),
    };

    const existing = await findExistingRsvp(guest.id, eventId);
    const saved = existing
      ? await updateDocument<RSVPResponse>('rsvps', existing.id, rsvpData)
      : await createDocument<RSVPResponse>('rsvps', rsvpData);

    await updateDocument<Guest>('guests', guest.id, {
      rsvpStatus: status,
      updatedAt: new Date(),
    });

    return NextResponse.json({ id: saved.id, success: true });
  } catch (error) {
    console.error('RSVP submission failed:', error);
    return jsonError('Something went wrong. Please try again.', 500);
  }
}
