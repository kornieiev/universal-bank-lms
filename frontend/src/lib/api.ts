import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from './auth';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

type RequestOptions = Omit<RequestInit, 'headers' | 'body'> & {
  headers?: Record<string, string>;
  body?: unknown;
};

let isRefreshing: boolean = false;
let refreshPromise: Promise<void> | null = null;

const refreshAuthToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  if (!refreshPromise) {
    isRefreshing = true;

      refreshPromise = fetch(`${baseUrl}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Refresh failed');
        return res.json();
      })
      .then((data) => {
        setAccessToken(data.token);
        setRefreshToken(data.refreshToken);
      })
      .finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });

    
  }

  return refreshPromise;
};

const request = async (path: string, options: RequestOptions = {}) => {
  const { body, headers: customHeaders, ...restOptions } = options;
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders ?? {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${baseUrl}${path}`, {
    ...restOptions,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    try {
      await refreshAuthToken();
      const newToken = getAccessToken();
      if (!newToken) throw new Error('No new access token');

      const retryRes = await fetch(`${baseUrl}${path}`, {
        ...restOptions,
        headers: {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });

      if (!retryRes.ok) {
        if (retryRes.status === 401) clearTokens();
        const body = await retryRes.json();
        throw new Error(body?.message || 'Request failed');
      }
      return retryRes.json();
    } catch (error) {
      clearTokens();
      const errorMessage = error instanceof Error ? error.message : 'Unknown access error';

      if (errorMessage === 'No refresh token') {
        throw new Error('Не вірний логін / пароль');
      } else if (errorMessage === 'Unauthorized') {
        throw new Error('Ваша сессія завершена. Будь ласка, увійдіть ще раз');
      } else {
        throw new Error('Unknown access error');
      }
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || 'Server error');
  }

  return res.json();
};

export const apiGet = <T>(path: string) => request(path, { method: 'GET' }) as Promise<T>;
export const apiPost = <T>(path: string, body: unknown) =>
  request(path, { method: 'POST', body }) as Promise<T>;
