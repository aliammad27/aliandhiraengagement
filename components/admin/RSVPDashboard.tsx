'use client';

import { motion } from 'framer-motion';
import { RSVPResponse, Guest } from '@/lib/types';

interface Props {
  rsvps: RSVPResponse[];
  guests: Guest[];
}

function dateValue(value: unknown) {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'string' || typeof value === 'number') return new Date(value).getTime() || 0;
  if (typeof value === 'object' && 'seconds' in value && typeof value.seconds === 'number') {
    return value.seconds * 1000;
  }
  return 0;
}

function formatRespondedAt(value: unknown) {
  const timestamp = dateValue(value);
  if (!timestamp) return 'Submitted';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

export default function RSVPDashboard({ rsvps, guests }: Props) {
  const guestById = new Map(guests.map((guest) => [guest.id, guest]));
  const seenGuestIds = new Set<string>();
  const responses = [...rsvps]
    .sort((a, b) => dateValue(b.respondedAt) - dateValue(a.respondedAt))
    .filter((rsvp) => {
      if (seenGuestIds.has(rsvp.guestId)) return false;
      seenGuestIds.add(rsvp.guestId);
      return true;
    });

  const acceptedCount = responses.filter((rsvp) => rsvp.status === 'accepted').length;
  const declinedCount = responses.filter((rsvp) => rsvp.status === 'declined').length;
  const totalAttending = responses.reduce((sum, rsvp) => sum + (rsvp.status === 'accepted' ? Number(rsvp.partySize) || 0 : 0), 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-full space-y-6">
      <div className="border border-sage-dark/10 bg-ivory p-5 shadow-sm shadow-sage-deep/5 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-dark">RSVPs</p>
            <h2 className="mt-2 text-2xl font-semibold text-charcoal">Responses received</h2>
          </div>
          <p className="text-sm leading-6 text-charcoal-soft">Everyone who filled out the RSVP form.</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            { label: 'Responses', value: responses.length },
            { label: 'Accepted', value: acceptedCount },
            { label: 'Declined', value: declinedCount },
            { label: 'Attending', value: totalAttending },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.04 }}
              className="border border-sage-dark/10 bg-cream px-4 py-4"
            >
              <p className="text-xs font-semibold uppercase leading-4 tracking-[0.1em] text-charcoal-soft">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold text-charcoal">{stat.value}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="overflow-hidden border border-sage-dark/10 bg-ivory shadow-sm shadow-sage-deep/5">
        <div className="border-b border-sage-dark/10 px-5 py-4 sm:px-6">
          <h3 className="text-base font-semibold text-charcoal">Guest responses</h3>
        </div>

        {responses.length === 0 ? (
          <div className="px-5 py-12 text-center sm:px-6">
            <p className="text-sm leading-6 text-charcoal-soft">No one has filled out the RSVP yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-sage-dark/10">
            {responses.map((rsvp, index) => {
              const guest = guestById.get(rsvp.guestId);
              const name = guest?.name || 'Guest';
              const accepted = rsvp.status === 'accepted';
              const partySize = Math.max(0, Number(rsvp.partySize) || 0);

              return (
                <motion.li
                  key={rsvp.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="grid gap-4 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6"
                >
                  <div className="min-w-0">
                    <p className="break-words text-base font-semibold text-charcoal">{name}</p>
                    <p className="mt-1 text-sm text-charcoal-soft">{formatRespondedAt(rsvp.respondedAt)}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <span
                      className={`inline-flex min-h-8 items-center border px-3 text-xs font-semibold uppercase tracking-[0.08em] ${
                        accepted
                          ? 'border-sage-dark bg-sage-dark text-ivory'
                          : 'border-pink-deep/50 bg-pink-pale text-charcoal'
                      }`}
                    >
                      {accepted ? 'Accepted' : 'Declined'}
                    </span>
                    <span className="inline-flex min-h-8 items-center border border-sage-dark/15 bg-cream px-3 text-xs font-semibold uppercase tracking-[0.08em] text-charcoal">
                      {accepted ? `${partySize} guest${partySize === 1 ? '' : 's'}` : 'Not attending'}
                    </span>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
