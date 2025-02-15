import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from '@/app/components/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white pt-24">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
