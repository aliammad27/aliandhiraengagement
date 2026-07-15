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

const DEFAULT_PRIMARY_COLOR = '#7d9b76';
const DEFAULT_SECONDARY_COLOR = '#b85f68';

function dateInputToDate(value: string) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default function ProfileSettings({ config, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    groomName: '',
    brideName: '',
    story: '',
    engagementDate: '',
    primaryColor: DEFAULT_PRIMARY_COLOR,
    secondaryColor: DEFAULT_SECONDARY_COLOR,
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
        primaryColor: config.primaryColor || DEFAULT_PRIMARY_COLOR,
        secondaryColor: config.secondaryColor || DEFAULT_SECONDARY_COLOR,
      });
    }
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.groomName || !formData.brideName) {
      toast.error('Please enter both names');
      return;
    }

    const engagementDate = dateInputToDate(formData.engagementDate);

    setLoading(true);
    try {
      await updateEngagementConfig({
        coupleNames: {
          groom: formData.groomName,
          bride: formData.brideName,
        },
        story: formData.story,
        ...(engagementDate ? { engagementDate } : {}),
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

  const previewDate = dateInputToDate(formData.engagementDate);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="max-w-2xl border border-charcoal/15 bg-white p-6 sm:p-8">
        <h2 className="font-display text-3xl text-charcoal">Engagement profile</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Couple Names */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-charcoal">
                Groom&apos;s name
              </label>
              <input
                type="text"
                value={formData.groomName}
                onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                className="w-full border-b border-charcoal/40 bg-transparent py-2 text-charcoal outline-none transition-colors focus:border-navy"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-charcoal">
                Bride&apos;s name
              </label>
              <input
                type="text"
                value={formData.brideName}
                onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                className="w-full border-b border-charcoal/40 bg-transparent py-2 text-charcoal outline-none transition-colors focus:border-navy"
              />
            </div>
          </div>

          {/* Engagement Date */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-charcoal">
              Engagement date
            </label>
            <input
              type="date"
              value={formData.engagementDate}
              onChange={(e) => setFormData({ ...formData, engagementDate: e.target.value })}
              className="w-full border-b border-charcoal/40 bg-transparent py-2 text-charcoal outline-none transition-colors focus:border-navy"
            />
          </div>

          {/* Story */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase text-charcoal">
              Our story
            </label>
            <textarea
              value={formData.story}
              onChange={(e) => setFormData({ ...formData, story: e.target.value })}
              placeholder="Share your engagement story with your guests..."
              className="w-full resize-none border border-charcoal/30 bg-transparent p-3 text-charcoal outline-none transition-colors placeholder:text-charcoal-soft focus:border-navy"
              rows={5}
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-charcoal">
                Primary color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="h-11 w-16 cursor-pointer border border-charcoal/30"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="flex-1 border-b border-charcoal/40 bg-transparent py-2 text-charcoal outline-none transition-colors focus:border-navy"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase text-charcoal">
                Secondary color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="h-11 w-16 cursor-pointer border border-charcoal/30"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  className="flex-1 border-b border-charcoal/40 bg-transparent py-2 text-charcoal outline-none transition-colors focus:border-navy"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="border border-charcoal/15 bg-cream p-6">
            <h3 className="text-xs font-semibold uppercase text-charcoal">Preview</h3>
            <div className="mt-4 space-y-3">
              <p className="font-display text-xl text-charcoal">
                {formData.brideName || 'Bride'} <span className="text-gold">&amp;</span> {formData.groomName || 'Groom'}
              </p>
              <p className="text-sm font-medium text-charcoal">
                {previewDate
                  ? previewDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                  : 'Date not set'}
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 border border-charcoal/30"
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                  <span className="text-sm font-medium text-charcoal">Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-6 w-6 border border-charcoal/30"
                    style={{ backgroundColor: formData.secondaryColor }}
                  />
                  <span className="text-sm font-medium text-charcoal">Secondary</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="min-h-12 w-full bg-navy text-sm font-semibold uppercase text-ivory transition-colors hover:bg-navy-soft disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
