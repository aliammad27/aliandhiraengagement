'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getEngagementConfig } from '@/lib/database';
import { EngagementConfig } from '@/lib/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8 },
  },
};

export default function Home() {
  const [config, setConfig] = useState<EngagementConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await getEngagementConfig();
        setConfig(data || null);
      } catch (error) {
        console.error('Error fetching config:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50"
    >
      {/* Header */}
      <motion.header variants={itemVariants} className="pt-8 px-4">
        <nav className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-rose-600">
            {config?.coupleNames?.groom || 'Our'} & {config?.coupleNames?.bride || 'Love'}
          </h1>
          <Link
            href="/invite"
            className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition"
          >
            RSVP
          </Link>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <motion.section variants={itemVariants} className="max-w-4xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <h2 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600 mb-4">
            💍 We're Engaged!
          </h2>
        </motion.div>

        <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-8 leading-relaxed">
          {config?.story ||
            'We are thrilled to share the joy of our engagement with you. Join us as we celebrate this beautiful milestone in our lives!'}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="text-center text-gray-500 mb-12"
        >
          <p className="text-lg font-semibold text-rose-600">
            {config?.engagementDate
              ? new Date(config.engagementDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'A Special Celebration'}
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          className="inline-block"
        >
          <Link
            href="/invite"
            className="inline-block bg-gradient-to-r from-rose-500 to-pink-600 text-white px-12 py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-shadow"
          >
            View Invitation
          </Link>
        </motion.div>
      </motion.section>

      {/* Photo Gallery */}
      {config?.photos && config.photos.length > 0 && (
        <motion.section variants={itemVariants} className="max-w-5xl mx-auto px-4 py-20">
          <h3 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Journey</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.photos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="rounded-lg overflow-hidden shadow-lg"
              >
                <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-64 object-cover" />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Quick Links */}
      <motion.section variants={itemVariants} className="max-w-4xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 bg-white rounded-lg shadow-md border-t-4 border-rose-500"
          >
            <h4 className="text-xl font-bold text-gray-800 mb-2">📨 Send Invitation</h4>
            <p className="text-gray-600 mb-4">Share your celebration details with your guests</p>
            <Link href="/admin" className="text-rose-500 font-semibold hover:text-rose-600">
              Go to Admin →
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 bg-white rounded-lg shadow-md border-t-4 border-pink-500"
          >
            <h4 className="text-xl font-bold text-gray-800 mb-2">✅ Track RSVPs</h4>
            <p className="text-gray-600 mb-4">See who's coming to celebrate with you</p>
            <Link href="/admin" className="text-rose-500 font-semibold hover:text-rose-600">
              View Responses →
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="p-6 bg-white rounded-lg shadow-md border-t-4 border-red-500"
          >
            <h4 className="text-xl font-bold text-gray-800 mb-2">🎉 Event Details</h4>
            <p className="text-gray-600 mb-4">Manage all your celebration events and details</p>
            <Link href="/admin" className="text-rose-500 font-semibold hover:text-rose-600">
              View Events →
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer variants={itemVariants} className="py-12 text-center text-gray-500">
        <p>Made with 💕 for your special celebration</p>
      </motion.footer>
    </motion.div>
  );
}
