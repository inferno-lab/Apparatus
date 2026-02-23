import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import dgram from "dgram";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const tempDirs: string[] = [];

interface PersistencePaths {
  historyPath?: string;
  tarpitPath?: string;
  clusterPath?: string;
}

async function makeTempPath(prefix: string, fileName: string): Promise<string> {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), prefix));
  tempDirs.push(tempDir);
  return path.join(tempDir, fileName);
}

function setPersistenceEnv(paths: PersistencePaths) {
  if (paths.historyPath !== undefined) process.env.REQUEST_HISTORY_PATH = paths.historyPath;
  if (paths.tarpitPath !== undefined) process.env.TARPIT_STATE_PATH = paths.tarpitPath;
  if (paths.clusterPath !== undefined) process.env.CLUSTER_STATE_PATH = paths.clusterPath;
}

async function createIsolatedApp(paths: PersistencePaths) {
  setPersistenceEnv(paths);
  vi.resetModules();
  const { createApp } = await import("../src/app.js");
  return createApp();
}

async function readJsonFileWithRetry<T>(filePath: string, attempts = 40, delayMs = 25): Promise<T> {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const raw = await readFile(filePath, "utf8");
      return JSON.parse(raw) as T;
    } catch (error: any) {
      const isTransientParseError = error instanceof SyntaxError;
      if (i === attempts - 1 || (error?.code !== "ENOENT" && !isTransientParseError)) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error(`Failed to read ${filePath}`);
}

async function waitForHistoryEntry(
  filePath: string,
  matcher: (entries: Array<{ query?: Record<string, string> }>) => boolean,
  attempts = 40,
  delayMs = 25
) {
  for (let i = 0; i < attempts; i += 1) {
    const state = await readJsonFileWithRetry<{ entries: Array<{ query?: Record<string, string> }> }>(filePath);
    if (matcher(state.entries)) {
      return state;
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error(`Timed out waiting for matching history entry in ${filePath}`);
}

async function waitForTarpitState(
  filePath: string,
  matcher: (entries: Array<{ ip: string }>) => boolean,
  attempts = 40,
  delayMs = 25
) {
  for (let i = 0; i < attempts; i += 1) {
    const state = await readJsonFileWithRetry<{ entries: Array<{ ip: string }> }>(filePath);
    if (matcher(state.entries)) {
      return state;
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error(`Timed out waiting for matching tarpit state in ${filePath}`);
}

afterEach(async () => {
  delete process.env.REQUEST_HISTORY_PATH;
  delete process.env.TARPIT_STATE_PATH;
  delete process.env.CLUSTER_STATE_PATH;
  delete process.env.CLUSTER_SHARED_SECRET;
  delete process.env.CLUSTER_ATTACK_ALLOWLIST;
  vi.resetModules();
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe.sequential("History/Tarpit/Cluster Persistence", () => {
  it("hydrates request history from disk and flushes updates", async () => {
    const historyPath = await makeTempPath("apparatus-history-", "history.json");
    await writeFile(historyPath, JSON.stringify({ entries: [{ path: "/seeded", method: "GET", query: {} }] }, null, 2));

    const app = await createIsolatedApp({ historyPath });

    const initialHistory = await request(app).get("/history");
    expect(initialHistory.status).toBe(200);
    expect(initialHistory.body.some((entry: { path: string }) => entry.path === "/seeded")).toBe(true);

    await request(app).delete("/history").expect(204);
    await request(app).get("/echo?persist=history").expect(200);

    const persisted = await waitForHistoryEntry(
      historyPath,
      (entries) => entries.some((entry) => entry.query?.persist === "history")
    );
    expect(persisted.entries.some((entry) => entry.query?.persist === "history")).toBe(true);
  });

  it("keeps history API working when history path is unwritable", async () => {
    const historyPath = await makeTempPath("apparatus-history-", "history-dir");
    await mkdir(historyPath, { recursive: true });
    const app = await createIsolatedApp({ historyPath });

    await request(app).delete("/history").expect(204);
    await request(app).get("/echo?persist=memory").expect(200);
    const historyRes = await request(app).get("/history");
    expect(historyRes.status).toBe(200);
    expect(historyRes.body.length).toBeGreaterThan(0);
  });

  it("hydrates tarpit state and flushes trap/release updates", async () => {
    const tarpitPath = await makeTempPath("apparatus-tarpit-", "tarpit.json");
    await writeFile(
      tarpitPath,
      JSON.stringify({ entries: [{ ip: "198.51.100.77", trappedAt: Date.now() - 1000 }] }, null, 2)
    );

    const app = await createIsolatedApp({ tarpitPath });
    const hydrated = await request(app).get("/tarpit");
    expect(hydrated.status).toBe(200);
    expect(hydrated.body.trapped.some((entry: { ip: string }) => entry.ip === "198.51.100.77")).toBe(true);

    await request(app).post("/tarpit/trap").send({ ip: "198.51.100.88" }).expect(200);
    const trappedState = await waitForTarpitState(
      tarpitPath,
      (entries) => entries.some((entry) => entry.ip === "198.51.100.88")
    );
    expect(trappedState.entries.some((entry) => entry.ip === "198.51.100.88")).toBe(true);

    await request(app).post("/tarpit/release").send({ ip: "198.51.100.88" }).expect(200);
    const releasedState = await waitForTarpitState(
      tarpitPath,
      (entries) => !entries.some((entry) => entry.ip === "198.51.100.88")
    );
    expect(releasedState.entries.some((entry) => entry.ip === "198.51.100.88")).toBe(false);
  });

  it("keeps tarpit APIs working when state path is unwritable", async () => {
    const tarpitPath = await makeTempPath("apparatus-tarpit-", "tarpit-dir");
    await mkdir(tarpitPath, { recursive: true });
    const app = await createIsolatedApp({ tarpitPath });

    await request(app).post("/tarpit/trap").send({ ip: "198.51.100.99" }).expect(200);
    const list = await request(app).get("/tarpit");
    expect(list.status).toBe(200);
    expect(list.body.trapped.some((entry: { ip: string }) => entry.ip === "198.51.100.99")).toBe(true);
  });

  it("hydrates cluster member state from disk", async () => {
    const clusterPath = await makeTempPath("apparatus-cluster-", "cluster.json");
    await writeFile(
      clusterPath,
      JSON.stringify({ members: [{ ip: "192.168.10.50", lastSeen: Date.now() - 1000 }] }, null, 2)
    );

    const app = await createIsolatedApp({ clusterPath });
    const members = await request(app).get("/cluster/members");
    expect(members.status).toBe(200);
    expect(members.body.some((member: { ip: string }) => member.ip === "192.168.10.50")).toBe(true);
  });

  it("flushes cluster member updates after beacon processing", async () => {
    const clusterPath = await makeTempPath("apparatus-cluster-", "cluster.json");
    setPersistenceEnv({ clusterPath });
    vi.resetModules();
    const clusterModule = await import("../src/cluster.js");
    const port = 42000 + Math.floor(Math.random() * 10000);
    const cluster = clusterModule.startClusterNode({ port, host: "127.0.0.1" });

    await new Promise<void>((resolve) => {
      try {
        cluster.socket.address();
        resolve();
      } catch {
        cluster.socket.once("listening", resolve);
      }
    });

    const socket = dgram.createSocket("udp4");
    await new Promise<void>((resolve) => {
      socket.send(JSON.stringify({ type: "BEACON", ip: "192.168.10.51" }), port, "127.0.0.1", () => {
        socket.close();
        resolve();
      });
    });

    const persisted = await readJsonFileWithRetry<{ members: Array<{ ip: string }> }>(clusterPath);
    expect(persisted.members.some((member) => member.ip === "192.168.10.51")).toBe(true);
    cluster.stop();
  });

  it("keeps cluster state in memory when path is unwritable", async () => {
    const clusterPath = await makeTempPath("apparatus-cluster-", "cluster-dir");
    await mkdir(clusterPath, { recursive: true });
    setPersistenceEnv({ clusterPath });
    vi.resetModules();
    const clusterModule = await import("../src/cluster.js");
    const port = 52000 + Math.floor(Math.random() * 5000);
    const cluster = clusterModule.startClusterNode({ port, host: "127.0.0.1" });

    await new Promise<void>((resolve) => {
      try {
        cluster.socket.address();
        resolve();
      } catch {
        cluster.socket.once("listening", resolve);
      }
    });

    const socket = dgram.createSocket("udp4");
    await new Promise<void>((resolve) => {
      socket.send(JSON.stringify({ type: "BEACON", ip: "192.168.10.52" }), port, "127.0.0.1", () => {
        socket.close();
        resolve();
      });
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(clusterModule.getClusterMembers().some((member: { ip: string }) => member.ip === "192.168.10.52")).toBe(true);
    cluster.stop();
  });
});
