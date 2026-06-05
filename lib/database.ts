import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  QueryConstraint,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { Guest, EngagementEvent, EngagementConfig, RSVPResponse } from './types';
import { v4 as uuidv4 } from 'uuid';

// Guest Management
export async function addGuest(guest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>) {
  const docRef = await addDoc(collection(db, 'guests'), {
    ...guest,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
}

export async function getGuests() {
  const snapshot = await getDocs(collection(db, 'guests'));
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Guest));
}

export async function getGuestById(id: string) {
  const docRef = doc(db, 'guests', id);
  const snapshot = await getDocs(query(collection(db, 'guests'), where('id', '==', id)));
  return snapshot.docs[0]?.data() as Guest | undefined;
}

export async function getGuestByToken(token: string) {
  const snapshot = await getDocs(
    query(collection(db, 'guests'), where('invitationToken', '==', token))
  );
  return snapshot.docs[0]?.data() as Guest | undefined;
}

export async function updateGuest(id: string, updates: Partial<Guest>) {
  const docRef = doc(db, 'guests', id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date(),
  });
}

export async function deleteGuest(id: string) {
  const docRef = doc(db, 'guests', id);
  await deleteDoc(docRef);
}

// Bulk operations
export async function bulkAddGuests(guests: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>[]) {
  const batch = writeBatch(db);
  const ids: string[] = [];

  guests.forEach(guest => {
    const docRef = doc(collection(db, 'guests'));
    ids.push(docRef.id);
    batch.set(docRef, {
      ...guest,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  await batch.commit();
  return ids;
}

// RSVP Management
export async function recordRSVP(rsvp: Omit<RSVPResponse, 'id'>) {
  const docRef = await addDoc(collection(db, 'rsvps'), {
    ...rsvp,
    respondedAt: new Date(),
  });
  return docRef.id;
}

export async function getRSVPs(eventId?: string) {
  let q: QueryConstraint[] = [];
  if (eventId) {
    q = [where('eventId', '==', eventId)];
  }
  const snapshot = await getDocs(
    q.length > 0 ? query(collection(db, 'rsvps'), ...q) : collection(db, 'rsvps')
  );
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as RSVPResponse));
}

export async function getGuestRSVP(guestId: string, eventId: string) {
  const snapshot = await getDocs(
    query(
      collection(db, 'rsvps'),
      where('guestId', '==', guestId),
      where('eventId', '==', eventId)
    )
  );
  return snapshot.docs[0]?.data() as RSVPResponse | undefined;
}

// Event Management
export async function addEvent(event: Omit<EngagementEvent, 'id' | 'createdAt' | 'updatedAt'>) {
  const docRef = await addDoc(collection(db, 'events'), {
    ...event,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return docRef.id;
}

export async function getEvents() {
  const snapshot = await getDocs(collection(db, 'events'));
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as EngagementEvent));
}

export async function updateEvent(id: string, updates: Partial<EngagementEvent>) {
  const docRef = doc(db, 'events', id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: new Date(),
  });
}

// Engagement Config
export async function getEngagementConfig() {
  const snapshot = await getDocs(collection(db, 'config'));
  return snapshot.docs[0]?.data() as EngagementConfig | undefined;
}

export async function updateEngagementConfig(config: Partial<EngagementConfig>) {
  const snapshot = await getDocs(collection(db, 'config'));
  const docRef = doc(db, 'config', snapshot.docs[0]?.id || 'main');

  if (snapshot.docs.length === 0) {
    await addDoc(collection(db, 'config'), {
      ...config,
      updatedAt: new Date(),
    });
  } else {
    await updateDoc(docRef, {
      ...config,
      updatedAt: new Date(),
    });
  }
}

// Generate invitation token
export function generateInvitationToken(): string {
  return uuidv4();
}
