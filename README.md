# Ali & Hira Engagement

Next.js engagement invitation and RSVP site for deployment on Vercel with Firebase Firestore.

Public website: [https://hiraandali.com](https://hiraandali.com)

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
FIREBASE_SERVICE_ACCOUNT_JSON=<one-line service account JSON or base64 JSON>
```

Generate a session secret with:

```bash
openssl rand -base64 32
```

Create the Firebase service account JSON in Firebase Console -> Project settings -> Service accounts -> Generate new private key. Keep that JSON private and paste it only into Vercel as `FIREBASE_SERVICE_ACCOUNT_JSON`.

Keep the Firebase project on the Spark plan for the cheapest setup.

## Firebase Rules

Firestore is accessed through Vercel API routes with service-account credentials. Browser access is intentionally denied by `firestore.rules`.

Deploy rules with:

```bash
npx firebase-tools@latest deploy --only firestore:rules --project engagement-site-a4289
```

## Deploy

The project is connected to Vercel at:

[https://vercel.com/aliandai/aliandhiraengagement](https://vercel.com/aliandai/aliandhiraengagement)

The production domain is:

[https://hiraandali.com](https://hiraandali.com)

After changing environment variables, redeploy the latest commit from Vercel.
