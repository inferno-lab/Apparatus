import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { logger } from "../logger.js";

export interface PersistedWebhook {
    id: string;
    timestamp: string;
    method: string;
    headers: Record<string, unknown>;
    body: unknown;
    query: Record<string, unknown>;
    ip: string;
}

type PersistedWebhookStore = Record<string, PersistedWebhook[]>;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPersistedWebhook(value: unknown): value is PersistedWebhook {
    if (!isRecord(value)) return false;
    if (typeof value.id !== "string") return false;
    if (typeof value.timestamp !== "string") return false;
    if (typeof value.method !== "string") return false;
    if (!isRecord(value.headers)) return false;
    if (!isRecord(value.query)) return false;
    if (typeof value.ip !== "string") return false;
    return true;
}

function parseWebhookStore(payload: unknown): PersistedWebhookStore {
    const hooksObject = isRecord(payload) && isRecord(payload.hooks)
        ? payload.hooks
        : isRecord(payload)
            ? payload
            : {};

    const parsed: PersistedWebhookStore = {};
    for (const [hookId, entries] of Object.entries(hooksObject)) {
        if (!Array.isArray(entries)) continue;
        parsed[hookId] = entries.filter(isPersistedWebhook);
    }
    return parsed;
}

export async function loadWebhookStore(storePath: string): Promise<PersistedWebhookStore> {
    if (!storePath) {
        return {};
    }

    try {
        const raw = await readFile(storePath, "utf8");
        return parseWebhookStore(JSON.parse(raw) as unknown);
    } catch (error: any) {
        if (error?.code === "ENOENT") {
            return {};
        }

        logger.warn({ storePath, error: error?.message }, "Webhook store load failed; continuing with in-memory store");
        return {};
    }
}

export async function writeWebhookStore(storePath: string, store: PersistedWebhookStore): Promise<boolean> {
    if (!storePath) {
        return true;
    }

    try {
        await mkdir(path.dirname(storePath), { recursive: true });
        const payload = JSON.stringify({ hooks: store }, null, 2);
        await writeFile(storePath, `${payload}\n`, "utf8");
        return true;
    } catch (error: any) {
        logger.warn({ storePath, error: error?.message }, "Webhook store persist failed; keeping data in memory");
        return false;
    }
}
