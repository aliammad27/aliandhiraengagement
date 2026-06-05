import type { Metadata } from "next";
import { Geist, Cormorant_Garamond, Great_Vibes, Amiri } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  variable: "--font-script",
  weight: ["400"],
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-arabic",
  weight: ["400", "700"],
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Ali & Hira",
  description: "Join us as we celebrate our engagement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${cormorant.variable} ${greatVibes.variable} ${amiri.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
