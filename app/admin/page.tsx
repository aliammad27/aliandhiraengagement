'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGuests, getEvents, getRSVPs, getEngagementConfig } from '@/lib/database';
import { Guest, EngagementEvent, RSVPResponse, EngagementConfig } from '@/lib/types';
import GuestManagement from '@/components/admin/GuestManagement';
import EventManagement from '@/components/admin/EventManagement';
import RSVPDashboard from '@/components/admin/RSVPDashboard';
import ProfileSettings from '@/components/admin/ProfileSettings';
import toast, { Toaster } from 'react-hot-toast';

type Tab = 'overview' | 'guests' | 'events' | 'rsvps' | 'settings';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [events, setEvents] = useState<EngagementEvent[]>([]);
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [config, setConfig] = useState<EngagementConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [guestData, eventData, rsvpData, configData] = await Promise.all([
        getGuests(),
        getEvents(),
        getRSVPs(),
        getEngagementConfig(),
      ]);
      setGuests(guestData);
      setEvents(eventData);
      setRsvps(rsvpData);
      setConfig(configData || null);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const acceptedCount = rsvps.filter(r => r.status === 'accepted').length;
  const declinedCount = rsvps.filter(r => r.status === 'declined').length;
  const pendingCount = guests.length - rsvps.length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          className="h-8 w-8 rounded-full border border-gold/30 border-t-gold"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <Toaster toastOptions={{ style: { background: '#0a2038', borderRadius: '4px', color: '#f8f5ef' } }} />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-charcoal/10 bg-navy text-ivory"
      >
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <p className="text-xs font-medium uppercase text-gold">Engagement management</p>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl">
            {config?.coupleNames?.bride || 'Hira'} <span className="text-gold">&amp;</span>{' '}
            {config?.coupleNames?.groom || 'Ali'}
          </h1>
        </div>
      </motion.header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {/* Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 flex gap-2 overflow-x-auto pb-1"
        >
          {(['overview', 'guests', 'events', 'rsvps', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`min-h-10 whitespace-nowrap px-5 py-2 text-xs font-medium uppercase transition-colors ${
                activeTab === tab
                  ? 'bg-navy text-ivory'
                  : 'border border-charcoal/15 text-charcoal-soft hover:border-navy hover:text-navy'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'guests' && 'Guests'}
              {tab === 'events' && 'Events'}
              {tab === 'rsvps' && 'RSVPs'}
              {tab === 'settings' && 'Settings'}
            </button>
          ))}
        </motion.div>

        {/* Overview Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: 'Total guests', value: guests.length },
                  { label: 'Accepted', value: acceptedCount },
                  { label: 'Declined', value: declinedCount },
                  { label: 'Pending', value: pendingCount },
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
                  </motion.div>
                ))}
              </div>

              <div className="border border-charcoal/10 bg-white p-6 sm:p-8">
                <h2 className="font-display text-2xl">Quick actions</h2>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    onClick={() => setActiveTab('guests')}
                    className="border border-charcoal/15 p-4 text-left transition-colors hover:border-navy"
                  >
                    <h3 className="font-display text-lg">Add guests</h3>
                    <p className="mt-1 text-sm text-charcoal-soft">Invite more people to celebrate</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="border border-charcoal/15 p-4 text-left transition-colors hover:border-navy"
                  >
                    <h3 className="font-display text-lg">Manage events</h3>
                    <p className="mt-1 text-sm text-charcoal-soft">Create and organize events</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('rsvps')}
                    className="border border-charcoal/15 p-4 text-left transition-colors hover:border-navy"
                  >
                    <h3 className="font-display text-lg">View RSVPs</h3>
                    <p className="mt-1 text-sm text-charcoal-soft">Check responses from guests</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="border border-charcoal/15 p-4 text-left transition-colors hover:border-navy"
                  >
                    <h3 className="font-display text-lg">Update profile</h3>
                    <p className="mt-1 text-sm text-charcoal-soft">Edit engagement details</p>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'guests' && (
            <GuestManagement guests={guests} onRefresh={loadData} />
          )}

          {activeTab === 'events' && (
            <EventManagement events={events} guests={guests} onRefresh={loadData} />
          )}

          {activeTab === 'rsvps' && (
            <RSVPDashboard rsvps={rsvps} guests={guests} />
          )}

          {activeTab === 'settings' && (
            <ProfileSettings config={config} onRefresh={loadData} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
