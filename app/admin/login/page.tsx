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
    <main className="flex min-h-screen items-center justify-center bg-sage-dark px-5 text-center text-ivory">
      <Toaster position="top-center" toastOptions={{ style: { background: '#4f6f5b', borderRadius: '4px', color: '#fffaf2' } }} />

      <div className="relative w-full max-w-sm border border-gold-soft/70 px-7 py-14 shadow-xl shadow-sage-deep/20 sm:px-10">
        <CornerFrame borderColor="border-gold-soft" />
        <p className="font-arabic text-xl text-gold-soft">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        <h1 className="mt-8 font-display text-4xl text-ivory">Admin access</h1>
        <p className="mt-4 font-medium leading-7 text-ivory">Enter the password to manage invitations.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 text-left">
          <div>
            <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase text-gold-soft">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoFocus
              className="w-full border-b border-ivory/80 bg-transparent py-2 text-ivory outline-none transition-colors focus:border-gold-soft"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="min-h-12 w-full bg-gold-soft text-sm font-semibold uppercase text-sage-dark transition-colors hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    </main>
  );
}
