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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Guests</h2>

        <div className="space-y-4">
          {/* Single Guest Form */}
          <div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
            >
              {showAddForm ? 'Cancel' : '➕ Add Single Guest'}
            </button>

            {showAddForm && (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleAddGuest}
                className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4"
              >
                <input
                  type="text"
                  placeholder="Guest Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <select
                  value={formData.partySize}
                  onChange={(e) => setFormData({ ...formData, partySize: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Guest'}
                </button>
              </motion.form>
            )}
          </div>

          {/* Bulk Add */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Bulk Add Guests</h3>
            <p className="text-sm text-gray-600 mb-2">Format: Name,Email,Phone,PartySize (one per line)</p>
            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="John Doe,john@example.com,555-1234,1&#10;Jane Smith,jane@example.com,,2"
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
              rows={4}
            />
            <button
              onClick={handleBulkAdd}
              disabled={loading}
              className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Multiple Guests'}
            </button>
          </div>
        </div>
      </div>

      {/* Guests List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Guest List ({guests.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Party Size</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest, idx) => (
                <motion.tr
                  key={guest.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">{guest.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{guest.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{guest.partySize}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => copyInviteLink(guest.invitationToken)}
                      className="text-blue-600 hover:text-blue-900 font-semibold"
                    >
                      📧 Invite
                    </button>
                    <button
                      onClick={() => handleDeleteGuest(guest.id)}
                      className="text-red-600 hover:text-red-900 font-semibold"
                    >
                      🗑️ Delete
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
