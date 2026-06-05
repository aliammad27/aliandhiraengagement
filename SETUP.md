# 💍 Engagement Website - Complete Setup Guide

Welcome! This is your all-in-one engagement management platform with invitations, RSVP tracking, and animations.

## 🚀 Quick Start

### 1. Firebase Setup (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project" (or use existing)
3. Name it something like "Engagement Site"
4. Go to Project Settings (gear icon)
5. Copy your Firebase config and create `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in your Firebase credentials:
- `NEXT_PUBLIC_FIREBASE_API_KEY` - apiKey
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - authDomain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - projectId
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - storageBucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - messagingSenderId
- `NEXT_PUBLIC_FIREBASE_APP_ID` - appId

### 2. Firebase Database Setup

In Firebase Console:

**Create Firestore Database:**
- Go to "Firestore Database"
- Click "Create database"
- Choose "Start in test mode" (for development)
- Choose your region

**Create Storage Bucket (optional for photos):**
- Go to "Storage"
- Click "Create bucket"
- Choose "test" rules for development

### 3. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📱 How to Use

### Home Page (Public)
- Beautiful animated landing page
- Shows couple names and engagement date
- Links to invitation and admin dashboard

### Invitation Page
- Guests access via unique link: `localhost:3000/invite?token=UNIQUE_TOKEN`
- They can:
  - Accept or decline
  - Specify party size
  - Add dietary restrictions
  - Leave special requests
- Animations when they submit

### Admin Dashboard (`/admin`)
Manage everything:

**📊 Overview Tab:**
- Quick stats (guests, RSVPs, pending)
- Quick action buttons

**👥 Guests Tab:**
- Add single guests or bulk import
- Format for bulk add: `Name,Email,Phone,PartySize`
- Copy invitation links to send

**🎉 Events Tab:**
- Create engagement party, mehendi, baraat, walima, etc.
- Set date, location, description

**✅ RSVPs Tab:**
- See who accepted
- Track party sizes
- View dietary restrictions and special requests

**⚙️ Settings Tab:**
- Update couple names
- Set engagement date
- Write your story
- Customize colors

---

## 🎨 Features Included

✅ **Animated Landing Page** - Beautiful Framer Motion animations
✅ **Guest Management** - Add single or bulk guests
✅ **Invitation System** - Unique tokens per guest
✅ **RSVP Tracking** - Accept/Decline with details
✅ **Event Management** - Multiple event types
✅ **Admin Dashboard** - Complete control panel
✅ **Responsive Design** - Works on all devices
✅ **Beautiful UI** - Rose/pink color theme

---

## 📧 Sending Invitations

1. Go to **Admin → Guests**
2. Add your guests (name, email)
3. Click **"📧 Invite"** button
4. Share the link via:
   - Email
   - WhatsApp
   - Facebook
   - SMS

Each guest gets their own unique link!

---

## 🔐 Deployment (Optional)

### Deploy on Vercel (Free)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

```bash
git add .
git commit -m "Initial engagement site"
git push origin main
```

---

## 🛠️ Customization

### Change Colors
Go to Admin → Settings and update Primary/Secondary colors

### Add Photos
1. Store photos in Firebase Storage
2. In Admin → Settings, add photo URLs
3. They'll appear on home page

### Change Logo
Edit `app/page.tsx` to customize the hero section

---

## 📧 Email Integration (Optional)

To send invitation emails automatically:

1. Install: `npm install nodemailer`
2. Update `.env.local` with your email config
3. Create an API route to send emails

---

## ❓ Troubleshooting

**"Firebase not configured"**
- Check `.env.local` file exists
- Verify all Firebase keys are correct
- Restart dev server

**"Firestore missing"**
- Create Firestore database in Firebase Console
- Make sure to switch from "test mode" after launch

**"Invitations not working"**
- Check guest token in database
- Ensure invite link includes token parameter

---

## 📱 Next Steps

1. ✅ Set up Firebase
2. ✅ Run locally and test
3. ✅ Add your engagement details
4. ✅ Invite your first guests
5. ✅ Deploy to production
6. ✅ Share with everyone!

---

## 💡 Pro Tips

- **Test Invitations**: Send yourself an invite to test the flow
- **Backup Guests**: Export guest list regularly
- **Schedule Reminders**: Set calendar reminders for RSVPs
- **Custom Domain**: Add custom domain in Vercel settings
- **Analytics**: Add Google Analytics for traffic insights

---

## 🎉 You're All Set!

Your engagement website is ready to use. Customize it, invite your guests, and celebrate! 

Need help? Check the code comments or GitHub issues.

Good luck! 💕
