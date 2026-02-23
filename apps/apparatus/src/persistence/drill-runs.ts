import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { logger } from "../logger.js";

type PersistedDrillStatus = "pending" | "arming" | "active" | "stabilizing" | "won" | "failed" | "cancelled";

interface PersistedDrillTimelineEvent {
    at: string;
    type: string;
    message: string;
    data?: Record<string, unknown>;
}

interface PersistedDrillSnapshot {
    cpuPercent: number;
    errorRate: number;
    blockedSqliRatio: number;
    detectedMarked: boolean;
    clusterAttackActive: boolean;
    ghostTrafficActive: boolean;
}

interface PersistedDrillScore {
    total: number;
    ttdSec: number;
    ttmSec: number;
    ttrSec: number;
    penalties: Array<{ code: string; points: number; reason: string }>;
    bonuses: Array<{ code: string; points: number; reason: string }>;
}

export interface PersistedDrillRun {
    runId: string;
    drillId: string;
    drillName: string;
    status: PersistedDrillStatus;
    startedAt: string;
    finishedAt?: string;
    detectedAt?: string;
    mitigatedAt?: string;
    failureReason?: string;
    timeline: PersistedDrillTimelineEvent[];
    lastSnapshot?: PersistedDrillSnapshot;
    score?: PersistedDrillScore;
}

export interface PersistedDrillRunsState {
    runs: PersistedDrillRun[];
    latestRunByDrill: Record<string, string>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPersistedStatus(value: unknown): value is PersistedDrillStatus {
    return value === "pending"
        || value === "arming"
        || value === "active"
        || value === "stabilizing"
        || value === "won"
        || value === "failed"
        || value === "cancelled";
}

function isTimelineEvent(value: unknown): value is PersistedDrillTimelineEvent {
    if (!isRecord(value)) return false;
    if (typeof value.at !== "string") return false;
    if (typeof value.type !== "string") return false;
    if (typeof value.message !== "string") return false;
    if (typeof value.data !== "undefined" && !isRecord(value.data)) return false;
    return true;
}

function isSnapshot(value: unknown): value is PersistedDrillSnapshot {
    if (!isRecord(value)) return false;
    return typeof value.cpuPercent === "number"
        && typeof value.errorRate === "number"
        && typeof value.blockedSqliRatio === "number"
        && typeof value.detectedMarked === "boolean"
        && typeof value.clusterAttackActive === "boolean"
        && typeof value.ghostTrafficActive === "boolean";
}

function isScoreEntry(value: unknown): value is { code: string; points: number; reason: string } {
    if (!isRecord(value)) return false;
    return typeof value.code === "string"
        && typeof value.points === "number"
        && typeof value.reason === "string";
}

function isScore(value: unknown): value is PersistedDrillScore {
    if (!isRecord(value)) return false;
    if (typeof value.total !== "number") return false;
    if (typeof value.ttdSec !== "number") return false;
    if (typeof value.ttmSec !== "number") return false;
    if (typeof value.ttrSec !== "number") return false;
    if (!Array.isArray(value.penalties) || !value.penalties.every(isScoreEntry)) return false;
    if (!Array.isArray(value.bonuses) || !value.bonuses.every(isScoreEntry)) return false;
    return true;
}

function isPersistedRun(value: unknown): value is PersistedDrillRun {
    if (!isRecord(value)) return false;
    if (typeof value.runId !== "string") return false;
    if (typeof value.drillId !== "string") return false;
    if (typeof value.drillName !== "string") return false;
    if (!isPersistedStatus(value.status)) return false;
    if (typeof value.startedAt !== "string") return false;
    if (typeof value.finishedAt !== "undefined" && typeof value.finishedAt !== "string") return false;
    if (typeof value.detectedAt !== "undefined" && typeof value.detectedAt !== "string") return false;
    if (typeof value.mitigatedAt !== "undefined" && typeof value.mitigatedAt !== "string") return false;
    if (typeof value.failureReason !== "undefined" && typeof value.failureReason !== "string") return false;
    if (!Array.isArray(value.timeline) || !value.timeline.every(isTimelineEvent)) return false;
    if (typeof value.lastSnapshot !== "undefined" && !isSnapshot(value.lastSnapshot)) return false;
    if (typeof value.score !== "undefined" && !isScore(value.score)) return false;
    return true;
}

function parsePersistedState(payload: unknown): PersistedDrillRunsState {
    if (!isRecord(payload)) {
        return { runs: [], latestRunByDrill: {} };
    }

    const runs = Array.isArray(payload.runs) ? payload.runs.filter(isPersistedRun) : [];
    const latestRunByDrill: Record<string, string> = {};
    if (isRecord(payload.latestRunByDrill)) {
        for (const [drillId, runId] of Object.entries(payload.latestRunByDrill)) {
            if (typeof runId === "string") {
                latestRunByDrill[drillId] = runId;
            }
        }
    }

    return { runs, latestRunByDrill };
}

export async function loadDrillRunsState(statePath: string): Promise<PersistedDrillRunsState> {
    if (!statePath) {
        return { runs: [], latestRunByDrill: {} };
    }

    try {
        const raw = await readFile(statePath, "utf8");
        return parsePersistedState(JSON.parse(raw) as unknown);
    } catch (error: any) {
        if (error?.code === "ENOENT") {
            return { runs: [], latestRunByDrill: {} };
        }

        logger.warn({ statePath, error: error?.message }, "Drill runs state load failed; continuing with in-memory store");
        return { runs: [], latestRunByDrill: {} };
    }
}

export async function writeDrillRunsState(
    statePath: string,
    state: PersistedDrillRunsState
): Promise<boolean> {
    if (!statePath) {
        return true;
    }

    try {
        await mkdir(path.dirname(statePath), { recursive: true });
        const payload = JSON.stringify(state, null, 2);
        await writeFile(statePath, `${payload}\n`, "utf8");
        return true;
    } catch (error: any) {
        logger.warn({ statePath, error: error?.message }, "Drill runs state persist failed; keeping data in memory");
        return false;
    }
}
