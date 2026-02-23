import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const tempDirs: string[] = [];

async function makeTempStorePath(fileName = "webhooks.json"): Promise<string> {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "apparatus-webhooks-"));
  tempDirs.push(tempDir);
  return path.join(tempDir, fileName);
}

async function createIsolatedApp(storePath: string) {
  process.env.WEBHOOK_STORE_PATH = storePath;
  vi.resetModules();
  const { createApp } = await import("../src/app.js");
  return createApp();
}

afterEach(async () => {
  delete process.env.WEBHOOK_STORE_PATH;
  vi.resetModules();
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe.sequential("Webhook Persistence", () => {
  it("hydrates webhook buffers from disk on startup", async () => {
    const storePath = await makeTempStorePath();
    await writeFile(
      storePath,
      JSON.stringify(
        {
          hooks: {
            "persisted-hook": [
              {
                id: "persisted-hook",
                timestamp: new Date("2024-01-01T00:00:00.000Z").toISOString(),
                method: "POST",
                headers: { "content-type": "application/json" },
                body: { event: "hydrated" },
                query: {},
                ip: "127.0.0.1",
              },
            ],
          },
        },
        null,
        2
      )
    );

    const app = await createIsolatedApp(storePath);
    const inspectRes = await request(app).get("/hooks/persisted-hook/inspect");
    expect(inspectRes.status).toBe(200);
    expect(inspectRes.body).toHaveLength(1);
    expect(inspectRes.body[0].body).toMatchObject({ event: "hydrated" });
  });

  it("flushes webhook buffers to disk after receive", async () => {
    const storePath = await makeTempStorePath();
    const app = await createIsolatedApp(storePath);

    const receiveRes = await request(app).post("/hooks/persist-hook").send({ seq: 1 });
    expect(receiveRes.status).toBe(200);

    const rawStore = await readFile(storePath, "utf8");
    const parsed = JSON.parse(rawStore) as {
      hooks: Record<string, Array<{ body: { seq: number } }>>;
    };
    expect(parsed.hooks["persist-hook"]).toBeDefined();
    expect(parsed.hooks["persist-hook"][0].body.seq).toBe(1);
  });

  it("continues serving when webhook store path is unwritable", async () => {
    const storePath = await makeTempStorePath("store-dir");
    await mkdir(storePath, { recursive: true });
    const app = await createIsolatedApp(storePath);

    const receiveRes = await request(app).post("/hooks/memory-hook").send({ seq: 2 });
    expect(receiveRes.status).toBe(200);

    const inspectRes = await request(app).get("/hooks/memory-hook/inspect");
    expect(inspectRes.status).toBe(200);
    expect(inspectRes.body).toHaveLength(1);
    expect(inspectRes.body[0].body.seq).toBe(2);
  });
});
