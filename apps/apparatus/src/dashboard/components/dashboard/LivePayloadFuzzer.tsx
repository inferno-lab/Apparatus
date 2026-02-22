import { useState } from 'react';
import { AlertTriangle, Play, Target } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useRedTeamFuzzer } from '../../hooks/useRedTeamFuzzer';
import { buildTestingLabFuzzerPayload } from './testingLabFuzzerForm';

interface LivePayloadFuzzerFormState {
  target: string;
  path: string;
  method: string;
  headersText: string;
  queryText: string;
  bodyText: string;
  bodyMode: 'json' | 'raw';
  timeoutText: string;
}

const DEFAULT_FUZZER_FORM: LivePayloadFuzzerFormState = {
  target: '',
  path: '/echo',
  method: 'GET',
  // Intentional starter payloads for security testing workflows.
  headersText: '{\n  "X-Payload": "<script>alert(1)</script>"\n}',
  queryText: '{\n  "q": "<script>alert(1)</script>"\n}',
  bodyText: '{\n  "probe": "xss"\n}',
  bodyMode: 'json',
  timeoutText: '5000',
};

export function LivePayloadFuzzer() {
  const {
    runFuzzer,
    lastResult: lastFuzzerResult,
    isLoading: isFuzzerLoading,
    error: fuzzerError
  } = useRedTeamFuzzer();

  const [form, setForm] = useState<LivePayloadFuzzerFormState>(DEFAULT_FUZZER_FORM);
  const [fuzzerFormError, setFuzzerFormError] = useState<string | null>(null);

  const updateFormField = <K extends keyof LivePayloadFuzzerFormState>(
    field: K,
    value: LivePayloadFuzzerFormState[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(DEFAULT_FUZZER_FORM);
    setFuzzerFormError(null);
  };

  const handleTimeoutInputChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      updateFormField('timeoutText', value);
    }
  };

  const handleFuzzerRun = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isFuzzerLoading) return;
    setFuzzerFormError(null);

    try {
      const payload = buildTestingLabFuzzerPayload(form);
      await runFuzzer(payload);
    } catch (parseError) {
      const message = parseError instanceof Error ? parseError.message : 'Invalid fuzzer request input.';
      setFuzzerFormError(message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div>
        <Card variant="glass" glow="primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target aria-hidden="true" className="h-4 w-4 text-primary-500" />
              Live Payload Fuzzer
            </CardTitle>
            <CardDescription>Build one request, execute it, and inspect normalized response telemetry.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFuzzerRun} className="space-y-3" aria-label="Live Payload Fuzzer">
              <div>
                <label htmlFor="fuzzer-target" className="text-xs font-mono text-neutral-400 uppercase">Target URL (Optional)</label>
                <input
                  id="fuzzer-target"
                  type="text"
                  aria-describedby="fuzzer-target-hint"
                  value={form.target}
                  onChange={(event) => updateFormField('target', event.target.value)}
                  placeholder="http://127.0.0.1:8090"
                  className="w-full mt-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-sm text-sm font-mono text-white focus:outline-none focus:border-primary-500"
                />
                <p id="fuzzer-target-hint" className="text-[10px] text-neutral-500 mt-1">
                  Targets are restricted server-side to localhost or APPARATUS_FUZZER_ALLOWED_TARGETS.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="fuzzer-method" className="text-xs font-mono text-neutral-400 uppercase">Method</label>
                  <Select value={form.method} onValueChange={(value) => updateFormField('method', value)}>
                    <SelectTrigger id="fuzzer-method" className="w-full bg-neutral-900 border-neutral-800 text-neutral-300 h-9 font-mono text-xs mt-1">
                      <SelectValue placeholder="Method" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-neutral-800">
                      {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map((method) => (
                        <SelectItem key={method} value={method} className="text-neutral-300 hover:bg-neutral-800 cursor-pointer font-mono text-xs">
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="fuzzer-timeout" className="text-xs font-mono text-neutral-400 uppercase">Timeout (ms)</label>
                  <input
                    id="fuzzer-timeout"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={form.timeoutText}
                    onChange={(event) => handleTimeoutInputChange(event.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-sm text-sm font-mono text-white focus:outline-none focus:border-primary-500"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">Leave blank to use default timeout.</p>
                </div>
              </div>
              <div>
                <label htmlFor="fuzzer-path" className="text-xs font-mono text-neutral-400 uppercase">Path</label>
                <input
                  id="fuzzer-path"
                  type="text"
                  value={form.path}
                  onChange={(event) => updateFormField('path', event.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-sm text-sm font-mono text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label htmlFor="fuzzer-headers" className="text-xs font-mono text-neutral-400 uppercase">Headers (JSON Object)</label>
                <textarea
                  id="fuzzer-headers"
                  aria-describedby="fuzzer-headers-hint"
                  value={form.headersText}
                  onChange={(event) => updateFormField('headersText', event.target.value)}
                  rows={4}
                  maxLength={16_384}
                  className="w-full mt-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-primary-500"
                />
                <p id="fuzzer-headers-hint" className="text-[10px] text-neutral-500 mt-1">Example: {"{ \"X-Test\": \"value\" }"}</p>
              </div>
              <div>
                <label htmlFor="fuzzer-query" className="text-xs font-mono text-neutral-400 uppercase">Query (JSON Object)</label>
                <textarea
                  id="fuzzer-query"
                  aria-describedby="fuzzer-query-hint"
                  value={form.queryText}
                  onChange={(event) => updateFormField('queryText', event.target.value)}
                  rows={4}
                  maxLength={16_384}
                  className="w-full mt-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-primary-500"
                />
                <p id="fuzzer-query-hint" className="text-[10px] text-neutral-500 mt-1">Values must be string, number, or boolean.</p>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="fuzzer-body" className="text-xs font-mono text-neutral-400 uppercase">Body</label>
                  <div className="flex items-center gap-2" role="group" aria-label="Body format">
                    <button
                      type="button"
                      aria-pressed={form.bodyMode === 'json'}
                      onClick={() => updateFormField('bodyMode', 'json')}
                      className={`text-[10px] font-mono uppercase px-2 py-1 rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${form.bodyMode === 'json' ? 'border-primary-500 text-primary-300' : 'border-neutral-700 text-neutral-400'}`}
                    >
                      JSON
                    </button>
                    <button
                      type="button"
                      aria-pressed={form.bodyMode === 'raw'}
                      onClick={() => updateFormField('bodyMode', 'raw')}
                      className={`text-[10px] font-mono uppercase px-2 py-1 rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${form.bodyMode === 'raw' ? 'border-primary-500 text-primary-300' : 'border-neutral-700 text-neutral-400'}`}
                    >
                      Raw
                    </button>
                  </div>
                </div>
                <textarea
                  id="fuzzer-body"
                  aria-describedby="fuzzer-body-hint"
                  value={form.bodyText}
                  onChange={(event) => updateFormField('bodyText', event.target.value)}
                  rows={5}
                  maxLength={65_536}
                  className="w-full mt-1 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-sm text-xs font-mono text-white focus:outline-none focus:border-primary-500"
                />
                <p id="fuzzer-body-hint" className="text-[10px] text-neutral-500 mt-1">
                  JSON mode parses object/array values. Raw mode sends the exact string.
                </p>
              </div>

              {(fuzzerFormError || fuzzerError) && (
                <div role="alert" className="rounded-sm border border-destructive-500/40 bg-destructive-500/10 p-2 text-xs text-destructive-300 flex items-start gap-2">
                  <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span>{fuzzerFormError || fuzzerError}</span>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <Button type="button" variant="secondary" className="w-28" onClick={resetForm} disabled={isFuzzerLoading}>
                  RESET
                </Button>
                <Button type="submit" variant="default" className="flex-1" isLoading={isFuzzerLoading}>
                  {isFuzzerLoading ? 'Executing...' : 'Run Payload'}
                  {!isFuzzerLoading && <Play className="h-4 w-4 ml-2" aria-hidden="true" />}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card variant="panel" className="h-full min-h-[540px] flex flex-col">
          <CardHeader className="flex-none border-b border-neutral-800 pb-3">
            <CardTitle>Live Fuzzer Result</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0" aria-live="polite">
            {isFuzzerLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-500 p-8 text-center space-y-4">
                <Target aria-hidden="true" className="h-12 w-12 opacity-25 animate-pulse" />
                <p className="text-xs font-mono uppercase tracking-wide">Executing Payload...</p>
              </div>
            ) : !lastFuzzerResult ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-600 p-8 text-center space-y-4">
                <Target aria-hidden="true" className="h-16 w-16 opacity-20" />
                <div className="max-w-md">
                  <p className="text-sm font-medium text-neutral-400">Ready for One-Shot Payload Testing</p>
                  <p className="text-xs text-neutral-600 mt-1">
                    Build a request on the left and execute it to inspect response status, block classification, latency, and captured body preview.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-4 text-xs font-mono">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{lastFuzzerResult.request.method}</Badge>
                  <Badge variant="secondary">
                    {lastFuzzerResult.response.status == null ? 'NO STATUS' : `HTTP ${lastFuzzerResult.response.status}`}
                  </Badge>
                  <Badge variant={lastFuzzerResult.response.blocked ? 'destructive' : 'secondary'}>
                    {lastFuzzerResult.response.blocked ? 'BLOCKED' : 'PASSED'}
                  </Badge>
                  <Badge variant="secondary">{`${lastFuzzerResult.response.durationMs}ms`}</Badge>
                  <Badge variant="secondary">{`${lastFuzzerResult.response.bodyBytes} bytes`}</Badge>
                </div>

                <div className="space-y-1">
                  <p className="text-neutral-400 uppercase text-[10px]">Resolved Request</p>
                  <p className="text-neutral-300 break-all">{lastFuzzerResult.request.url}</p>
                  <p className="text-neutral-500">
                    timeout={lastFuzzerResult.request.timeoutMs}ms body={lastFuzzerResult.request.hasBody ? 'yes' : 'no'}
                  </p>
                </div>

                {lastFuzzerResult.response.error && (
                  <div className="rounded-sm border border-destructive-500/40 bg-destructive-500/10 p-2 text-destructive-300">
                    <p className="uppercase text-[10px] mb-1">Upstream Error</p>
                    <p>{lastFuzzerResult.response.error}</p>
                    {lastFuzzerResult.response.errorCode && (
                      <p className="text-destructive-400 mt-1">{`code=${lastFuzzerResult.response.errorCode}`}</p>
                    )}
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-neutral-400 uppercase text-[10px]">Response Headers</p>
                  <pre className="p-2 bg-neutral-900/60 rounded-sm text-[11px] overflow-x-auto text-neutral-300 whitespace-pre-wrap break-all">
                    {JSON.stringify(lastFuzzerResult.response.headers ?? {}, null, 2)}
                  </pre>
                </div>

                <div className="space-y-1">
                  <p className="text-neutral-400 uppercase text-[10px]">
                    Body Preview {lastFuzzerResult.response.bodyTruncated ? '(truncated)' : ''}
                  </p>
                  <pre className="p-2 bg-neutral-900/60 rounded-sm text-[11px] overflow-x-auto text-neutral-300 whitespace-pre-wrap break-all">
                    {lastFuzzerResult.response.bodyPreview || '[empty response body]'}
                  </pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
