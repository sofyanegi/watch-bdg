'use client';

import { ReactNode } from 'react';
import { Sidebar } from './_components/SideBar';
import Navbar from '@/components/common/Navbar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <Sidebar />
      <main className="p-4 sm:ml-64 min-h-screen">{children}</main>
    </div>
  );
}
