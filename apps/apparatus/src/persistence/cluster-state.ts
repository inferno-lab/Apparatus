import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { logger } from "../logger.js";

interface PersistedClusterMember {
    ip: string;
    lastSeen: number;
}

function isPersistedMember(value: unknown): value is PersistedClusterMember {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const candidate = value as PersistedClusterMember;
    return typeof candidate.ip === "string" && Number.isFinite(candidate.lastSeen);
}

export function loadClusterStateSync(statePath: string): PersistedClusterMember[] {
    if (!statePath) {
        return [];
    }

    try {
        const raw = readFileSync(statePath, "utf8");
        const parsed = JSON.parse(raw) as unknown;

        if (Array.isArray(parsed)) {
            return parsed.filter(isPersistedMember);
        }

        if (parsed && typeof parsed === "object" && Array.isArray((parsed as { members?: unknown[] }).members)) {
            return (parsed as { members: unknown[] }).members.filter(isPersistedMember);
        }

        return [];
    } catch (error: any) {
        if (error?.code !== "ENOENT") {
            logger.warn({ statePath, error: error?.message }, "Cluster state load failed; continuing with in-memory store");
        }
        return [];
    }
}

export async function writeClusterState(
    statePath: string,
    members: PersistedClusterMember[]
): Promise<boolean> {
    if (!statePath) {
        return true;
    }

    try {
        await mkdir(path.dirname(statePath), { recursive: true });
        await writeFile(statePath, `${JSON.stringify({ members }, null, 2)}\n`, "utf8");
        return true;
    } catch (error: any) {
        logger.warn({ statePath, error: error?.message }, "Cluster state persist failed; keeping data in memory");
        return false;
    }
}
