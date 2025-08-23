type FetcherMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';

type ResponseType = 'json' | 'text' | 'blob' | 'arrayBuffer' | 'formData';

interface FetcherOptions {
  method?: FetcherMethod;
  body?: Record<string, unknown> | null;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  responseType?: ResponseType;
}

interface FetcherError extends Error {
  info?: any;
  status?: number;
}

const fetcher = async <T = any>(
  url: string,
  { method = 'GET', body = null, headers = {}, signal, responseType = 'json' }: FetcherOptions = {}
): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    signal
  };

  if (body && !['GET', 'HEAD'].includes(method)) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    let errorData: any = null;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }
    const error: FetcherError = new Error(`Request failed with status ${response.status}`);
    error.info = errorData;
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null as T;
  }

  switch (responseType) {
    case 'text':
      return (await response.text()) as T;
    case 'blob':
      return (await response.blob()) as T;
    case 'arrayBuffer':
      return (await response.arrayBuffer()) as T;
    case 'formData':
      return (await response.formData()) as T;
    default:
      return (await response.json()) as T;
  }
};

export default fetcher;
