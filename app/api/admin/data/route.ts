import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, isValidSessionToken } from '@/lib/adminAuth';
import {
  createDocument,
  createInvitationToken,
  deleteDocument,
  listCollection,
  queryCollection,
  setDocument,
  updateDocument,
} from '@/lib/firebaseServer';
import { EngagementConfig, EngagementEvent, Guest, RSVPResponse } from '@/lib/types';

export const dynamic = 'force-dynamic';

type JsonRecord = Record<string, unknown>;

const EVENT_TYPES: EngagementEvent['type'][] = [
  'engagement_party',
  'mehendi',
  'baraat',
  'walima',
  'other',
];

function hasAdminSession(request: NextRequest) {
  try {
    return isValidSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
  } catch {
    return false;
  }
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function cleanString(value: unknown, maxLength = 500) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function requiredString(value: unknown, label: string, maxLength = 500) {
  const result = cleanString(value, maxLength);
  if (!result) throw new Error(`${label} is required`);
  return result;
}

function parseDate(value: unknown) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function clampInteger(value: unknown, min: number, max: number, fallback = min) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
}

function asRecord(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as JsonRecord) : {};
}

function sanitizeGuest(input: unknown) {
  const guest = asRecord(input);
  return {
    name: requiredString(guest.name, 'Guest name', 120),
    email: cleanString(guest.email, 200),
    phone: cleanString(guest.phone, 40),
    partySize: clampInteger(guest.partySize, 1, 2, 1),
    dietaryRestrictions: cleanString(guest.dietaryRestrictions, 300) || undefined,
    invitationToken: cleanString(guest.invitationToken, 120) || createInvitationToken(),
  };
}

function sanitizeGuestUpdates(input: unknown) {
  const guest = asRecord(input);
  const updates: JsonRecord = {};

  if ('name' in guest) updates.name = requiredString(guest.name, 'Guest name', 120);
  if ('email' in guest) updates.email = cleanString(guest.email, 200);
  if ('phone' in guest) updates.phone = cleanString(guest.phone, 40);
  if ('partySize' in guest) updates.partySize = clampInteger(guest.partySize, 1, 2, 1);
  if ('dietaryRestrictions' in guest) updates.dietaryRestrictions = cleanString(guest.dietaryRestrictions, 300);
  if ('invitationToken' in guest) updates.invitationToken = cleanString(guest.invitationToken, 120) || createInvitationToken();

  return updates;
}

function sanitizeEvent(input: unknown) {
  const event = asRecord(input);
  const date = parseDate(event.date);
  if (!date) throw new Error('Event date is required');

  const type = EVENT_TYPES.includes(event.type as EngagementEvent['type'])
    ? (event.type as EngagementEvent['type'])
    : 'other';

  return {
    title: requiredString(event.title, 'Event title', 140),
    description: cleanString(event.description, 1200),
    date,
    location: requiredString(event.location, 'Event location', 300),
    type,
    guestList: Array.isArray(event.guestList)
      ? event.guestList.map((id) => cleanString(id, 120)).filter(Boolean)
      : [],
  };
}

function sanitizeEventUpdates(input: unknown) {
  const event = asRecord(input);
  const updates: JsonRecord = {};

  if ('title' in event) updates.title = requiredString(event.title, 'Event title', 140);
  if ('description' in event) updates.description = cleanString(event.description, 1200);
  if ('date' in event) {
    const date = parseDate(event.date);
    if (!date) throw new Error('Event date is invalid');
    updates.date = date;
  }
  if ('location' in event) updates.location = requiredString(event.location, 'Event location', 300);
  if ('type' in event) {
    updates.type = EVENT_TYPES.includes(event.type as EngagementEvent['type'])
      ? event.type
      : 'other';
  }
  if ('guestList' in event) {
    updates.guestList = Array.isArray(event.guestList)
      ? event.guestList.map((id) => cleanString(id, 120)).filter(Boolean)
      : [];
  }

  return updates;
}

function sanitizeConfig(input: unknown) {
  const config = asRecord(input);
  const updates: JsonRecord = {};

  if ('coupleNames' in config) {
    const coupleNames = asRecord(config.coupleNames);
    updates.coupleNames = {
      groom: requiredString(coupleNames.groom, 'Groom name', 80),
      bride: requiredString(coupleNames.bride, 'Bride name', 80),
    };
  }

  if ('engagementDate' in config) {
    const engagementDate = parseDate(config.engagementDate);
    if (engagementDate) updates.engagementDate = engagementDate;
  }

  if ('story' in config) updates.story = cleanString(config.story, 3000);
  if ('photos' in config) {
    updates.photos = Array.isArray(config.photos)
      ? config.photos.map((photo) => cleanString(photo, 1000)).filter(Boolean)
      : [];
  }
  if ('primaryColor' in config) updates.primaryColor = cleanString(config.primaryColor, 20);
  if ('secondaryColor' in config) updates.secondaryColor = cleanString(config.secondaryColor, 20);
  if ('websiteUrl' in config) updates.websiteUrl = cleanString(config.websiteUrl, 1000);

  return updates;
}

async function readConfig() {
  const configs = await listCollection<EngagementConfig>('config');
  return configs[0] || null;
}

async function readRsvps(eventId?: string) {
  if (eventId) {
    return queryCollection<RSVPResponse>('rsvps', [{ field: 'eventId', value: eventId }], 1000);
  }

  return listCollection<RSVPResponse>('rsvps');
}

async function deleteGuestRsvps(guestId: string) {
  const rsvps = await listCollection<RSVPResponse>('rsvps');
  const matchingRsvps = rsvps.filter((rsvp) => rsvp.guestId === guestId);
  await Promise.all(matchingRsvps.map((rsvp) => deleteDocument('rsvps', rsvp.id)));
}

async function removeGuestFromEventLists(guestId: string, updatedAt: Date) {
  const events = await listCollection<EngagementEvent>('events');
  const eventsWithGuest = events.filter((event) => event.guestList?.includes(guestId));

  await Promise.all(
    eventsWithGuest.map((event) =>
      updateDocument<EngagementEvent>('events', event.id, {
        guestList: event.guestList.filter((id) => id !== guestId),
        updatedAt,
      })
    )
  );
}

export async function GET(request: NextRequest) {
  if (!hasAdminSession(request)) return jsonError('Unauthorized', 401);

  try {
    const collection = request.nextUrl.searchParams.get('collection') || 'all';

    if (collection === 'guests') {
      return NextResponse.json({ guests: await listCollection<Guest>('guests') });
    }

    if (collection === 'events') {
      return NextResponse.json({ events: await listCollection<EngagementEvent>('events') });
    }

    if (collection === 'rsvps') {
      return NextResponse.json({ rsvps: await readRsvps(request.nextUrl.searchParams.get('eventId') || undefined) });
    }

    if (collection === 'guestRsvp') {
      const guestId = request.nextUrl.searchParams.get('guestId') || '';
      const eventId = request.nextUrl.searchParams.get('eventId') || '';
      const rsvps = await listCollection<RSVPResponse>('rsvps');
      const rsvp = rsvps.find((item) => item.guestId === guestId && item.eventId === eventId) || null;
      return NextResponse.json({ rsvp });
    }

    if (collection === 'config') {
      return NextResponse.json({ config: await readConfig() });
    }

    if (collection === 'all') {
      const [guests, events, rsvps, config] = await Promise.all([
        listCollection<Guest>('guests'),
        listCollection<EngagementEvent>('events'),
        listCollection<RSVPResponse>('rsvps'),
        readConfig(),
      ]);
      return NextResponse.json({ guests, events, rsvps, config });
    }

    return jsonError('Unknown collection');
  } catch (error) {
    console.error('Admin data read failed:', error);
    return jsonError('Unable to load admin data', 500);
  }
}

export async function POST(request: NextRequest) {
  if (!hasAdminSession(request)) return jsonError('Unauthorized', 401);

  try {
    const body = (await request.json()) as JsonRecord;
    const action = cleanString(body.action, 80);
    const now = new Date();

    if (action === 'addGuest') {
      const guest = sanitizeGuest(body.guest);
      const created = await createDocument<Guest>('guests', { ...guest, createdAt: now, updatedAt: now });
      return NextResponse.json({ id: created.id });
    }

    if (action === 'bulkAddGuests') {
      if (!Array.isArray(body.guests)) return jsonError('Guests must be an array');
      const guests = body.guests.slice(0, 250).map(sanitizeGuest);
      const created = await Promise.all(
        guests.map((guest) => createDocument<Guest>('guests', { ...guest, createdAt: new Date(), updatedAt: new Date() }))
      );
      return NextResponse.json({ ids: created.map((guest) => guest.id) });
    }

    if (action === 'updateGuest') {
      const id = requiredString(body.id, 'Guest ID', 120);
      await updateDocument<Guest>('guests', id, { ...sanitizeGuestUpdates(body.updates), updatedAt: now });
      return NextResponse.json({ success: true });
    }

    if (action === 'deleteGuest') {
      const id = requiredString(body.id, 'Guest ID', 120);
      await Promise.all([
        deleteGuestRsvps(id),
        removeGuestFromEventLists(id, now),
      ]);
      await deleteDocument('guests', id);
      return NextResponse.json({ success: true });
    }

    if (action === 'addEvent') {
      const event = sanitizeEvent(body.event);
      const created = await createDocument<EngagementEvent>('events', { ...event, createdAt: now, updatedAt: now });
      return NextResponse.json({ id: created.id });
    }

    if (action === 'updateEvent') {
      const id = requiredString(body.id, 'Event ID', 120);
      await updateDocument<EngagementEvent>('events', id, { ...sanitizeEventUpdates(body.updates), updatedAt: now });
      return NextResponse.json({ success: true });
    }

    if (action === 'updateConfig') {
      const existing = await readConfig();
      const configId = existing?.id || 'main';
      const updated = await setDocument<EngagementConfig>('config', configId, {
        ...(existing || {}),
        ...sanitizeConfig(body.config),
        updatedAt: now,
      });
      return NextResponse.json({ config: updated });
    }

    if (action === 'rotateGuestToken') {
      const id = requiredString(body.id, 'Guest ID', 120);
      const invitationToken = randomUUID();
      await updateDocument<Guest>('guests', id, { invitationToken, updatedAt: now });
      return NextResponse.json({ invitationToken });
    }

    return jsonError('Unknown admin action');
  } catch (error) {
    console.error('Admin data write failed:', error);
    return jsonError(error instanceof Error ? error.message : 'Unable to update admin data', 500);
  }
}
