import { Guest, EngagementEvent, EngagementConfig, RSVPResponse } from './types';
import { v4 as uuidv4 } from 'uuid';

type RSVPSubmission = Omit<RSVPResponse, 'id' | 'guestId'> & {
  guestId?: string;
  invitationToken?: string | null;
  guestName?: string;
};

async function apiRequest<T>(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(path, {
    ...init,
    cache: init.cache || 'no-store',
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = (await response.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      // Use the default message when the response is not JSON.
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

function jsonBody(body: unknown) {
  return JSON.stringify(body);
}

// Guest Management
export async function addGuest(guest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>) {
  const data = await apiRequest<{ id: string }>('/api/admin/data', {
    method: 'POST',
    body: jsonBody({ action: 'addGuest', guest }),
  });
  return data.id;
}

export async function getGuests() {
  const data = await apiRequest<{ guests: Guest[] }>('/api/admin/data?collection=guests');
  return data.guests;
}

export async function getGuestById(id: string) {
  const guests = await getGuests();
  return guests.find((guest) => guest.id === id);
}

export async function getGuestByToken(token: string) {
  if (!token) return undefined;
  const data = await apiRequest<{ guest: Guest | null }>(`/api/invite?token=${encodeURIComponent(token)}`);
  return data.guest || undefined;
}

export async function updateGuest(id: string, updates: Partial<Guest>) {
  await apiRequest<{ success: true }>('/api/admin/data', {
    method: 'POST',
    body: jsonBody({ action: 'updateGuest', id, updates }),
  });
}

export async function deleteGuest(id: string) {
  await apiRequest<{ success: true }>('/api/admin/data', {
    method: 'POST',
    body: jsonBody({ action: 'deleteGuest', id }),
  });
}

// Bulk operations
export async function bulkAddGuests(guests: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>[]) {
  const data = await apiRequest<{ ids: string[] }>('/api/admin/data', {
    method: 'POST',
    body: jsonBody({ action: 'bulkAddGuests', guests }),
  });
  return data.ids;
}

// RSVP Management
export async function recordRSVP(rsvp: RSVPSubmission) {
  const data = await apiRequest<{ id: string }>('/api/rsvp', {
    method: 'POST',
    body: jsonBody(rsvp),
  });
  return data.id;
}

export async function getRSVPs(eventId?: string) {
  const params = new URLSearchParams({ collection: 'rsvps' });
  if (eventId) params.set('eventId', eventId);
  const data = await apiRequest<{ rsvps: RSVPResponse[] }>(`/api/admin/data?${params.toString()}`);
  return data.rsvps;
}

export async function getGuestRSVP(guestId: string, eventId: string) {
  const params = new URLSearchParams({ collection: 'guestRsvp', guestId, eventId });
  const data = await apiRequest<{ rsvp: RSVPResponse | null }>(`/api/admin/data?${params.toString()}`);
  return data.rsvp || undefined;
}

// Event Management
export async function addEvent(event: Omit<EngagementEvent, 'id' | 'createdAt' | 'updatedAt'>) {
  const data = await apiRequest<{ id: string }>('/api/admin/data', {
    method: 'POST',
    body: jsonBody({ action: 'addEvent', event }),
  });
  return data.id;
}

export async function getEvents() {
  const data = await apiRequest<{ events: EngagementEvent[] }>('/api/admin/data?collection=events');
  return data.events;
}

export async function updateEvent(id: string, updates: Partial<EngagementEvent>) {
  await apiRequest<{ success: true }>('/api/admin/data', {
    method: 'POST',
    body: jsonBody({ action: 'updateEvent', id, updates }),
  });
}

// Engagement Config
export async function getEngagementConfig() {
  const data = await apiRequest<{ config: EngagementConfig | null }>('/api/config');
  return data.config || undefined;
}

export async function updateEngagementConfig(config: Partial<EngagementConfig>) {
  await apiRequest<{ config: EngagementConfig }>('/api/admin/data', {
    method: 'POST',
    body: jsonBody({ action: 'updateConfig', config }),
  });
}

// Generate invitation token
export function generateInvitationToken(): string {
  return uuidv4();
}
