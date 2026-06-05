'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getGuestByToken, recordRSVP, getGuestRSVP } from '@/lib/database';
import { Guest } from '@/lib/types';
import toast, { Toaster } from 'react-hot-toast';

export default function InvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    rsvpStatus: 'pending',
    partySize: 1,
    dietaryRestrictions: '',
    specialRequests: '',
  });

  useEffect(() => {
    const fetchGuest = async () => {
      if (!token) {
        toast.error('Invalid invitation link');
        setLoading(false);
        return;
      }

      try {
        const data = await getGuestByToken(token);
        if (!data) {
          toast.error('Invitation not found');
        } else {
          setGuest(data);
        }
      } catch (error) {
        console.error('Error fetching guest:', error);
        toast.error('Error loading invitation');
      } finally {
        setLoading(false);
      }
    };

    fetchGuest();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!guest) {
      toast.error('Guest information not found');
      return;
    }

    try {
      await recordRSVP({
        guestId: guest.id,
        eventId: 'main', // Default event
        status: formData.rsvpStatus as 'accepted' | 'declined',
        partySize: parseInt(formData.partySize.toString()),
        dietaryRestrictions: formData.dietaryRestrictions,
        specialRequests: formData.specialRequests,
      });

      setSubmitted(true);
      toast.success('Thank you for your RSVP!');
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      toast.error('Error submitting RSVP. Please try again.');
    }
  };

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

  if (!guest) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 to-rose-100">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center"
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Invalid Invitation</h1>
          <p className="text-gray-600">We couldn't find your invitation. Please check the link and try again.</p>
        </motion.div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-rose-50 to-rose-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="text-6xl mb-4"
          >
            ✅
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            We've received your RSVP and can't wait to celebrate with you!
          </p>
          <a
            href="/"
            className="inline-block bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition"
          >
            Back to Home
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50 py-12 px-4">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-lg p-8">
          <motion.h1 className="text-4xl font-bold text-center text-rose-600 mb-2">
            You're Invited! 💍
          </motion.h1>
          <motion.p className="text-center text-gray-600 mb-8">
            Hi {guest.name}, we'd love to celebrate with you!
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* RSVP Status */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Will you be joining us?
              </label>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-rose-500 transition"
                  style={{borderColor: formData.rsvpStatus === 'accepted' ? '#f43f5e' : ''}}
                >
                  <input
                    type="radio"
                    name="rsvp"
                    value="accepted"
                    checked={formData.rsvpStatus === 'accepted'}
                    onChange={(e) => setFormData({ ...formData, rsvpStatus: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 font-semibold">Yes, I'm coming! 🎉</span>
                </label>
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-rose-500 transition"
                  style={{borderColor: formData.rsvpStatus === 'declined' ? '#f43f5e' : ''}}
                >
                  <input
                    type="radio"
                    name="rsvp"
                    value="declined"
                    checked={formData.rsvpStatus === 'declined'}
                    onChange={(e) => setFormData({ ...formData, rsvpStatus: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span className="ml-3 font-semibold">Sorry, can't make it 😢</span>
                </label>
              </div>
            </div>

            {/* Party Size (only show if accepted) */}
            {formData.rsvpStatus === 'accepted' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className="block text-lg font-semibold text-gray-800 mb-3">
                  How many guests?
                </label>
                <select
                  value={formData.partySize}
                  onChange={(e) => setFormData({ ...formData, partySize: parseInt(e.target.value) })}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-rose-500"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
                  ))}
                </select>
              </motion.div>
            )}

            {/* Dietary Restrictions */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Dietary Restrictions (optional)
              </label>
              <input
                type="text"
                placeholder="e.g., vegetarian, gluten-free, allergies..."
                value={formData.dietaryRestrictions}
                onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                Special Requests (optional)
              </label>
              <textarea
                placeholder="Anything else you'd like us to know?"
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-rose-500 resize-none"
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-lg font-bold text-lg hover:shadow-lg transition"
            >
              Submit RSVP
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
