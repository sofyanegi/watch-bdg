import type { Metadata } from 'next';

import Navbar from '@/components/common/Navbar';
import ScrollToTop from '@/components/common/ScrollToTop';

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
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white pt-24 md:pt-20">{children}</main>
      <Toaster />
      <ScrollToTop />
    </>
  );
}
