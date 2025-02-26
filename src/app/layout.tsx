import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/common/Navbar';
import SessionProvider from '@/context/SessionProvider';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';
import ScrollToTop from '@/components/common/ScrollToTop';
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
            <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white pt-24">{children}</main>
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  );
}
