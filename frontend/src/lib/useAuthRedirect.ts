'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken, getRefreshToken } from './auth';

export const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken && !refreshToken) {
      router.replace('/login');
    }
  }, [router]);
};
