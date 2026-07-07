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
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            💍 Engagement Management Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            {config?.coupleNames?.bride || 'Name'} & {config?.coupleNames?.groom || 'Your'}
          </p>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex space-x-4 mb-8 overflow-x-auto pb-4"
        >
          {(['overview', 'guests', 'events', 'rsvps', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                activeTab === tab
                  ? 'bg-rose-500 text-white'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-rose-500'
              }`}
            >
              {tab === 'overview' && '📊 Overview'}
              {tab === 'guests' && '👥 Guests'}
              {tab === 'events' && '🎉 Events'}
              {tab === 'rsvps' && '✅ RSVPs'}
              {tab === 'settings' && '⚙️ Settings'}
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Guests', value: guests.length, icon: '👥', color: 'bg-blue-500' },
                  { label: 'Accepted', value: acceptedCount, icon: '✅', color: 'bg-green-500' },
                  { label: 'Declined', value: declinedCount, icon: '❌', color: 'bg-red-500' },
                  { label: 'Pending', value: pendingCount, icon: '⏳', color: 'bg-yellow-500' },
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
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab('guests')}
                    className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition"
                  >
                    <h3 className="font-bold text-blue-900">Add Guests</h3>
                    <p className="text-sm text-blue-700">Invite more people to celebrate</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100 transition"
                  >
                    <h3 className="font-bold text-purple-900">Manage Events</h3>
                    <p className="text-sm text-purple-700">Create and organize events</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('rsvps')}
                    className="p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition"
                  >
                    <h3 className="font-bold text-green-900">View RSVPs</h3>
                    <p className="text-sm text-green-700">Check responses from guests</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="p-4 bg-rose-50 border-2 border-rose-200 rounded-lg hover:bg-rose-100 transition"
                  >
                    <h3 className="font-bold text-rose-900">Update Profile</h3>
                    <p className="text-sm text-rose-700">Edit engagement details</p>
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
