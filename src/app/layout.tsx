import './globals.css';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';

import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';

import SessionProvider from '@/context/SessionProvider';
import { ThemeProvider } from '@/context/ThemeContext';

import Navbar from '@/components/common/Navbar';
import ScrollToTop from '@/components/common/ScrollToTop';
import ClientInfo from '@/components/buttons/ClientInfo';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'watch BDG',
  description: 'Bandung Watch is a website that provides information about CCTV in Bandung.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ThemeProvider>
          <SessionProvider>
            <Navbar />
            <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white pt-24 md:pt-20">
              {children}
              <ClientInfo />
            </main>
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  );
}
