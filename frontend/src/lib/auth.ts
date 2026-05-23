import { AuthUser } from './types';

const USER_KEY = 'bank_user';
const ACCESS_TOKEN_KEY = 'bank_access_token';
const REFRESH_TOKEN_KEY = 'bank_refresh_token';

export const getAccessToken = () =>
  typeof window === 'undefined' ? null : localStorage.getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getRefreshToken = () =>
  typeof window === 'undefined' ? null : localStorage.getItem(REFRESH_TOKEN_KEY);

export const setRefreshToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const clearTokens = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const setCurrentUser = (user: AuthUser) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};
