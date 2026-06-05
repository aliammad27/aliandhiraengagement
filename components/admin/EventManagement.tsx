'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { addEvent } from '@/lib/database';
import { EngagementEvent, Guest } from '@/lib/types';
import toast from 'react-hot-toast';

interface Props {
  events: EngagementEvent[];
  guests: Guest[];
  onRefresh: () => Promise<void>;
}

const EVENT_TYPES = [
  { value: 'engagement_party', label: '🎉 Engagement Party' },
  { value: 'mehendi', label: '💄 Mehendi' },
  { value: 'baraat', label: '🎺 Baraat' },
  { value: 'walima', label: '🍽️ Walima' },
  { value: 'other', label: '📅 Other Event' },
];

export default function EventManagement({ events, guests, onRefresh }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    type: 'engagement_party',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await addEvent({
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date),
        location: formData.location,
        type: formData.type as any,
        guestList: guests.map(g => g.id),
      });
      toast.success('Event created successfully');
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        type: 'engagement_party',
      });
      setShowForm(false);
      await onRefresh();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Error creating event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Add Event Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Events</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
          >
            {showForm ? 'Cancel' : '➕ Create Event'}
          </button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  {EVENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g., Engagement Ceremony"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Venue address"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                placeholder="Add event details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </motion.form>
        )}
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No events created yet. Create your first event!</p>
          </div>
        ) : (
          events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg shadow p-6 border-l-4 border-rose-500"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                <span className="text-sm bg-rose-100 text-rose-700 px-3 py-1 rounded-full">
                  {EVENT_TYPES.find(t => t.value === event.type)?.label}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{event.description}</p>

              <div className="space-y-2 text-sm text-gray-600">
                <p>📅 {new Date(event.date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}</p>
                <p>📍 {event.location}</p>
                <p>👥 {event.guestList.length} guests invited</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
