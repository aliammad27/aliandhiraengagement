'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { CornerFrame } from '@/components/ornaments';

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
        let message = 'Incorrect password';

        try {
          const data = (await response.json()) as { error?: string };
          if (response.status >= 500 && data.error) message = data.error;
        } catch {
          // Keep the default error when the response is not JSON.
        }

        toast.error(message);
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
    <main className="flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-sage-dark px-4 py-8 text-center text-charcoal">
      <Toaster position="top-center" toastOptions={{ style: { background: '#4f6f5b', borderRadius: '4px', color: '#fffaf2' } }} />

      <div className="relative w-full max-w-sm border border-gold/50 bg-ivory px-5 py-10 shadow-2xl shadow-sage-deep/30 sm:px-10 sm:py-14">
        <CornerFrame borderColor="border-pink-deep/60" />
        <p className="font-arabic text-2xl text-gold">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <h1 className="mt-8 font-display text-[clamp(2.65rem,12vw,3.25rem)] leading-tight text-sage-dark">Admin access</h1>
        <p className="mx-auto mt-4 max-w-xs font-medium leading-7 text-charcoal">
          Enter the password to manage invitations.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 text-left">
          <div>
            <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase text-sage-dark">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoFocus
              autoComplete="current-password"
              className="w-full border-b border-sage-dark/80 bg-transparent py-3 text-base text-charcoal outline-none transition-colors focus:border-pink-deep sm:text-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="min-h-12 w-full bg-sage-dark px-5 text-sm font-semibold uppercase tracking-[0.14em] text-ivory shadow-md shadow-sage-deep/25 transition-colors hover:bg-pink-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-deep disabled:cursor-not-allowed disabled:opacity-60 sm:tracking-[0.16em]"
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    </main>
  );
}
