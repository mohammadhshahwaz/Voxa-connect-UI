const DEFAULT_BASE_URL = "http://98.90.206.21:8000";

function getBaseUrl(): string {
  const viteUrl = (import.meta as any)?.env?.VITE_API_BASE_URL;
  // @ts-ignore
  const craUrl = typeof process !== 'undefined' ? (process as any)?.env?.REACT_APP_API_BASE_URL : undefined;
  return (viteUrl || craUrl || DEFAULT_BASE_URL)?.replace(/\/$/, "");
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string; status?: number };

async function requestForm<T>(path: string, form: FormData, timeoutMs = 30000): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  const url = `${getBaseUrl()}${path.startsWith('/') ? path : '/' + path}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      body: form,
      signal: controller.signal,
    });
    const contentType = res.headers.get('content-type') || '';
    // Read as text first to avoid throwing on invalid/empty JSON
    const rawText = await res.text();
    let parsed: any = rawText;
    if (contentType.includes('application/json') && rawText) {
      try {
        parsed = JSON.parse(rawText);
      } catch {
        // keep raw text if JSON parse fails
      }
    }
    if (!res.ok) {
      const message = typeof parsed === 'string' ? (parsed || `Upload failed (${res.status})`) : parsed?.message || `Upload failed (${res.status})`;
      return { ok: false, error: message, status: res.status };
    }
    return { ok: true, data: parsed as T };
  } catch (err: any) {
    if (err?.name === 'AbortError') return { ok: false, error: 'Upload timed out', status: 408 };
    return { ok: false, error: err?.message || 'Network error during upload' };
  } finally {
    clearTimeout(id);
  }
}

export interface UploadResponse {
  meta?: any;
  success?: boolean;
  status_code?: number;
  message?: string;
  response_time?: number;
}

export async function uploadContext(file: File) {
  const form = new FormData();
  form.append('file', file);
  return requestForm<UploadResponse>('/dependencies/upload_context', form);
}
