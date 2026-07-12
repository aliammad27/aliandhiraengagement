'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { CornerFrame, navyRadial } from '@/components/ornaments';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        toast.error('Incorrect password');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-5 text-center text-ivory" style={navyRadial}>
      <Toaster position="top-center" toastOptions={{ style: { background: '#0a2038', borderRadius: '4px', color: '#f8f5ef' } }} />

      <div className="relative w-full max-w-sm px-7 py-14 sm:px-10">
        <CornerFrame borderColor="border-gold/50" />
        <p className="font-arabic text-xl text-gold">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <h1 className="mt-8 font-display text-4xl">Admin access</h1>
        <p className="mt-4 leading-7 text-ivory/65">Enter the password to manage invitations.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 text-left">
          <div>
            <label htmlFor="password" className="mb-2 block text-xs font-medium uppercase text-ivory/55">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoFocus
              className="w-full border-b border-ivory/25 bg-transparent py-2 text-ivory outline-none transition-colors focus:border-gold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="min-h-12 w-full bg-gold text-sm font-medium uppercase text-navy transition-colors hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    </main>
  );
}
