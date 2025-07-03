type FetcherMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetcherOptions {
  method?: FetcherMethod;
  body?: Record<string, unknown> | null;
  headers?: Record<string, string>;
}

interface FetcherError extends Error {
  info?: any;
  status?: number;
}

const fetcher = async <T = any>(
  url: string,
  { method = 'GET', body = null, headers = {} }: FetcherOptions = {}
): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorData = await response.json();
    const error: FetcherError = new Error('An error occurred while fetching the data.');
    error.info = errorData;
    error.status = response.status;
    throw error;
  }

  return response.json();
};

export default fetcher;
