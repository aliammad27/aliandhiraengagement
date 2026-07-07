'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { updateEngagementConfig } from '@/lib/database';
import { EngagementConfig } from '@/lib/types';
import toast from 'react-hot-toast';

interface Props {
  config: EngagementConfig | null;
  onRefresh: () => Promise<void>;
}

export default function ProfileSettings({ config, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    groomName: '',
    brideName: '',
    story: '',
    engagementDate: '',
    primaryColor: '#f43f5e',
    secondaryColor: '#ec4899',
  });

  useEffect(() => {
    if (config) {
      setFormData({
        groomName: config.coupleNames?.groom || '',
        brideName: config.coupleNames?.bride || '',
        story: config.story || '',
        engagementDate: config.engagementDate
          ? new Date(config.engagementDate).toISOString().split('T')[0]
          : '',
        primaryColor: config.primaryColor || '#f43f5e',
        secondaryColor: config.secondaryColor || '#ec4899',
      });
    }
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.groomName || !formData.brideName) {
      toast.error('Please enter both names');
      return;
    }

    setLoading(true);
    try {
      await updateEngagementConfig({
        coupleNames: {
          groom: formData.groomName,
          bride: formData.brideName,
        },
        story: formData.story,
        engagementDate: new Date(formData.engagementDate),
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
      });
      toast.success('Profile updated successfully');
      await onRefresh();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Engagement Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Couple Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Groom's Name
              </label>
              <input
                type="text"
                value={formData.groomName}
                onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bride's Name
              </label>
              <input
                type="text"
                value={formData.brideName}
                onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Engagement Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Engagement Date
            </label>
            <input
              type="date"
              value={formData.engagementDate}
              onChange={(e) => setFormData({ ...formData, engagementDate: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Story */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Our Story
            </label>
            <textarea
              value={formData.story}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              placeholder="Share your engagement story with your guests..."
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-rose-500 resize-none"
              rows={5}
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-20 h-12 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="flex-1 p-3 border-2 border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="w-20 h-12 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="flex-1 p-3 border-2 border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                <strong>Display Name:</strong> {formData.brideName || 'Bride'} & {formData.groomName || 'Groom'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Engagement Date:</strong> {formData.engagementDate
                  ? new Date(formData.engagementDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                  : 'Not set'}
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                  <span className="text-sm text-gray-600">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: formData.secondaryColor }}
                  />
                  <span className="text-sm text-gray-600">Secondary</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 text-white py-3 rounded-lg font-bold hover:bg-rose-600 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
