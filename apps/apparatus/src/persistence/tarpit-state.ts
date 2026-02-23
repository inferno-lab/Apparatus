import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { logger } from "../logger.js";

interface PersistedTarpitEntry {
    ip: string;
    trappedAt: number;
}

function isPersistedEntry(value: unknown): value is PersistedTarpitEntry {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const candidate = value as PersistedTarpitEntry;
    return typeof candidate.ip === "string" && Number.isFinite(candidate.trappedAt);
}

export function loadTarpitStateSync(statePath: string): PersistedTarpitEntry[] {
    if (!statePath) {
        return [];
    }

    try {
        const raw = readFileSync(statePath, "utf8");
        const parsed = JSON.parse(raw) as unknown;

        if (Array.isArray(parsed)) {
            return parsed.filter(isPersistedEntry);
        }

        if (parsed && typeof parsed === "object" && Array.isArray((parsed as { entries?: unknown[] }).entries)) {
            return (parsed as { entries: unknown[] }).entries.filter(isPersistedEntry);
        }

        return [];
    } catch (error: any) {
        if (error?.code !== "ENOENT") {
            logger.warn({ statePath, error: error?.message }, "Tarpit state load failed; continuing with in-memory store");
        }
        return [];
    }
}

export async function writeTarpitState(statePath: string, entries: PersistedTarpitEntry[]): Promise<boolean> {
    if (!statePath) {
        return true;
    }

    try {
        await mkdir(path.dirname(statePath), { recursive: true });
        await writeFile(statePath, `${JSON.stringify({ entries }, null, 2)}\n`, "utf8");
        return true;
    } catch (error: any) {
        logger.warn({ statePath, error: error?.message }, "Tarpit state persist failed; keeping data in memory");
        return false;
    }
}
