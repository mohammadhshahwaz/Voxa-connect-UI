// Centralized auth API client using fetch with timeout and robust error handling

const DEFAULT_BASE_URL = "http://98.90.206.21:8003";

function getBaseUrl(): string {
  // Support both CRA and Vite style env variables, with sensible fallback
  const viteUrl = (import.meta as any)?.env?.VITE_API_BASE_URL;
  // @ts-ignore process may exist in some setups
  const craUrl = typeof process !== 'undefined' ? (process as any)?.env?.REACT_APP_API_BASE_URL : undefined;
  return (viteUrl || craUrl || DEFAULT_BASE_URL)?.replace(/\/$/, "");
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string; status?: number };

async function request<T>(path: string, init: RequestInit & { timeoutMs?: number } = {}): Promise<ApiResult<T>> {
  const { timeoutMs = 15000, ...rest } = init;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  const url = `${getBaseUrl()}${path.startsWith('/') ? path : '/' + path}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(rest.headers || {}),
      },
      signal: controller.signal,
      ...rest,
    });

    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const body = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const message = typeof body === 'string' ? body : body?.message || `Request failed with status ${res.status}`;
      return { ok: false, error: message, status: res.status };
    }

    return { ok: true, data: body as T };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return { ok: false, error: 'Request timed out', status: 408 };
    }
    return { ok: false, error: err?.message || 'Network error' };
  } finally {
    clearTimeout(id);
  }
}

// Types based on the Postman collection examples
export interface LoginResponse {
  meta?: any;
  user_id?: string;
  api_key?: string;
  message?: string;
  is_valid?: boolean;
}

export interface RegisterResponse {
  meta?: any;
  user_id?: string;
  api_key?: string;
  message?: string;
}

export interface PersistedAuth {
  user_id?: string;
  api_key?: string;
  username?: string;
}

export async function login(username: string, password: string) {
  return request<LoginResponse>("/api/v1/login", {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function register(username: string, password: string) {
  return request<RegisterResponse>("/api/v1/register_user", {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function persistAuth(user: PersistedAuth | null) {
  try {
    if (!user) {
      localStorage.removeItem('auth');
    } else {
      localStorage.setItem('auth', JSON.stringify(user));
    }
  } catch {}
}

export function getPersistedAuth<T = PersistedAuth>() {
  try {
    const raw = localStorage.getItem('auth');
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
