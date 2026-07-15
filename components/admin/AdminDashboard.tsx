'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getGuests, getEvents, getRSVPs, getEngagementConfig } from '@/lib/database';
import { Guest, EngagementEvent, RSVPResponse, EngagementConfig } from '@/lib/types';
import GuestManagement from '@/components/admin/GuestManagement';
import EventManagement from '@/components/admin/EventManagement';
import RSVPDashboard from '@/components/admin/RSVPDashboard';
import ProfileSettings from '@/components/admin/ProfileSettings';
import toast, { Toaster } from 'react-hot-toast';

type Tab = 'overview' | 'guests' | 'events' | 'rsvps' | 'settings';

export default function AdminDashboard() {
  const router = useRouter();
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
  const respondedGuestIds = new Set(rsvps.map((r) => r.guestId));
  const pendingCount = guests.filter((guest) => !respondedGuestIds.has(guest.id)).length;

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          className="h-8 w-8 rounded-full border border-gold/45 border-t-gold"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-charcoal">
      <Toaster toastOptions={{ style: { background: '#4f6f5b', borderRadius: '4px', color: '#fffaf2' } }} />

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-gold/30 bg-sage-dark text-ivory"
      >
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-4 px-5 py-8 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase text-gold-soft">Engagement management</p>
            <h1 className="mt-3 font-display text-3xl sm:text-4xl">
              {config?.coupleNames?.bride || 'Hira'} <span className="text-pink-light">&amp;</span>{' '}
              {config?.coupleNames?.groom || 'Ali'}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="mt-1 min-h-9 whitespace-nowrap border border-gold-soft px-4 text-xs font-semibold uppercase text-gold-soft transition-colors hover:bg-gold-soft hover:text-sage-dark"
          >
            Log out
          </button>
        </div>
      </motion.header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 flex gap-2 overflow-x-auto pb-1"
        >
          {(['overview', 'guests', 'events', 'rsvps', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`min-h-10 whitespace-nowrap px-5 py-2 text-xs font-semibold uppercase transition-colors ${
                activeTab === tab
                  ? 'bg-sage-dark text-ivory shadow-sm shadow-sage-deep/20'
                  : 'border border-sage-dark/35 text-sage-dark hover:border-pink-deep hover:text-pink-deep'
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
                    className="border border-gold/30 bg-ivory px-5 py-6 shadow-sm shadow-sage-deep/5"
                  >
                    <p className="text-xs font-semibold uppercase text-sage-dark">{stat.label}</p>
                    <p className="mt-2 font-display text-4xl text-charcoal">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="border border-gold/30 bg-ivory p-6 shadow-sm shadow-sage-deep/5 sm:p-8">
                <h2 className="font-display text-2xl text-sage-dark">Quick actions</h2>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    onClick={() => setActiveTab('guests')}
                    className="border border-sage-dark/25 bg-cream p-4 text-left transition-colors hover:border-pink-deep hover:bg-pink-pale/35"
                  >
                    <h3 className="font-display text-lg text-sage-dark">Add guests</h3>
                    <p className="mt-1 text-sm font-medium text-charcoal">Invite more people to celebrate</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="border border-sage-dark/25 bg-cream p-4 text-left transition-colors hover:border-pink-deep hover:bg-pink-pale/35"
                  >
                    <h3 className="font-display text-lg text-sage-dark">Manage events</h3>
                    <p className="mt-1 text-sm font-medium text-charcoal">Create and organize events</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('rsvps')}
                    className="border border-sage-dark/25 bg-cream p-4 text-left transition-colors hover:border-pink-deep hover:bg-pink-pale/35"
                  >
                    <h3 className="font-display text-lg text-sage-dark">View RSVPs</h3>
                    <p className="mt-1 text-sm font-medium text-charcoal">Check responses from guests</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="border border-sage-dark/25 bg-cream p-4 text-left transition-colors hover:border-pink-deep hover:bg-pink-pale/35"
                  >
                    <h3 className="font-display text-lg text-sage-dark">Update profile</h3>
                    <p className="mt-1 text-sm font-medium text-charcoal">Edit engagement details</p>
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
