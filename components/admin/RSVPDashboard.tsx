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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Accepted', value: acceptedRsvps.length, total: totalAcceptedParty, color: 'bg-green-500', icon: '✅' },
          { label: 'Declined', value: declinedRsvps.length, total: null, color: 'bg-red-500', icon: '❌' },
          { label: 'No Response', value: noResponseGuests.length, total: null, color: 'bg-yellow-500', icon: '⏳' },
          { label: 'Total Attendees', value: totalAcceptedParty, total: null, color: 'bg-blue-500', icon: '👥' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className={`${stat.color} text-white p-4 rounded-lg mr-4 text-2xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                {stat.total !== null && <p className="text-xs text-gray-500">+{stat.total} party size</p>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Accepted RSVPs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 bg-green-50 border-b border-green-200">
          <h2 className="text-2xl font-bold text-gray-900">✅ Accepted ({acceptedRsvps.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Guest Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Party Size</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Dietary Restrictions</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Special Requests</th>
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
                    className="border-b hover:bg-green-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{guest?.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {rsvp.partySize} guest{rsvp.partySize > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{rsvp.dietaryRestrictions || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{rsvp.specialRequests || '-'}</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Declined RSVPs */}
      {declinedRsvps.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 bg-red-50 border-b border-red-200">
            <h2 className="text-2xl font-bold text-gray-900">❌ Declined ({declinedRsvps.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Guest Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reason</th>
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
                      className="border-b hover:bg-red-50"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{guest?.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{rsvp.specialRequests || '-'}</td>
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
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 bg-yellow-50 border-b border-yellow-200">
            <h2 className="text-2xl font-bold text-gray-900">⏳ No Response ({noResponseGuests.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Guest Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {noResponseGuests.map((guest, idx) => (
                  <motion.tr
                    key={guest.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b hover:bg-yellow-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{guest.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{guest.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
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
