import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { logger } from "../logger.js";

export type PersistedDeceptionEventType = "honeypot_hit" | "shell_command" | "sqli_probe";

export interface PersistedDeceptionEvent {
    timestamp: string;
    ip: string;
    type: PersistedDeceptionEventType;
    route: string;
    details: unknown;
    sessionId?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPersistedDeceptionType(value: unknown): value is PersistedDeceptionEventType {
    return value === "honeypot_hit" || value === "shell_command" || value === "sqli_probe";
}

function isPersistedDeceptionEvent(value: unknown): value is PersistedDeceptionEvent {
    if (!isRecord(value)) return false;
    if (typeof value.timestamp !== "string") return false;
    if (typeof value.ip !== "string") return false;
    if (!isPersistedDeceptionType(value.type)) return false;
    if (typeof value.route !== "string") return false;
    if (typeof value.sessionId !== "undefined" && typeof value.sessionId !== "string") return false;
    return true;
}

function parseDeceptionHistory(payload: unknown): PersistedDeceptionEvent[] {
    if (Array.isArray(payload)) {
        return payload.filter(isPersistedDeceptionEvent);
    }

    if (isRecord(payload) && Array.isArray(payload.events)) {
        return payload.events.filter(isPersistedDeceptionEvent);
    }

    return [];
}

export async function loadDeceptionHistory(historyPath: string): Promise<PersistedDeceptionEvent[]> {
    if (!historyPath) {
        return [];
    }

    try {
        const raw = await readFile(historyPath, "utf8");
        return parseDeceptionHistory(JSON.parse(raw) as unknown);
    } catch (error: any) {
        if (error?.code === "ENOENT") {
            return [];
        }

        logger.warn({ historyPath, error: error?.message }, "Deception history load failed; continuing with in-memory store");
        return [];
    }
}

export async function writeDeceptionHistory(
    historyPath: string,
    events: PersistedDeceptionEvent[]
): Promise<boolean> {
    if (!historyPath) {
        return true;
    }

    try {
        await mkdir(path.dirname(historyPath), { recursive: true });
        const payload = JSON.stringify({ events }, null, 2);
        await writeFile(historyPath, `${payload}\n`, "utf8");
        return true;
    } catch (error: any) {
        logger.warn({ historyPath, error: error?.message }, "Deception history persist failed; keeping data in memory");
        return false;
    }
}
