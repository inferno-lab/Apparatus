import { useCallback, useState } from 'react';
import { useApparatus } from '../providers/ApparatusProvider';

export type PrimitiveValue = string | number | boolean;

export interface RedTeamFuzzerRunRequest {
  target?: string;
  path?: string;
  method?: string;
  headers?: Record<string, string>;
  query?: Record<string, PrimitiveValue>;
  body?: unknown;
  timeoutMs?: number;
}

export interface RedTeamFuzzerRunResponse {
  request: {
    method: string;
    url: string;
    timeoutMs: number;
    hasBody: boolean;
  };
  response: {
    status: number | null;
    blocked: boolean;
    durationMs: number;
    headers: Record<string, string>;
    bodyBytes: number;
    bodyPreview: string;
    bodyTruncated: boolean;
    error?: string;
    errorCode?: string;
  };
}

export function useRedTeamFuzzer() {
  const { baseUrl } = useApparatus();
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<RedTeamFuzzerRunResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runFuzzer = useCallback(async (payload: RedTeamFuzzerRunRequest) => {
    if (!baseUrl) {
      setError('No base URL configured.');
      return null;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/api/redteam/fuzzer/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        const message = typeof data?.error === 'string' ? data.error : `Request failed (${res.status})`;
        setError(message);
        return null;
      }

      setLastResult(data as RedTeamFuzzerRunResponse);
      return data as RedTeamFuzzerRunResponse;
    } catch (runError) {
      const message = runError instanceof Error ? runError.message : 'Request failed';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl]);

  return {
    runFuzzer,
    lastResult,
    isLoading,
    error,
  };
}
