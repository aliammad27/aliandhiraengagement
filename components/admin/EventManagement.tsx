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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-full space-y-6">
      {/* Add Event Form */}
      <div className="border border-gold/30 bg-ivory p-5 shadow-sm shadow-sage-deep/5 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl text-sage-dark">Events</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="min-h-11 w-full border border-sage-dark bg-sage-dark px-5 text-xs font-semibold uppercase text-ivory transition-colors hover:bg-sage-deep sm:w-auto"
          >
            {showForm ? 'Cancel' : 'Create event'}
          </button>
        </div>

        {showForm && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="mt-5 space-y-4 border border-sage-dark/20 bg-cream p-4 sm:p-5"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="min-w-0">
                <label className="mb-2 block text-xs font-semibold uppercase text-sage-dark">Event type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full border-b border-charcoal/40 bg-transparent py-3 text-base text-charcoal outline-none transition-colors focus:border-pink-deep"
                >
                  {EVENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="min-w-0">
                <label className="mb-2 block text-xs font-semibold uppercase text-sage-dark">Event title</label>
                <input
                  type="text"
                  placeholder="e.g., Engagement Ceremony"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border-b border-charcoal/40 bg-transparent py-3 text-base text-charcoal outline-none transition-colors placeholder:text-charcoal-soft focus:border-pink-deep"
                />
              </div>

              <div className="min-w-0">
                <label className="mb-2 block text-xs font-semibold uppercase text-sage-dark">Date &amp; time</label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full border-b border-charcoal/40 bg-transparent py-3 text-base text-charcoal outline-none transition-colors focus:border-pink-deep"
                />
              </div>

              <div className="min-w-0">
                <label className="mb-2 block text-xs font-semibold uppercase text-sage-dark">Location</label>
                <input
                  type="text"
                  placeholder="Venue address"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border-b border-charcoal/40 bg-transparent py-3 text-base text-charcoal outline-none transition-colors placeholder:text-charcoal-soft focus:border-pink-deep"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-sage-dark">Description</label>
              <textarea
                placeholder="Add event details..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full resize-none border border-charcoal/30 bg-transparent p-3 text-base text-charcoal outline-none transition-colors placeholder:text-charcoal-soft focus:border-pink-deep"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="min-h-11 w-full bg-sage-dark px-4 text-xs font-semibold uppercase text-ivory transition-colors hover:bg-sage-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create event'}
            </button>
          </motion.form>
        )}
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {events.length === 0 ? (
          <div className="col-span-full border border-gold/30 bg-ivory px-5 py-12 text-center shadow-sm shadow-sage-deep/5">
            <p className="font-medium leading-7 text-charcoal">No events created yet. Create your first event!</p>
          </div>
        ) : (
          events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="min-w-0 border border-gold/30 border-l-4 border-l-pink-deep bg-ivory p-5 shadow-sm shadow-sage-deep/5 sm:p-6"
            >
              <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h3 className="break-words font-display text-xl leading-tight text-sage-dark">{event.title}</h3>
                <span className="w-fit whitespace-nowrap border border-gold/60 px-3 py-1 text-xs font-semibold uppercase text-sage-dark">
                  {EVENT_TYPES.find(t => t.value === event.type)?.label}
                </span>
              </div>

              <p className="mb-4 break-words leading-7 text-charcoal">{event.description}</p>

              <div className="space-y-2 text-sm font-medium leading-6 text-charcoal">
                <p>{new Date(event.date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}</p>
                <p className="break-words">{event.location}</p>
                <p>{event.guestList.length} guests invited</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}
