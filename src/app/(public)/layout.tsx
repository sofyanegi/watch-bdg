import Navbar from '@/components/common/Navbar';
import ScrollToTop from '@/components/common/ScrollToTop';

import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <main className="flex-1 mt-2">{children}</main>
      <Toaster />
      <ScrollToTop />
    </div>
  );
}
