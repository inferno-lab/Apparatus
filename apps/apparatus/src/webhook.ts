import { Request, Response } from "express";
import { broadcastWebhook } from "./sse-broadcast.js";
import { cfg } from "./config.js";
import { logger } from "./logger.js";
import { loadWebhookStore, PersistedWebhook, writeWebhookStore } from "./persistence/webhook-store.js";
import { markPersistenceHydrated, markPersistenceWrite, registerPersistenceStore } from "./persistence/status.js";

interface Webhook {
    id: string;
    timestamp: string;
    method: string;
    headers: any;
    body: any;
    query: any;
    ip: string;
}

const webhookStore: Record<string, Webhook[]> = {};
let webhookStoreHydrationPromise: Promise<void> | null = null;
let webhookStorePersistQueue: Promise<boolean> = Promise.resolve(true);
const WEBHOOK_STORE_KEY = "webhookStore";

// Max 50 webhooks per ID to prevent memory leaks
const MAX_WEBHOOKS = 50;

registerPersistenceStore(WEBHOOK_STORE_KEY, cfg.webhookStorePath);

function normalizePersistedWebhook(entry: PersistedWebhook, hookId: string): Webhook | null {
    if (entry.id !== hookId) return null;
    return {
        id: entry.id,
        timestamp: entry.timestamp,
        method: entry.method,
        headers: entry.headers,
        body: entry.body,
        query: entry.query,
        ip: entry.ip,
    };
}

async function hydrateWebhookStore(): Promise<void> {
    const persistedStore = await loadWebhookStore(cfg.webhookStorePath);
    for (const [hookId, entries] of Object.entries(persistedStore)) {
        webhookStore[hookId] = entries
            .map((entry) => normalizePersistedWebhook(entry, hookId))
            .filter((entry): entry is Webhook => entry !== null)
            .slice(0, MAX_WEBHOOKS);
    }
    markPersistenceHydrated(WEBHOOK_STORE_KEY);
}

async function ensureWebhookStoreHydrated(): Promise<void> {
    if (!webhookStoreHydrationPromise) {
        webhookStoreHydrationPromise = hydrateWebhookStore();
    }
    await webhookStoreHydrationPromise;
}

function snapshotWebhookStore(): Record<string, Webhook[]> {
    const snapshot: Record<string, Webhook[]> = {};
    for (const [hookId, entries] of Object.entries(webhookStore)) {
        snapshot[hookId] = entries.slice(0, MAX_WEBHOOKS);
    }
    return snapshot;
}

async function persistWebhookStoreQueued(): Promise<boolean> {
    webhookStorePersistQueue = webhookStorePersistQueue.then(
        () => writeWebhookStore(cfg.webhookStorePath, snapshotWebhookStore()),
        () => writeWebhookStore(cfg.webhookStorePath, snapshotWebhookStore())
    );
    const persisted = await webhookStorePersistQueue;
    markPersistenceWrite(WEBHOOK_STORE_KEY, persisted);
    return persisted;
}

export async function webhookReceiveHandler(req: Request, res: Response) {
    await ensureWebhookStoreHydrated();
    const hookId = req.params.id;
    
    if (!webhookStore[hookId]) {
        webhookStore[hookId] = [];
    }

    const webhook: Webhook = {
        id: hookId,
        timestamp: new Date().toISOString(),
        method: req.method,
        headers: req.headers,
        body: req.body,
        query: req.query,
        ip: req.ip || req.socket.remoteAddress || "unknown"
    };

    webhookStore[hookId].unshift(webhook);
    
    // Trim
    if (webhookStore[hookId].length > MAX_WEBHOOKS) {
        webhookStore[hookId] = webhookStore[hookId].slice(0, MAX_WEBHOOKS);
    }

    const persisted = await persistWebhookStoreQueued();
    if (!persisted) {
        logger.warn({ hookId }, "Webhook stored in memory but persistence write failed");
    }

    broadcastWebhook(hookId, webhook);

    res.status(200).json({ status: "received", id: hookId });
}

export async function webhookListHandler(req: Request, res: Response) {
    await ensureWebhookStoreHydrated();
    const hookId = req.params.id;
    const hooks = webhookStore[hookId] || [];
    res.json(hooks);
}
