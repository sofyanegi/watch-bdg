'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Button
        onClick={() => signIn('google')}
        className="flex items-center  bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
      >
        <Image src="/google.svg" alt="Google" width={24} height={24} />
        <span className="ml-3 font-medium">Sign in with Google</span>
      </Button>
    </div>
  );
}
