'use client';

import { motion } from 'framer-motion';
import { RSVPResponse, Guest } from '@/lib/types';

interface Props {
  rsvps: RSVPResponse[];
  guests: Guest[];
}

export default function RSVPDashboard({ rsvps, guests }: Props) {
  const acceptedRsvps = rsvps.filter(r => r.status === 'accepted');
  const declinedRsvps = rsvps.filter(r => r.status === 'declined');
  const noResponseGuests = guests.filter(g => !rsvps.find(r => r.guestId === g.id));

  const totalAcceptedParty = acceptedRsvps.reduce((sum, r) => sum + r.partySize, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'Accepted', value: acceptedRsvps.length, total: totalAcceptedParty },
          { label: 'Declined', value: declinedRsvps.length, total: null },
          { label: 'No response', value: noResponseGuests.length, total: null },
          { label: 'Total attendees', value: totalAcceptedParty, total: null },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="border border-charcoal/10 bg-white px-5 py-6"
          >
            <p className="text-xs font-medium uppercase text-charcoal-soft">{stat.label}</p>
            <p className="mt-2 font-display text-4xl">{stat.value}</p>
            {stat.total !== null && <p className="mt-1 text-xs text-charcoal-soft">+{stat.total} party size</p>}
          </motion.div>
        ))}
      </div>

      {/* Accepted RSVPs */}
      <div className="overflow-hidden border border-charcoal/10 bg-white">
        <div className="border-b border-charcoal/10 p-6 sm:p-8">
          <h2 className="font-display text-2xl">Accepted ({acceptedRsvps.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-charcoal/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-charcoal-soft">Guest name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-charcoal-soft">Party size</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-charcoal-soft">Dietary restrictions</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-charcoal-soft">Special requests</th>
              </tr>
            </thead>
            <tbody>
              {acceptedRsvps.map((rsvp, idx) => {
                const guest = guests.find(g => g.id === rsvp.guestId);
                return (
                  <motion.tr
                    key={rsvp.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-charcoal/10 hover:bg-cream/40"
                  >
                    <td className="px-6 py-4 text-sm font-medium">{guest?.name}</td>
                    <td className="px-6 py-4 text-sm text-charcoal-soft">
                      <span className="border border-sage-deep/30 px-3 py-1 text-xs uppercase text-sage-deep">
                        {rsvp.partySize} guest{rsvp.partySize > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal-soft">{rsvp.dietaryRestrictions || '-'}</td>
                    <td className="px-6 py-4 text-sm text-charcoal-soft">{rsvp.specialRequests || '-'}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Declined RSVPs */}
      {declinedRsvps.length > 0 && (
        <div className="overflow-hidden border border-charcoal/10 bg-white">
          <div className="border-b border-charcoal/10 p-6 sm:p-8">
            <h2 className="font-display text-2xl">Declined ({declinedRsvps.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-charcoal/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-charcoal-soft">Guest name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-charcoal-soft">Reason</th>
                </tr>
              </thead>
              <tbody>
                {declinedRsvps.map((rsvp, idx) => {
                  const guest = guests.find(g => g.id === rsvp.guestId);
                  return (
                    <motion.tr
                      key={rsvp.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-charcoal/10 hover:bg-cream/40"
                    >
                      <td className="px-6 py-4 text-sm font-medium">{guest?.name}</td>
                      <td className="px-6 py-4 text-sm text-charcoal-soft">{rsvp.specialRequests || '-'}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Response */}
      {noResponseGuests.length > 0 && (
        <div className="overflow-hidden border border-charcoal/10 bg-white">
          <div className="border-b border-charcoal/10 p-6 sm:p-8">
            <h2 className="font-display text-2xl">No response ({noResponseGuests.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-charcoal/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-charcoal-soft">Guest name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-charcoal-soft">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-charcoal-soft">Status</th>
                </tr>
              </thead>
              <tbody>
                {noResponseGuests.map((guest, idx) => (
                  <motion.tr
                    key={guest.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-charcoal/10 hover:bg-cream/40"
                  >
                    <td className="px-6 py-4 text-sm font-medium">{guest.name}</td>
                    <td className="px-6 py-4 text-sm text-charcoal-soft">{guest.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="border border-gold/40 px-3 py-1 text-xs uppercase text-sage-deep">
                        Pending
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
