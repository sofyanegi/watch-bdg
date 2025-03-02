'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function AdminPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center w-80">
          <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mx-auto animate-pulse"></div>
          <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 mx-auto mt-4 animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-300 dark:bg-gray-700 mx-auto mt-2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center w-80">
        <Image src={user?.image || '/default-avatar.png'} alt={user?.name || 'Admin'} width={100} height={100} className="rounded-full mx-auto border-4 border-gray-300 dark:border-gray-600" />
        <h1 className="text-xl font-semibold mt-4">{user?.name || 'Admin'}</h1>
        <p className="text-gray-600 dark:text-gray-400">{user?.email || 'No email provided'}</p>
      </div>
    </div>
  );
}
