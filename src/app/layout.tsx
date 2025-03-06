import './globals.css';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';

import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google';

import type { Metadata } from 'next';

import SessionProvider from '@/context/SessionProvider';
import { ThemeProvider } from '@/context/ThemeContext';

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
            {children}
            <Analytics />
            <GoogleAnalytics gaId="G-H5ZCEMC97Y" />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
