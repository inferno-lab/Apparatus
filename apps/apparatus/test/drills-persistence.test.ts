import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const tempDirs: string[] = [];

async function makeTempDrillRunsPath(fileName = "drill-runs.json"): Promise<string> {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "apparatus-drills-"));
  tempDirs.push(tempDir);
  return path.join(tempDir, fileName);
}

async function createIsolatedApp(drillRunsPath: string) {
  process.env.DRILL_RUNS_PATH = drillRunsPath;
  vi.resetModules();
  const { createApp } = await import("../src/app.js");
  return createApp();
}

afterEach(async () => {
  delete process.env.DRILL_RUNS_PATH;
  vi.resetModules();
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe.sequential("Drill Runs Persistence", () => {
  it("hydrates persisted drill run state on startup", async () => {
    const drillRunsPath = await makeTempDrillRunsPath();
    await writeFile(
      drillRunsPath,
      JSON.stringify(
        {
          runs: [
            {
              runId: "persisted-drill-run",
              drillId: "drill-cpu-leak-jr",
              drillName: "CPU Leak Containment",
              status: "failed",
              startedAt: new Date("2024-01-01T00:00:00.000Z").toISOString(),
              finishedAt: new Date("2024-01-01T00:01:00.000Z").toISOString(),
              failureReason: "Synthetic persistence fixture",
              timeline: [],
            },
          ],
          latestRunByDrill: {
            "drill-cpu-leak-jr": "persisted-drill-run",
          },
        },
        null,
        2
      )
    );

    const app = await createIsolatedApp(drillRunsPath);
    const statusRes = await request(app)
      .get("/drills/drill-cpu-leak-jr/status")
      .query({ runId: "persisted-drill-run" });

    expect(statusRes.status).toBe(200);
    expect(statusRes.body.runId).toBe("persisted-drill-run");
    expect(statusRes.body.drillId).toBe("drill-cpu-leak-jr");
    expect(statusRes.body.status).toBe("failed");
  });

  it("flushes new drill runs to disk on creation", async () => {
    const drillRunsPath = await makeTempDrillRunsPath();
    const app = await createIsolatedApp(drillRunsPath);

    const runRes = await request(app).post("/drills/drill-cpu-leak-jr/run");
    expect(runRes.status).toBe(202);
    const runId = runRes.body.runId as string;

    const rawState = await readFile(drillRunsPath, "utf8");
    const parsedState = JSON.parse(rawState) as {
      runs: Array<{ runId: string }>;
      latestRunByDrill: Record<string, string>;
    };
    expect(parsedState.runs.some((run) => run.runId === runId)).toBe(true);
    expect(parsedState.latestRunByDrill["drill-cpu-leak-jr"]).toBe(runId);

    await request(app).post("/drills/drill-cpu-leak-jr/cancel").send({ runId });
  });

  it("continues serving drill APIs when persistence path is unwritable", async () => {
    const drillRunsPath = await makeTempDrillRunsPath("drill-runs-dir");
    await mkdir(drillRunsPath, { recursive: true });
    const app = await createIsolatedApp(drillRunsPath);

    const runRes = await request(app).post("/drills/drill-ddos-sr/run");
    expect(runRes.status).toBe(202);
    const runId = runRes.body.runId as string;

    const statusRes = await request(app)
      .get("/drills/drill-ddos-sr/status")
      .query({ runId });
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.runId).toBe(runId);

    await request(app).post("/drills/drill-ddos-sr/cancel").send({ runId });
  });
});
