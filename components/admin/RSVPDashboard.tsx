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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-full space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
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
            className="border border-gold/30 bg-ivory px-4 py-5 shadow-sm shadow-sage-deep/5 sm:px-5 sm:py-6"
          >
            <p className="text-xs font-semibold uppercase leading-4 text-sage-dark">{stat.label}</p>
            <p className="mt-2 font-display text-3xl text-charcoal sm:text-4xl">{stat.value}</p>
            {stat.total !== null && <p className="mt-1 text-xs font-semibold leading-5 text-charcoal">+{stat.total} party size</p>}
          </motion.div>
        ))}
      </div>

      {/* Accepted RSVPs */}
      <div className="overflow-hidden border border-gold/30 bg-ivory shadow-sm shadow-sage-deep/5">
        <div className="border-b border-gold/25 p-5 sm:p-8">
          <h2 className="font-display text-2xl text-sage-dark">Accepted ({acceptedRsvps.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="border-b border-gold/25 bg-cream">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-sage-dark sm:px-6">Guest name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-sage-dark sm:px-6">Party size</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-sage-dark sm:px-6">Dietary restrictions</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-sage-dark sm:px-6">Special requests</th>
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
                    className="border-b border-charcoal/10 hover:bg-pink-pale/35"
                  >
                    <td className="break-words px-4 py-4 text-sm font-medium text-charcoal sm:px-6">{guest?.name}</td>
                    <td className="px-4 py-4 text-sm text-charcoal sm:px-6">
                      <span className="whitespace-nowrap border border-sage-dark/45 px-3 py-1 text-xs font-semibold uppercase text-sage-dark">
                        {rsvp.partySize} guest{rsvp.partySize > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="break-words px-4 py-4 text-sm text-charcoal sm:px-6">{rsvp.dietaryRestrictions || '-'}</td>
                    <td className="break-words px-4 py-4 text-sm text-charcoal sm:px-6">{rsvp.specialRequests || '-'}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Declined RSVPs */}
      {declinedRsvps.length > 0 && (
        <div className="overflow-hidden border border-gold/30 bg-ivory shadow-sm shadow-sage-deep/5">
          <div className="border-b border-gold/25 p-5 sm:p-8">
            <h2 className="font-display text-2xl text-sage-dark">Declined ({declinedRsvps.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px]">
              <thead className="border-b border-gold/25 bg-cream">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-sage-dark sm:px-6">Guest name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-sage-dark sm:px-6">Reason</th>
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
                      className="border-b border-charcoal/10 hover:bg-pink-pale/35"
                    >
                      <td className="break-words px-4 py-4 text-sm font-medium text-charcoal sm:px-6">{guest?.name}</td>
                      <td className="break-words px-4 py-4 text-sm text-charcoal sm:px-6">{rsvp.specialRequests || '-'}</td>
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
        <div className="overflow-hidden border border-gold/30 bg-ivory shadow-sm shadow-sage-deep/5">
          <div className="border-b border-gold/25 p-5 sm:p-8">
            <h2 className="font-display text-2xl text-sage-dark">No response ({noResponseGuests.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px]">
              <thead className="border-b border-gold/25 bg-cream">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-sage-dark sm:px-6">Guest name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-sage-dark sm:px-6">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-sage-dark sm:px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {noResponseGuests.map((guest, idx) => (
                  <motion.tr
                    key={guest.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-charcoal/10 hover:bg-pink-pale/35"
                  >
                    <td className="break-words px-4 py-4 text-sm font-medium text-charcoal sm:px-6">{guest.name}</td>
                    <td className="break-all px-4 py-4 text-sm text-charcoal sm:px-6">{guest.email}</td>
                    <td className="px-4 py-4 text-sm sm:px-6">
                      <span className="whitespace-nowrap border border-gold/60 px-3 py-1 text-xs font-semibold uppercase text-sage-dark">
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
