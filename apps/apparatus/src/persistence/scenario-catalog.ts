import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { logger } from "../logger.js";

export interface PersistedScenarioStep {
    id: string;
    action: string;
    params: Record<string, unknown>;
    delayMs?: number;
}

export interface PersistedScenario {
    id: string;
    name: string;
    description?: string;
    steps: PersistedScenarioStep[];
    createdAt: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPersistedScenarioStep(value: unknown): value is PersistedScenarioStep {
    if (!isRecord(value)) return false;
    if (typeof value.id !== "string" || typeof value.action !== "string") return false;
    if (!isRecord(value.params)) return false;
    if (typeof value.delayMs !== "undefined" && typeof value.delayMs !== "number") return false;
    return true;
}

function isPersistedScenario(value: unknown): value is PersistedScenario {
    if (!isRecord(value)) return false;
    if (typeof value.id !== "string" || typeof value.name !== "string") return false;
    if (typeof value.createdAt !== "string") return false;
    if (typeof value.description !== "undefined" && typeof value.description !== "string") return false;
    if (!Array.isArray(value.steps) || !value.steps.every(isPersistedScenarioStep)) return false;
    return true;
}

function parseScenarioList(payload: unknown): PersistedScenario[] {
    if (Array.isArray(payload)) {
        return payload.filter(isPersistedScenario);
    }

    if (isRecord(payload) && Array.isArray(payload.scenarios)) {
        return payload.scenarios.filter(isPersistedScenario);
    }

    return [];
}

export async function loadScenarioCatalog(catalogPath: string): Promise<Map<string, PersistedScenario>> {
    if (!catalogPath) {
        return new Map();
    }

    try {
        const raw = await readFile(catalogPath, "utf8");
        const parsed = JSON.parse(raw) as unknown;
        const scenarios = parseScenarioList(parsed);
        return new Map(scenarios.map((scenario) => [scenario.id, scenario]));
    } catch (error: any) {
        if (error?.code === "ENOENT") {
            return new Map();
        }

        logger.warn({ catalogPath, error: error?.message }, "Scenario catalog load failed; continuing with in-memory store");
        return new Map();
    }
}

export async function writeScenarioCatalog(
    catalogPath: string,
    scenarios: Iterable<PersistedScenario>
): Promise<boolean> {
    if (!catalogPath) {
        return true;
    }

    try {
        await mkdir(path.dirname(catalogPath), { recursive: true });
        const payload = JSON.stringify({ scenarios: Array.from(scenarios) }, null, 2);
        await writeFile(catalogPath, `${payload}\n`, "utf8");
        return true;
    } catch (error: any) {
        logger.warn({ catalogPath, error: error?.message }, "Scenario catalog persist failed; keeping data in memory");
        return false;
    }
}
