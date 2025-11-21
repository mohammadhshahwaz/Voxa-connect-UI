const DEFAULT_BASE_URL = "https://api.performedge.ai";

function getBaseUrl(): string {
  const viteUrl = (import.meta as any)?.env?.VITE_API_BASE_URL;
  // @ts-ignore
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
      headers: { 'Content-Type': 'application/json', ...(rest.headers || {}) },
      signal: controller.signal,
      ...rest,
    });
    const contentType = res.headers.get('content-type') || '';
    const body = contentType.includes('application/json') ? await res.json() : await res.text();
    if (!res.ok) {
      const message = typeof body === 'string' ? body : body?.message || `Request failed with status ${res.status}`;
      return { ok: false, error: message, status: res.status };
    }
    return { ok: true, data: body as T };
  } catch (err: any) {
    if (err?.name === 'AbortError') return { ok: false, error: 'Request timed out', status: 408 };
    return { ok: false, error: err?.message || 'Network error' };
  } finally {
    clearTimeout(id);
  }
}

// Types inferred from Postman collection
export interface ListSessionsResponse {
  meta?: any;
  user_id?: string;
  sessions?: string[];
  remaining?: number;
  message?: string;
}

export interface ListMessagesResponse {
  meta?: any;
  user_id?: string;
  session_id?: string;
  message_results?: Array<{
    role: 'user' | 'assistant' | string;
    content: string;
    message_id: string;
    num_chunks?: number;
    stream?: boolean;
    session_id?: string;
    order?: number;
  }>;
  remaining?: number;
  message?: string;
}

export async function listSessions(user_id: string, offset = 0, limit = 100) {
  const qp = `?offset=${encodeURIComponent(offset)}&limit=${encodeURIComponent(limit)}`;
  return request<ListSessionsResponse>(`/api/v1/list_sessions${qp}`, {
    method: 'POST',
    body: JSON.stringify({ user_id }),
  });
}

export async function listMessages(user_id: string, session_id: string, offset = 0, limit = 100) {
  const qp = `?offset=${encodeURIComponent(offset)}&limit=${encodeURIComponent(limit)}`;
  return request<ListMessagesResponse>(`/api/v1/list_messages${qp}`, {
    method: 'POST',
    body: JSON.stringify({ user_id, session_id }),
  });
}
