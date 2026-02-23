import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const tempDirs: string[] = [];

async function makeTempHistoryPath(fileName = "deception-history.json"): Promise<string> {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "apparatus-deception-"));
  tempDirs.push(tempDir);
  return path.join(tempDir, fileName);
}

async function createIsolatedApp(historyPath: string) {
  process.env.DECEPTION_HISTORY_PATH = historyPath;
  vi.resetModules();
  const { createApp } = await import("../src/app.js");
  return createApp();
}

async function readFileWithRetry(filePath: string, attempts = 30, delayMs = 25): Promise<string> {
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await readFile(filePath, "utf8");
    } catch (error: any) {
      if (error?.code !== "ENOENT" || i === attempts - 1) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error(`Failed to read file after ${attempts} attempts: ${filePath}`);
}

afterEach(async () => {
  delete process.env.DECEPTION_HISTORY_PATH;
  vi.resetModules();
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe.sequential("Deception History Persistence", () => {
  it("hydrates deception history from disk on startup", async () => {
    const historyPath = await makeTempHistoryPath();
    await writeFile(
      historyPath,
      JSON.stringify(
        {
          events: [
            {
              timestamp: new Date("2024-01-01T00:00:00.000Z").toISOString(),
              ip: "127.0.0.1",
              type: "honeypot_hit",
              route: "/admin",
              details: { method: "GET" },
            },
          ],
        },
        null,
        2
      )
    );

    const app = await createIsolatedApp(historyPath);
    const historyRes = await request(app).get("/deception/history");
    expect(historyRes.status).toBe(200);
    expect(historyRes.body.count).toBe(1);
    expect(historyRes.body.events[0].route).toBe("/admin");
  });

  it("flushes deception history when new events are recorded", async () => {
    const historyPath = await makeTempHistoryPath();
    const app = await createIsolatedApp(historyPath);

    const trapRes = await request(app).get("/admin");
    expect(trapRes.status).toBe(200);

    const rawHistory = await readFileWithRetry(historyPath);
    const parsed = JSON.parse(rawHistory) as { events: Array<{ route: string; type: string }> };
    expect(parsed.events.length).toBeGreaterThan(0);
    expect(parsed.events[0].route).toBe("/admin");
    expect(parsed.events[0].type).toBe("honeypot_hit");
  });

  it("flushes clear operations to disk", async () => {
    const historyPath = await makeTempHistoryPath();
    const app = await createIsolatedApp(historyPath);

    await request(app).get("/admin");
    const clearRes = await request(app).delete("/deception/history");
    expect(clearRes.status).toBe(200);
    expect(clearRes.body.status).toBe("cleared");

    const rawHistory = await readFile(historyPath, "utf8");
    const parsed = JSON.parse(rawHistory) as { events: unknown[] };
    expect(parsed.events).toEqual([]);
  });

  it("continues serving when deception history path is unwritable", async () => {
    const historyPath = await makeTempHistoryPath("history-dir");
    await mkdir(historyPath, { recursive: true });
    const app = await createIsolatedApp(historyPath);

    const trapRes = await request(app).get("/admin");
    expect(trapRes.status).toBe(200);

    const historyRes = await request(app).get("/deception/history");
    expect(historyRes.status).toBe(200);
    expect(historyRes.body.count).toBeGreaterThan(0);
  });
});
