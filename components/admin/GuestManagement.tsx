'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { addGuest, bulkAddGuests, deleteGuest, generateInvitationToken } from '@/lib/database';
import { Guest } from '@/lib/types';
import toast from 'react-hot-toast';

interface Props {
  guests: Guest[];
  onRefresh: () => Promise<void>;
}

export default function GuestManagement({ guests, onRefresh }: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', partySize: '1' });
  const [csvInput, setCsvInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    setLoading(true);
    try {
      await addGuest({
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        partySize: parseInt(formData.partySize),
        invitationToken: generateInvitationToken(),
      });
      toast.success('Guest added successfully');
      setFormData({ name: '', email: '', phone: '', partySize: '1' });
      setShowAddForm(false);
      await onRefresh();
    } catch (error) {
      console.error('Error adding guest:', error);
      toast.error('Error adding guest');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAdd = async () => {
    if (!csvInput.trim()) {
      toast.error('Please paste guest data');
      return;
    }

    setLoading(true);
    try {
      const lines = csvInput.trim().split('\n').filter(line => line.trim());
      const newGuests = lines.map(line => {
        const [name, email, phone = '', partySize = '1'] = line.split(',').map(v => v.trim());
        return {
          name,
          email,
          phone,
          partySize: parseInt(partySize) || 1,
          invitationToken: generateInvitationToken(),
        };
      });

      await bulkAddGuests(newGuests);
      toast.success(`Added ${newGuests.length} guests`);
      setCsvInput('');
      await onRefresh();
    } catch (error) {
      console.error('Error bulk adding guests:', error);
      toast.error('Error adding guests');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (confirm('Are you sure you want to delete this guest?')) {
      try {
        await deleteGuest(id);
        toast.success('Guest deleted');
        await onRefresh();
      } catch (error) {
        console.error('Error deleting guest:', error);
        toast.error('Error deleting guest');
      }
    }
  };

  const copyInviteLink = (token: string) => {
    const link = `${window.location.origin}/invite?token=${token}`;
    navigator.clipboard.writeText(link);
    toast.success('Invitation link copied!');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Add Guest Section */}
      <div className="border border-gold/30 bg-ivory p-6 shadow-sm shadow-sage-deep/5 sm:p-8">
        <h2 className="font-display text-2xl text-sage-dark">Add guests</h2>

        <div className="mt-5 space-y-4">
          {/* Single Guest Form */}
          <div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="min-h-11 border border-sage-dark bg-sage-dark px-5 text-xs font-semibold uppercase text-ivory transition-colors hover:bg-sage-deep"
            >
              {showAddForm ? 'Cancel' : 'Add single guest'}
            </button>

            {showAddForm && (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleAddGuest}
                className="mt-4 space-y-4 border border-sage-dark/20 bg-cream p-4"
              >
                <input
                  type="text"
                  placeholder="Guest name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-b border-charcoal/40 bg-transparent py-2 text-charcoal outline-none transition-colors placeholder:text-charcoal-soft focus:border-pink-deep"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border-b border-charcoal/40 bg-transparent py-2 text-charcoal outline-none transition-colors placeholder:text-charcoal-soft focus:border-pink-deep"
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border-b border-charcoal/40 bg-transparent py-2 text-charcoal outline-none transition-colors placeholder:text-charcoal-soft focus:border-pink-deep"
                />
                <select
                  value={formData.partySize}
                  onChange={(e) => setFormData({ ...formData, partySize: e.target.value })}
                  className="w-full border-b border-charcoal/40 bg-transparent py-2 text-charcoal outline-none transition-colors focus:border-pink-deep"
                >
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className="min-h-11 w-full bg-sage-dark text-xs font-semibold uppercase text-ivory transition-colors hover:bg-sage-deep disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Adding...' : 'Add guest'}
                </button>
              </motion.form>
            )}
          </div>

          {/* Bulk Add */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-sage-dark">Bulk add guests</h3>
            <p className="mt-2 text-sm font-medium text-charcoal">Format: Name,Email,Phone,PartySize (one per line)</p>
            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="John Doe,john@example.com,555-1234,1&#10;Jane Smith,jane@example.com,,2"
              className="mt-3 w-full resize-none border border-charcoal/30 bg-cream p-3 text-charcoal outline-none transition-colors placeholder:text-charcoal-soft focus:border-pink-deep"
              rows={4}
            />
            <button
              onClick={handleBulkAdd}
              disabled={loading}
              className="mt-3 min-h-11 w-full border border-sage-dark text-xs font-semibold uppercase text-sage-dark transition-colors hover:bg-sage-dark hover:text-ivory disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Adding...' : 'Add multiple guests'}
            </button>
          </div>
        </div>
      </div>

      {/* Guests List */}
      <div className="overflow-hidden border border-gold/30 bg-ivory shadow-sm shadow-sage-deep/5">
        <div className="p-6 sm:p-8">
          <h2 className="font-display text-2xl text-sage-dark">Guest list ({guests.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-y border-gold/25 bg-cream">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-sage-dark">Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-sage-dark">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-sage-dark">Party size</th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-sage-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest, idx) => (
                <motion.tr
                  key={guest.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-charcoal/10 hover:bg-pink-pale/35"
                >
                  <td className="px-6 py-4 text-sm text-charcoal">{guest.name}</td>
                  <td className="px-6 py-4 text-sm text-charcoal">{guest.email}</td>
                  <td className="px-6 py-4 text-sm text-charcoal">{guest.partySize}</td>
                  <td className="space-x-4 px-6 py-4 text-sm">
                    <button
                      onClick={() => copyInviteLink(guest.invitationToken)}
                      className="font-semibold text-sage-dark hover:text-gold"
                    >
                      Invite
                    </button>
                    <button
                      onClick={() => handleDeleteGuest(guest.id)}
                      className="font-semibold text-charcoal hover:text-pink-deep"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
