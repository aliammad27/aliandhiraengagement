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

  const acceptedCount = rsvps.filter((r) => r.status === 'accepted').length;
  const declinedCount = rsvps.filter((r) => r.status === 'declined').length;
  const respondedGuestIds = new Set(rsvps.map((r) => r.guestId));
  const pendingCount = guests.filter((guest) => !respondedGuestIds.has(guest.id)).length;

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-cream">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          className="h-8 w-8 rounded-full border border-sage-dark/20 border-t-sage-dark"
        />
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] w-full overflow-x-hidden bg-cream text-charcoal">
      <Toaster toastOptions={{ style: { background: '#4f6f5b', borderRadius: '4px', color: '#fffaf2' } }} />

      <header className="border-b border-sage-dark/10 bg-ivory">
        <div className="mx-auto flex max-w-6xl flex-col items-stretch gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-dark">Admin</p>
            <h1 className="mt-2 text-2xl font-semibold leading-tight text-charcoal sm:text-3xl">Manage invitations</h1>
            <p className="mt-1 text-sm leading-6 text-charcoal-soft">
              Guests, RSVPs, event details, and site settings for {config?.coupleNames?.bride || 'Hira'} and{' '}
              {config?.coupleNames?.groom || 'Ali'}.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="min-h-10 w-full whitespace-nowrap border border-sage-dark/25 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-sage-dark transition-colors hover:bg-sage-dark hover:text-ivory sm:w-auto"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-8 sm:py-8">
        <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {(['overview', 'guests', 'events', 'rsvps', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`min-h-11 shrink-0 whitespace-nowrap px-5 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                activeTab === tab
                  ? 'bg-sage-dark text-ivory shadow-sm shadow-sage-deep/10'
                  : 'border border-sage-dark/20 text-sage-dark hover:border-sage-dark hover:bg-ivory'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'guests' && 'Guests'}
              {tab === 'events' && 'Events'}
              {tab === 'rsvps' && 'RSVPs'}
              {tab === 'settings' && 'Settings'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {[
                  { label: 'Total guests', value: guests.length },
                  { label: 'Accepted', value: acceptedCount },
                  { label: 'Declined', value: declinedCount },
                  { label: 'Pending', value: pendingCount },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border border-sage-dark/10 bg-ivory px-4 py-5 shadow-sm shadow-sage-deep/5 sm:px-5 sm:py-6"
                  >
                    <p className="text-xs font-semibold uppercase leading-4 tracking-[0.12em] text-charcoal-soft">{stat.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-charcoal sm:text-4xl">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="border border-sage-dark/10 bg-ivory p-5 shadow-sm shadow-sage-deep/5 sm:p-8">
                <h2 className="text-xl font-semibold text-charcoal">Quick actions</h2>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    onClick={() => setActiveTab('guests')}
                    className="border border-sage-dark/15 bg-cream p-4 text-left transition-colors hover:border-sage-dark hover:bg-ivory"
                  >
                    <h3 className="text-base font-semibold text-charcoal">Add guests</h3>
                    <p className="mt-1 text-sm leading-6 text-charcoal-soft">Create guest records and invitation links.</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="border border-sage-dark/15 bg-cream p-4 text-left transition-colors hover:border-sage-dark hover:bg-ivory"
                  >
                    <h3 className="text-base font-semibold text-charcoal">Manage events</h3>
                    <p className="mt-1 text-sm leading-6 text-charcoal-soft">Review event information and assignments.</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('rsvps')}
                    className="border border-sage-dark/15 bg-cream p-4 text-left transition-colors hover:border-sage-dark hover:bg-ivory"
                  >
                    <h3 className="text-base font-semibold text-charcoal">View RSVPs</h3>
                    <p className="mt-1 text-sm leading-6 text-charcoal-soft">Track accepted, declined, and pending responses.</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="border border-sage-dark/15 bg-cream p-4 text-left transition-colors hover:border-sage-dark hover:bg-ivory"
                  >
                    <h3 className="text-base font-semibold text-charcoal">Update settings</h3>
                    <p className="mt-1 text-sm leading-6 text-charcoal-soft">Edit names, date, copy, and colors.</p>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'guests' && <GuestManagement guests={guests} onRefresh={loadData} />}

          {activeTab === 'events' && <EventManagement events={events} guests={guests} onRefresh={loadData} />}

          {activeTab === 'rsvps' && <RSVPDashboard rsvps={rsvps} guests={guests} />}

          {activeTab === 'settings' && <ProfileSettings config={config} onRefresh={loadData} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
