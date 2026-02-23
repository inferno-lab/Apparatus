import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { logger } from "../logger.js";

export function loadRequestHistorySync(historyPath: string): unknown[] {
    if (!historyPath) {
        return [];
    }

    try {
        const raw = readFileSync(historyPath, "utf8");
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
            return parsed;
        }
        if (parsed && typeof parsed === "object" && Array.isArray((parsed as { entries?: unknown[] }).entries)) {
            return (parsed as { entries: unknown[] }).entries;
        }
        return [];
    } catch (error: any) {
        if (error?.code !== "ENOENT") {
            logger.warn({ historyPath, error: error?.message }, "Request history load failed; continuing with in-memory store");
        }
        return [];
    }
}

export async function writeRequestHistory(historyPath: string, entries: unknown[]): Promise<boolean> {
    if (!historyPath) {
        return true;
    }

    try {
        await mkdir(path.dirname(historyPath), { recursive: true });
        await writeFile(historyPath, `${JSON.stringify({ entries }, null, 2)}\n`, "utf8");
        return true;
    } catch (error: any) {
        logger.warn({ historyPath, error: error?.message }, "Request history persist failed; keeping data in memory");
        return false;
    }
}
