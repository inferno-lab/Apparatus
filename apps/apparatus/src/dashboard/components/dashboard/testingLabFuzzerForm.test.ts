import { describe, expect, it } from 'vitest';
import { buildTestingLabFuzzerPayload, parseJsonObject } from './testingLabFuzzerForm';

type FuzzerInput = Parameters<typeof buildTestingLabFuzzerPayload>[0];

function buildInput(overrides: Partial<FuzzerInput> = {}): FuzzerInput {
  return {
    target: '',
    path: '/echo',
    method: 'GET',
    headersText: '{}',
    queryText: '{}',
    bodyText: '',
    bodyMode: 'json',
    timeoutText: '',
    ...overrides,
  };
}

describe('testingLabFuzzerForm', () => {
  describe('parseJsonObject', () => {
    it('returns undefined for blank input', () => {
      expect(parseJsonObject('   ', 'Headers')).toBeUndefined();
    });

    it('parses valid JSON object syntax and trims surrounding whitespace', () => {
      expect(parseJsonObject('  {"x-test":"value"}  ', 'Headers')).toEqual({ 'x-test': 'value' });
    });

    it('throws on invalid JSON syntax', () => {
      expect(() => parseJsonObject('{bad', 'Headers')).toThrow('Headers must be valid JSON object syntax.');
    });

    it('throws when parsed value is not an object', () => {
      expect(() => parseJsonObject('[1,2,3]', 'Query')).toThrow('Query must be a JSON object.');
      expect(() => parseJsonObject('null', 'Query')).toThrow('Query must be a JSON object.');
      expect(() => parseJsonObject('"hello"', 'Query')).toThrow('Query must be a JSON object.');
      expect(() => parseJsonObject('42', 'Query')).toThrow('Query must be a JSON object.');
      expect(() => parseJsonObject('true', 'Query')).toThrow('Query must be a JSON object.');
    });
  });

  describe('buildTestingLabFuzzerPayload', () => {
    it('builds payload with normalized defaults', () => {
      const payload = buildTestingLabFuzzerPayload(
        buildInput({
          target: '   ',
          path: '',
          headersText: '',
          queryText: '',
        }),
      );

      expect(payload).toEqual({
        target: undefined,
        path: '/echo',
        method: 'GET',
        headers: undefined,
        query: undefined,
        body: undefined,
        timeoutMs: undefined,
      });
    });

    it('accepts valid http/https targets, trims whitespace, and supports case-insensitive schemes', () => {
      const httpPayload = buildTestingLabFuzzerPayload(buildInput({ target: '  http://example.com  ' }));
      const httpsPayload = buildTestingLabFuzzerPayload(buildInput({ target: 'https://example.com' }));
      const uppercasePayload = buildTestingLabFuzzerPayload(buildInput({ target: 'HTTP://EXAMPLE.COM' }));
      const portPathPayload = buildTestingLabFuzzerPayload(
        buildInput({ target: 'http://localhost:8080/api?mode=strict' }),
      );

      expect(httpPayload.target).toBe('http://example.com');
      expect(httpsPayload.target).toBe('https://example.com');
      expect(uppercasePayload.target).toBe('HTTP://EXAMPLE.COM');
      expect(portPathPayload.target).toBe('http://localhost:8080/api?mode=strict');
    });

    it('rejects target URLs without http or https scheme', () => {
      expect(() => buildTestingLabFuzzerPayload(buildInput({ target: 'ftp://example.com' }))).toThrow(
        'Target must start with http:// or https://',
      );
      expect(() => buildTestingLabFuzzerPayload(buildInput({ target: 'example.com' }))).toThrow(
        'Target must start with http:// or https://',
      );
    });

    it('rejects malformed http/https target URLs without a hostname', () => {
      expect(() => buildTestingLabFuzzerPayload(buildInput({ target: 'http://' }))).toThrow(
        'Target must be a valid http:// or https:// URL.',
      );
      expect(() => buildTestingLabFuzzerPayload(buildInput({ target: 'https://  ' }))).toThrow(
        'Target must be a valid http:// or https:// URL.',
      );
    });

    it('normalizes headers and query values on happy path', () => {
      const payload = buildTestingLabFuzzerPayload(
        buildInput({
          headersText: '{"Authorization":"Bearer token","X-Test":"value"}',
          queryText: '{"q":"search","page":1,"active":true}',
        }),
      );

      expect(payload.headers).toEqual({
        Authorization: 'Bearer token',
        'X-Test': 'value',
      });
      expect(payload.query).toEqual({
        q: 'search',
        page: 1,
        active: true,
      });
    });

    it('rejects non-string header values and non-primitive query values', () => {
      expect(() => buildTestingLabFuzzerPayload(buildInput({ headersText: '{"X-Test": 1}' }))).toThrow(
        'Header "X-Test" must be a string value.',
      );

      expect(() =>
        buildTestingLabFuzzerPayload(
          buildInput({
            queryText: '{"q": {"nested": true}}',
          }),
        ),
      ).toThrow('Query "q" must be string, number, or boolean.');

      expect(() =>
        buildTestingLabFuzzerPayload(
          buildInput({
            queryText: '{"q": null}',
          }),
        ),
      ).toThrow('Query "q" must be string, number, or boolean.');
    });

    it('parses JSON body in json mode and preserves raw body in raw mode', () => {
      const jsonModePayload = buildTestingLabFuzzerPayload(
        buildInput({
          method: 'POST',
          bodyText: '{"probe":"xss"}',
          bodyMode: 'json',
        }),
      );
      expect(jsonModePayload.body).toEqual({ probe: 'xss' });

      const rawModePayload = buildTestingLabFuzzerPayload(
        buildInput({
          method: 'POST',
          bodyText: '  raw-text-payload  ',
          bodyMode: 'raw',
        }),
      );
      expect(rawModePayload.body).toBe('  raw-text-payload  ');

      const rawWhitespacePayload = buildTestingLabFuzzerPayload(
        buildInput({
          method: 'POST',
          bodyText: '   ',
          bodyMode: 'raw',
        }),
      );
      expect(rawWhitespacePayload.body).toBeUndefined();
    });

    it('rejects invalid JSON body when in json mode', () => {
      expect(() =>
        buildTestingLabFuzzerPayload(
          buildInput({
            method: 'POST',
            bodyText: '{not json}',
            bodyMode: 'json',
          }),
        ),
      ).toThrow('Body must be valid JSON when mode is JSON.');
    });

    it('normalizes timeout values and rejects unsupported timeout values', () => {
      const roundedPayload = buildTestingLabFuzzerPayload(buildInput({ timeoutText: '1234.6' }));
      const integerPayload = buildTestingLabFuzzerPayload(buildInput({ timeoutText: '5000' }));
      const maxBoundaryPayload = buildTestingLabFuzzerPayload(buildInput({ timeoutText: '60000' }));
      expect(roundedPayload.timeoutMs).toBe(1235);
      expect(integerPayload.timeoutMs).toBe(5000);
      expect(maxBoundaryPayload.timeoutMs).toBe(60000);

      expect(() => buildTestingLabFuzzerPayload(buildInput({ timeoutText: 'abc' }))).toThrow(
        'Timeout must be a positive number.',
      );
      expect(() => buildTestingLabFuzzerPayload(buildInput({ timeoutText: 'Infinity' }))).toThrow(
        'Timeout must be a positive number.',
      );
      expect(() => buildTestingLabFuzzerPayload(buildInput({ timeoutText: '0' }))).toThrow(
        'Timeout must be a positive number.',
      );
      expect(() => buildTestingLabFuzzerPayload(buildInput({ timeoutText: '-100' }))).toThrow(
        'Timeout must be a positive number.',
      );
      expect(() => buildTestingLabFuzzerPayload(buildInput({ timeoutText: '0.4' }))).toThrow(
        'Timeout must be a positive number.',
      );
      expect(() => buildTestingLabFuzzerPayload(buildInput({ timeoutText: '60001' }))).toThrow(
        'Timeout must be 60000ms or lower.',
      );
      expect(() => buildTestingLabFuzzerPayload(buildInput({ timeoutText: '90000' }))).toThrow(
        'Timeout must be 60000ms or lower.',
      );
    });

    it('produces a complete request object when all fields are populated', () => {
      const payload = buildTestingLabFuzzerPayload(
        buildInput({
          target: 'https://api.example.com',
          path: '/echo',
          method: 'POST',
          headersText: '{"Content-Type":"application/json"}',
          queryText: '{"mode":"strict","attempt":2,"dryRun":false}',
          bodyText: '{"probe":"xss"}',
          bodyMode: 'json',
          timeoutText: '1500',
        }),
      );

      expect(payload).toEqual({
        target: 'https://api.example.com',
        path: '/echo',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        query: { mode: 'strict', attempt: 2, dryRun: false },
        body: { probe: 'xss' },
        timeoutMs: 1500,
      });
    });
  });
});
