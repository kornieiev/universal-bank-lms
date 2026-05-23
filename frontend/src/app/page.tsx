'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getAccessToken() ? '/courses' : '/login');
  }, [router]);

  return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
}