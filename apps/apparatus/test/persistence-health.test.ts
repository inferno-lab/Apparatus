import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const tempDirs: string[] = [];

async function makeTempPath(prefix: string, fileName: string): Promise<string> {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), prefix));
  tempDirs.push(tempDir);
  return path.join(tempDir, fileName);
}

async function createIsolatedApp() {
  vi.resetModules();
  const { createApp } = await import("../src/app.js");
  return createApp();
}

afterEach(async () => {
  delete process.env.SCENARIO_CATALOG_PATH;
  delete process.env.WEBHOOK_STORE_PATH;
  vi.resetModules();
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe.sequential("Persistence Health Endpoint", () => {
  it("exposes all registered persistence stores", async () => {
    const app = await createIsolatedApp();
    const res = await request(app).get("/admin/persistence/health");

    expect(res.status).toBe(200);
    const keys = new Set((res.body.stores as Array<{ key: string }>).map((store) => store.key));
    expect(keys.has("scenarioCatalog")).toBe(true);
    expect(keys.has("webhookStore")).toBe(true);
    expect(keys.has("deceptionHistory")).toBe(true);
    expect(keys.has("drillRuns")).toBe(true);
    expect(keys.has("requestHistory")).toBe(true);
    expect(keys.has("tarpitState")).toBe(true);
    expect(keys.has("clusterState")).toBe(true);
  });

  it("reports enabled and hydrated status for configured scenario persistence", async () => {
    const scenarioPath = await makeTempPath("apparatus-health-scenario-", "scenario.json");
    await writeFile(scenarioPath, JSON.stringify({ scenarios: [] }, null, 2));
    process.env.SCENARIO_CATALOG_PATH = scenarioPath;

    const app = await createIsolatedApp();
    await request(app).get("/scenarios").expect(200);
    const health = await request(app).get("/admin/persistence/health");

    expect(health.status).toBe(200);
    const scenarioStore = (health.body.stores as Array<any>).find((store) => store.key === "scenarioCatalog");
    expect(scenarioStore).toBeDefined();
    expect(scenarioStore.enabled).toBe(true);
    expect(scenarioStore.hydrated).toBe(true);
  });

  it("reports degraded state when a persistence write fails", async () => {
    const unwritablePath = await makeTempPath("apparatus-health-webhook-", "webhook-dir");
    await mkdir(unwritablePath, { recursive: true });
    process.env.WEBHOOK_STORE_PATH = unwritablePath;

    const app = await createIsolatedApp();
    await request(app).post("/hooks/health-check").send({ ok: true }).expect(200);
    const health = await request(app).get("/admin/persistence/health");

    expect(health.status).toBe(200);
    const webhookStore = (health.body.stores as Array<any>).find((store) => store.key === "webhookStore");
    expect(webhookStore).toBeDefined();
    expect(webhookStore.lastWriteOk).toBe(false);
    expect(health.body.summary.degraded).toBeGreaterThanOrEqual(1);
  });
});
