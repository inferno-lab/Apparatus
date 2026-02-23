import { Request, Response } from "express";
import { logger } from "./logger.js";
import { cfg } from "./config.js";
import { executeToolStep, sanitizeToolParams, TOOL_ACTIONS, ToolAction } from "./tool-executor.js";
import { loadScenarioCatalog, PersistedScenario, writeScenarioCatalog } from "./persistence/scenario-catalog.js";
import { markPersistenceHydrated, markPersistenceWrite, registerPersistenceStore } from "./persistence/status.js";

export interface ScenarioStep {
    id: string;
    action: ToolAction;
    params: Record<string, unknown>;
    delayMs?: number; // Post-action delay
}

export interface Scenario {
    id: string;
    name: string;
    description?: string;
    steps: ScenarioStep[];
    createdAt: string;
}

interface ScenarioRunStatus {
    executionId: string;
    scenarioId: string;
    scenarioName: string;
    status: "running" | "completed" | "failed";
    startedAt: string;
    finishedAt?: string;
    currentStepId?: string;
    error?: string;
}

const SCENARIO_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
type ScenarioAllowedAction = Exclude<ToolAction, "chaos.crash">;
const VALID_SCENARIO_ACTIONS: ScenarioAllowedAction[] = TOOL_ACTIONS.filter(
    (action): action is ScenarioAllowedAction => action !== "chaos.crash"
);
const MAX_SCENARIOS = 200;
const MAX_SCENARIO_RUNS = 1000;

const scenarioStore = new Map<string, Scenario>();
const scenarioRuns = new Map<string, ScenarioRunStatus>();
const latestRunByScenario = new Map<string, string>();
let scenarioCatalogHydrationPromise: Promise<void> | null = null;
let scenarioCatalogPersistQueue: Promise<boolean> = Promise.resolve(true);
const SCENARIO_STORE_KEY = "scenarioCatalog";

registerPersistenceStore(SCENARIO_STORE_KEY, cfg.scenarioCatalogPath);

function isAllowedScenarioAction(action: string): action is ScenarioAllowedAction {
    return VALID_SCENARIO_ACTIONS.includes(action as ScenarioAllowedAction);
}

function normalizePersistedScenario(scenario: PersistedScenario): Scenario | null {
    if (!SCENARIO_ID_PATTERN.test(scenario.id)) return null;
    if (!Array.isArray(scenario.steps) || scenario.steps.length > 50) return null;

    const sanitizedSteps: ScenarioStep[] = [];
    for (const step of scenario.steps) {
        if (!isAllowedScenarioAction(step.action)) return null;
        if (!step.params || typeof step.params !== "object" || Array.isArray(step.params)) return null;
        if (typeof step.delayMs !== "undefined" && typeof step.delayMs !== "number") return null;
        try {
            const action = step.action;
            const sanitizedParams = sanitizeToolParams(action, step.params as Record<string, unknown>);
            sanitizedSteps.push({
                id: step.id,
                action,
                delayMs: step.delayMs,
                params: sanitizedParams,
            });
        } catch {
            return null;
        }
    }

    return {
        ...scenario,
        steps: sanitizedSteps,
    };
}

async function hydrateScenarioCatalog(): Promise<void> {
    const persistedCatalog = await loadScenarioCatalog(cfg.scenarioCatalogPath);
    if (persistedCatalog.size === 0) {
        markPersistenceHydrated(SCENARIO_STORE_KEY);
        return;
    }

    let restoredCount = 0;
    for (const scenario of persistedCatalog.values()) {
        const normalized = normalizePersistedScenario(scenario);
        if (!normalized) continue;
        scenarioStore.set(normalized.id, normalized);
        restoredCount += 1;
    }

    logger.info(
        { catalogPath: cfg.scenarioCatalogPath, restoredCount },
        "Scenario catalog hydrated from persistence layer"
    );
    markPersistenceHydrated(SCENARIO_STORE_KEY);
}

async function ensureScenarioCatalogHydrated(): Promise<void> {
    if (!scenarioCatalogHydrationPromise) {
        scenarioCatalogHydrationPromise = hydrateScenarioCatalog();
    }
    await scenarioCatalogHydrationPromise;
}

async function persistScenarioCatalogQueued(): Promise<boolean> {
    scenarioCatalogPersistQueue = scenarioCatalogPersistQueue.then(
        () => writeScenarioCatalog(cfg.scenarioCatalogPath, scenarioStore.values()),
        () => writeScenarioCatalog(cfg.scenarioCatalogPath, scenarioStore.values())
    );
    const persisted = await scenarioCatalogPersistQueue;
    markPersistenceWrite(SCENARIO_STORE_KEY, persisted);
    return persisted;
}

// Helper to execute a single step (detached from request lifecycle)
async function executeStep(step: ScenarioStep) {
    logger.info({ step: step.id, action: step.action }, "Scenario: Executing Step");
    // Post-action step delay is applied centrally inside executeToolStep.
    const result = await executeToolStep(step);
    if (!result.ok) {
        throw new Error(result.error || result.message);
    }
}

export async function scenarioListHandler(req: Request, res: Response) {
    await ensureScenarioCatalogHydrated();
    res.json(Array.from(scenarioStore.values()));
}

export async function scenarioSaveHandler(req: Request, res: Response) {
    await ensureScenarioCatalogHydrated();
    const scenario = req.body as Scenario;
    
    // VALIDATION
    if (!scenario.name || typeof scenario.name !== 'string') return res.status(400).json({ error: "Missing name" });
    if (!Array.isArray(scenario.steps)) return res.status(400).json({ error: "Invalid steps array" });
    if (scenario.steps.length > 50) return res.status(400).json({ error: "Too many steps" });

    // Validate each step
    const sanitizedSteps: ScenarioStep[] = [];
    for (const step of scenario.steps) {
        if (!isAllowedScenarioAction(step.action)) return res.status(400).json({ error: `Invalid action: ${step.action}` });
        if (typeof step.delayMs !== "undefined" && typeof step.delayMs !== "number") {
            return res.status(400).json({ error: "Invalid delayMs" });
        }
        if (!step.params || typeof step.params !== "object" || Array.isArray(step.params)) {
            return res.status(400).json({ error: `Invalid params for action: ${step.action}` });
        }
        try {
            const sanitizedParams = sanitizeToolParams(step.action, step.params as Record<string, unknown>);
            sanitizedSteps.push({
                ...step,
                params: sanitizedParams,
            });
        } catch (error: any) {
            return res.status(400).json({ error: error?.message || `Invalid params for action: ${step.action}` });
        }
    }
    
    const id = (scenario.id && typeof scenario.id === 'string') ? scenario.id : `sc-${Date.now()}`;
    if (!SCENARIO_ID_PATTERN.test(id)) {
        return res.status(400).json({ error: "Scenario id must match [a-zA-Z0-9_-]+" });
    }

    const existing = scenarioStore.get(id);
    if (!existing && scenarioStore.size >= MAX_SCENARIOS) {
        return res.status(429).json({ error: "Scenario store limit reached" });
    }
    
    const saved: Scenario = {
        ...scenario,
        id,
        steps: sanitizedSteps,
        createdAt: existing?.createdAt || new Date().toISOString()
    };
    scenarioStore.set(id, saved);

    const persisted = await persistScenarioCatalogQueued();
    if (!persisted) {
        logger.warn({ scenarioId: id }, "Scenario saved to memory but persistence write failed");
    }

    res.json(saved);
}

export async function scenarioRunHandler(req: Request, res: Response) {
    await ensureScenarioCatalogHydrated();
    const id = req.params.id;
    const scenario = scenarioStore.get(id);
    
    if (!scenario) return res.status(404).json({ error: "Scenario not found" });

    const executionId = `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const initialRun: ScenarioRunStatus = {
        executionId,
        scenarioId: scenario.id,
        scenarioName: scenario.name,
        status: "running",
        startedAt: new Date().toISOString(),
    };
    scenarioRuns.set(executionId, initialRun);
    if (scenarioRuns.size > MAX_SCENARIO_RUNS) {
        const firstKey = scenarioRuns.keys().next().value;
        if (firstKey) {
            scenarioRuns.delete(firstKey);
        }
    }
    latestRunByScenario.set(scenario.id, executionId);

    res.status(202).json({
        status: "started",
        executionId,
        message: `Executing scenario: ${scenario.name}`
    });

    // Execute detached from request
    const runScenario = async () => {
        for (const step of scenario.steps) {
            const currentRun = scenarioRuns.get(executionId);
            if (!currentRun) return;
            scenarioRuns.set(executionId, {
                ...currentRun,
                currentStepId: step.id,
            });
            await executeStep(step);
        }
        const finishedRun = scenarioRuns.get(executionId);
        if (!finishedRun) return;
        scenarioRuns.set(executionId, {
            ...finishedRun,
            status: "completed",
            finishedAt: new Date().toISOString(),
        });
        logger.info({ scenario: scenario.name }, "Scenario: Completed Successfully");
    };

    setImmediate(() => {
        void runScenario().catch((error: any) => {
            const failedRun = scenarioRuns.get(executionId);
            if (!failedRun) return;
            scenarioRuns.set(executionId, {
                ...failedRun,
                status: "failed",
                finishedAt: new Date().toISOString(),
                error: error.message,
            });
            logger.error({ scenario: scenario.name, error: error.message }, "Scenario: Failed");
        });
    });
}

export async function scenarioRunStatusHandler(req: Request, res: Response) {
    await ensureScenarioCatalogHydrated();
    const scenarioId = req.params.id;
    const scenario = scenarioStore.get(scenarioId);
    if (!scenario) return res.status(404).json({ error: "Scenario not found" });

    const executionId = typeof req.query.executionId === "string"
        ? req.query.executionId
        : latestRunByScenario.get(scenarioId);
    if (!executionId) {
        return res.status(404).json({ error: "No execution found for scenario" });
    }

    const run = scenarioRuns.get(executionId);
    if (!run) {
        return res.status(404).json({ error: "Execution not found" });
    }

    res.json(run);
}
