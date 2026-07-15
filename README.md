# Ali & Hira Engagement

Next.js engagement invitation and RSVP site for deployment on Vercel with Firebase Firestore.

## Local Development

Create `.env.local` from `.env.example`, then run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Vercel Environment Variables

Set these in the Vercel project at **Settings -> Environment Variables** for Production, Preview, and Development:

```text
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDPbpnvZxdYYVdvV88_StIBfBLWMHZWeSY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=engagement-site-a4289.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=engagement-site-a4289
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=engagement-site-a4289.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=743881562134
NEXT_PUBLIC_FIREBASE_APP_ID=1:743881562134:web:21dcccb6373c34f4817d37
ADMIN_PASSWORD=<private admin password>
ADMIN_SESSION_SECRET=<long random secret>
```

Generate a session secret with:

```bash
openssl rand -base64 32
```

Keep the Firebase project on the Spark plan for the cheapest setup.

## Deploy

The project is connected to Vercel at:

[https://vercel.com/aliandai/aliandhiraengagement](https://vercel.com/aliandai/aliandhiraengagement)

After changing environment variables, redeploy the latest commit from Vercel.
