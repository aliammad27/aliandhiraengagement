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
      <div className="max-w-2xl border border-charcoal/10 bg-white p-6 sm:p-8">
        <h2 className="font-display text-3xl">Engagement profile</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Couple Names */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase text-charcoal-soft">
                Groom&apos;s name
              </label>
              <input
                type="text"
                value={formData.groomName}
                onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                className="w-full border-b border-charcoal/25 bg-transparent py-2 outline-none transition-colors focus:border-navy"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase text-charcoal-soft">
                Bride&apos;s name
              </label>
              <input
                type="text"
                value={formData.brideName}
                onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                className="w-full border-b border-charcoal/25 bg-transparent py-2 outline-none transition-colors focus:border-navy"
              />
            </div>
          </div>

          {/* Engagement Date */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase text-charcoal-soft">
              Engagement date
            </label>
            <input
              type="date"
              value={formData.engagementDate}
              onChange={(e) => setFormData({ ...formData, engagementDate: e.target.value })}
              className="w-full border-b border-charcoal/25 bg-transparent py-2 outline-none transition-colors focus:border-navy"
            />
          </div>

          {/* Story */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase text-charcoal-soft">
              Our story
            </label>
            <textarea
              value={formData.story}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              placeholder="Share your engagement story with your guests..."
              className="w-full resize-none border border-charcoal/20 bg-transparent p-3 outline-none transition-colors placeholder:text-charcoal-soft/55 focus:border-navy"
              rows={5}
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase text-charcoal-soft">
                Primary color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="h-11 w-16 cursor-pointer border border-charcoal/20"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="flex-1 border-b border-charcoal/25 bg-transparent py-2 outline-none transition-colors focus:border-navy"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase text-charcoal-soft">
                Secondary color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="h-11 w-16 cursor-pointer border border-charcoal/20"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="flex-1 border-b border-charcoal/25 bg-transparent py-2 outline-none transition-colors focus:border-navy"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="border border-charcoal/10 bg-cream/50 p-6">
            <h3 className="text-xs font-medium uppercase text-charcoal-soft">Preview</h3>
            <div className="mt-4 space-y-3">
              <p className="font-display text-xl">
                {formData.brideName || 'Bride'} <span className="text-gold">&amp;</span> {formData.groomName || 'Groom'}
              </p>
              <p className="text-sm text-charcoal-soft">
                {formData.engagementDate
                  ? new Date(formData.engagementDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                  : 'Date not set'}
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 border border-charcoal/15"
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                  <span className="text-sm text-charcoal-soft">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 border border-charcoal/15"
                    style={{ backgroundColor: formData.secondaryColor }}
                  />
                  <span className="text-sm text-charcoal-soft">Secondary</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="min-h-12 w-full bg-navy text-sm font-medium uppercase text-ivory transition-colors hover:bg-navy-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
