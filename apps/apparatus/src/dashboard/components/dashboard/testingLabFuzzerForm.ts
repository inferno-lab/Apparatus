import type { PrimitiveValue, RedTeamFuzzerRunRequest } from '../../hooks/useRedTeamFuzzer';

type JsonRecord = Record<string, unknown>;

export interface TestingLabFuzzerInput {
  target: string;
  path: string;
  method: string;
  headersText: string;
  queryText: string;
  bodyText: string;
  bodyMode: 'json' | 'raw';
  timeoutText: string;
}

const MAX_TIMEOUT_MS = 60_000;

export function parseJsonObject(raw: string, label: string): JsonRecord | undefined {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return undefined;

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error(`${label} must be valid JSON object syntax.`);
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON object.`);
  }

  return parsed as JsonRecord;
}

function normalizeHeaders(input: JsonRecord | undefined): Record<string, string> | undefined {
  if (!input) return undefined;

  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value !== 'string') {
      throw new Error(`Header "${key}" must be a string value.`);
    }
    normalized[key] = value;
  }

  return normalized;
}

function normalizeQuery(input: JsonRecord | undefined): Record<string, PrimitiveValue> | undefined {
  if (!input) return undefined;

  const normalized: Record<string, PrimitiveValue> = {};
  for (const [key, value] of Object.entries(input)) {
    if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
      throw new Error(`Query "${key}" must be string, number, or boolean.`);
    }
    normalized[key] = value;
  }

  return normalized;
}

function normalizeBody(bodyText: string, mode: 'json' | 'raw'): unknown {
  const trimmedBody = bodyText.trim();
  if (trimmedBody.length === 0) return undefined;

  if (mode === 'json') {
    try {
      return JSON.parse(trimmedBody);
    } catch {
      throw new Error('Body must be valid JSON when mode is JSON.');
    }
  }

  return bodyText;
}

function normalizeTimeout(timeoutText: string): number | undefined {
  const trimmed = timeoutText.trim();
  if (trimmed.length === 0) return undefined;

  const parsed = Number(trimmed);
  if (Number.isNaN(parsed) || !Number.isFinite(parsed) || parsed <= 0) {
    throw new Error('Timeout must be a positive number.');
  }
  const rounded = Math.round(parsed);
  if (rounded <= 0) {
    throw new Error('Timeout must be a positive number.');
  }
  if (parsed > MAX_TIMEOUT_MS) {
    throw new Error(`Timeout must be ${MAX_TIMEOUT_MS}ms or lower.`);
  }

  return rounded;
}

function normalizeTarget(target: string): string | undefined {
  const trimmed = target.trim();
  if (trimmed.length === 0) return undefined;
  if (!/^https?:\/\//i.test(trimmed)) {
    throw new Error('Target must start with http:// or https://');
  }
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error('Target must be a valid http:// or https:// URL.');
  }
  if (!parsed.hostname) {
    throw new Error('Target must include a hostname.');
  }
  return trimmed;
}

export function buildTestingLabFuzzerPayload(input: TestingLabFuzzerInput): RedTeamFuzzerRunRequest {
  const headersJson = parseJsonObject(input.headersText, 'Headers');
  const queryJson = parseJsonObject(input.queryText, 'Query');

  return {
    target: normalizeTarget(input.target),
    path: input.path.trim() || '/echo',
    method: input.method,
    headers: normalizeHeaders(headersJson),
    query: normalizeQuery(queryJson),
    body: normalizeBody(input.bodyText, input.bodyMode),
    timeoutMs: normalizeTimeout(input.timeoutText),
  };
}
