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
            className="border border-charcoal/15 bg-white px-5 py-6"
          >
            <p className="text-xs font-semibold uppercase text-charcoal">{stat.label}</p>
            <p className="mt-2 font-display text-4xl text-charcoal">{stat.value}</p>
            {stat.total !== null && <p className="mt-1 text-xs font-semibold text-charcoal">+{stat.total} party size</p>}
          </motion.div>
        ))}
      </div>

      {/* Accepted RSVPs */}
      <div className="overflow-hidden border border-charcoal/15 bg-white">
        <div className="border-b border-charcoal/15 p-6 sm:p-8">
          <h2 className="font-display text-2xl text-charcoal">Accepted ({acceptedRsvps.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-charcoal/15">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-charcoal">Guest name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-charcoal">Party size</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-charcoal">Dietary restrictions</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-charcoal">Special requests</th>
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
                    <td className="px-6 py-4 text-sm font-medium text-charcoal">{guest?.name}</td>
                    <td className="px-6 py-4 text-sm text-charcoal">
                      <span className="border border-sage-dark/45 px-3 py-1 text-xs font-semibold uppercase text-sage-dark">
                        {rsvp.partySize} guest{rsvp.partySize > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-charcoal">{rsvp.dietaryRestrictions || '-'}</td>
                    <td className="px-6 py-4 text-sm text-charcoal">{rsvp.specialRequests || '-'}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Declined RSVPs */}
      {declinedRsvps.length > 0 && (
        <div className="overflow-hidden border border-charcoal/15 bg-white">
          <div className="border-b border-charcoal/15 p-6 sm:p-8">
            <h2 className="font-display text-2xl text-charcoal">Declined ({declinedRsvps.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-charcoal/15">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-charcoal">Guest name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-charcoal">Reason</th>
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
                      <td className="px-6 py-4 text-sm font-medium text-charcoal">{guest?.name}</td>
                      <td className="px-6 py-4 text-sm text-charcoal">{rsvp.specialRequests || '-'}</td>
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
        <div className="overflow-hidden border border-charcoal/15 bg-white">
          <div className="border-b border-charcoal/15 p-6 sm:p-8">
            <h2 className="font-display text-2xl text-charcoal">No response ({noResponseGuests.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-charcoal/15">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-charcoal">Guest name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-charcoal">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-charcoal">Status</th>
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
                    <td className="px-6 py-4 text-sm font-medium text-charcoal">{guest.name}</td>
                    <td className="px-6 py-4 text-sm text-charcoal">{guest.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="border border-gold/50 px-3 py-1 text-xs font-semibold uppercase text-sage-dark">
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
