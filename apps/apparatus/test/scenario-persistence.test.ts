import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const tempDirs: string[] = [];

async function makeTempCatalogPath(fileName = "scenarios.json"): Promise<string> {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "apparatus-scenarios-"));
  tempDirs.push(tempDir);
  return path.join(tempDir, fileName);
}

async function createIsolatedApp(catalogPath: string) {
  process.env.SCENARIO_CATALOG_PATH = catalogPath;
  vi.resetModules();
  const { createApp } = await import("../src/app.js");
  return createApp();
}

afterEach(async () => {
  delete process.env.SCENARIO_CATALOG_PATH;
  vi.resetModules();
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe.sequential("Scenario Catalog Persistence", () => {
  it("hydrates scenarios from catalog file on app startup", async () => {
    const catalogPath = await makeTempCatalogPath();
    await writeFile(
      catalogPath,
      JSON.stringify(
        {
          scenarios: [
            {
              id: "persisted-scenario",
              name: "persisted",
              steps: [{ id: "s1", action: "delay", params: { duration: 5 } }],
              createdAt: new Date("2024-01-01T00:00:00.000Z").toISOString(),
            },
          ],
        },
        null,
        2
      )
    );

    const app = await createIsolatedApp(catalogPath);
    const listRes = await request(app).get("/scenarios");

    expect(listRes.status).toBe(200);
    expect(listRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "persisted-scenario",
          name: "persisted",
        }),
      ])
    );
  });

  it("flushes saved scenarios to disk", async () => {
    const catalogPath = await makeTempCatalogPath();
    const app = await createIsolatedApp(catalogPath);

    const saveRes = await request(app).post("/scenarios").send({
      id: "disk-scenario",
      name: "disk-test",
      steps: [{ id: "s1", action: "delay", params: { duration: 10 } }],
    });

    expect(saveRes.status).toBe(200);

    const rawCatalog = await readFile(catalogPath, "utf8");
    const parsedCatalog = JSON.parse(rawCatalog) as { scenarios: Array<{ id: string; name: string }> };
    expect(parsedCatalog.scenarios).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "disk-scenario",
          name: "disk-test",
        }),
      ])
    );
  });

  it("continues serving scenario saves when catalog path is unwritable", async () => {
    const catalogPath = await makeTempCatalogPath("catalog-dir");
    await mkdir(catalogPath, { recursive: true });
    const app = await createIsolatedApp(catalogPath);

    const saveRes = await request(app).post("/scenarios").send({
      id: "memory-only-scenario",
      name: "memory-only",
      steps: [{ id: "s1", action: "delay", params: { duration: 5 } }],
    });

    expect(saveRes.status).toBe(200);
    expect(saveRes.body.id).toBe("memory-only-scenario");

    const listRes = await request(app).get("/scenarios");
    expect(listRes.status).toBe(200);
    expect(listRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "memory-only-scenario",
        }),
      ])
    );
  });
});
