'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

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
    <main className="flex min-h-[100svh] w-full items-center justify-center bg-cream px-4 py-8 text-charcoal">
      <Toaster position="top-center" toastOptions={{ style: { background: '#6f699e', borderRadius: '4px', color: '#fffcf6' } }} />

      <section className="w-full max-w-sm border border-sage-dark/15 bg-ivory p-6 shadow-sm shadow-sage-deep/5 sm:p-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-dark">Admin</p>
          <h1 className="mt-3 text-2xl font-semibold leading-tight text-charcoal">Manage invitations</h1>
          <p className="mt-2 text-sm leading-6 text-charcoal-soft">Enter the password to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-sage-dark">
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
              className="w-full border border-sage-dark/20 bg-cream px-3 py-3 text-base text-charcoal outline-none transition-colors focus:border-sage-dark"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="min-h-12 w-full bg-sage-dark px-5 text-sm font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-sage-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </section>
    </main>
  );
}
