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
  { value: 'engagement_party', label: 'Engagement party' },
  { value: 'mehendi', label: 'Mehendi' },
  { value: 'baraat', label: 'Baraat' },
  { value: 'walima', label: 'Walima' },
  { value: 'other', label: 'Other event' },
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
        type: formData.type as EngagementEvent['type'],
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
      <div className="border border-charcoal/10 bg-white p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Events</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="min-h-11 border border-navy bg-navy px-5 text-xs font-medium uppercase text-ivory transition-colors hover:bg-navy-soft"
          >
            {showForm ? 'Cancel' : 'Create event'}
          </button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="mt-5 space-y-4 border border-charcoal/10 bg-cream/50 p-4"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium uppercase text-charcoal-soft">Event type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full border-b border-charcoal/25 bg-transparent py-2 outline-none transition-colors focus:border-navy"
                >
                  {EVENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase text-charcoal-soft">Event title</label>
                <input
                  type="text"
                  placeholder="e.g., Engagement Ceremony"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border-b border-charcoal/25 bg-transparent py-2 outline-none transition-colors placeholder:text-charcoal-soft/55 focus:border-navy"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase text-charcoal-soft">Date &amp; time</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full border-b border-charcoal/25 bg-transparent py-2 outline-none transition-colors focus:border-navy"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium uppercase text-charcoal-soft">Location</label>
                <input
                  type="text"
                  placeholder="Venue address"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border-b border-charcoal/25 bg-transparent py-2 outline-none transition-colors placeholder:text-charcoal-soft/55 focus:border-navy"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase text-charcoal-soft">Description</label>
              <textarea
                placeholder="Add event details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full resize-none border border-charcoal/20 bg-transparent p-3 outline-none transition-colors placeholder:text-charcoal-soft/55 focus:border-navy"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="min-h-11 w-full bg-navy text-xs font-medium uppercase text-ivory transition-colors hover:bg-navy-soft disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create event'}
            </button>
          </motion.form>
        )}
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {events.length === 0 ? (
          <div className="col-span-full border border-charcoal/10 bg-white py-12 text-center">
            <p className="text-charcoal-soft">No events created yet. Create your first event!</p>
          </div>
        ) : (
          events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="border border-charcoal/10 border-l-4 border-l-gold bg-white p-6"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="font-display text-xl">{event.title}</h3>
                <span className="whitespace-nowrap border border-gold/40 px-3 py-1 text-xs uppercase text-sage-deep">
                  {EVENT_TYPES.find(t => t.value === event.type)?.label}
                </span>
              </div>

              <p className="mb-4 text-charcoal-soft">{event.description}</p>

              <div className="space-y-2 text-sm text-charcoal-soft">
                <p>{new Date(event.date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}</p>
                <p>{event.location}</p>
                <p>{event.guestList.length} guests invited</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
