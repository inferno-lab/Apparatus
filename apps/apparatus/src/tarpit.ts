import { Request, Response, NextFunction } from "express";
import { logger } from "./logger.js";
import { broadcastTarpit } from "./sse-broadcast.js";
import { isValidIpLiteral, normalizeIp } from "./utils/ip.js";
import { cfg } from "./config.js";
import { loadTarpitStateSync, writeTarpitState } from "./persistence/tarpit-state.js";
import { markPersistenceHydrated, markPersistenceWrite, registerPersistenceStore } from "./persistence/status.js";

const TRAP_PATHS = ["/wp-admin", "/.env", "/.git", "/admin.php"];
export const blockedIps = new Set<string>();
const TARPIT_STORE_KEY = "tarpitState";

// Track when IPs were trapped for time-in-tarpit calculation
const trapTimes: Map<string, number> = new Map();
let tarpitPersistQueue: Promise<boolean> = Promise.resolve(true);

registerPersistenceStore(TARPIT_STORE_KEY, cfg.tarpitStatePath);

for (const entry of loadTarpitStateSync(cfg.tarpitStatePath)) {
    blockedIps.add(entry.ip);
    trapTimes.set(entry.ip, entry.trappedAt);
}
markPersistenceHydrated(TARPIT_STORE_KEY);

function snapshotTarpitState() {
    return Array.from(blockedIps).map((ip) => ({
        ip,
        trappedAt: trapTimes.get(ip) || Date.now(),
    }));
}

function persistTarpitStateQueued() {
    tarpitPersistQueue = tarpitPersistQueue.then(
        () => writeTarpitState(cfg.tarpitStatePath, snapshotTarpitState()),
        () => writeTarpitState(cfg.tarpitStatePath, snapshotTarpitState())
    );

    void tarpitPersistQueue.then((persisted) => {
        markPersistenceWrite(TARPIT_STORE_KEY, persisted);
        if (!persisted) {
            logger.warn("Tarpit state persisted in memory only due to write failure");
        }
    });
}

export function tarpitListHandler(_req: Request, res: Response) {
    const now = Date.now();
    const trapped = Array.from(blockedIps).map(ip => ({
        ip,
        trappedAt: trapTimes.get(ip) || now,
        duration: Math.floor((now - (trapTimes.get(ip) || now)) / 1000)
    }));
    res.json({
        count: trapped.length,
        trapPaths: TRAP_PATHS,
        trapped
    });
}

export function tarpitReleaseHandler(req: Request, res: Response) {
    const ip = normalizeIp(req.body?.ip);
    if (ip && ip !== "unknown" && blockedIps.has(ip)) {
        blockedIps.delete(ip);
        trapTimes.delete(ip);
        persistTarpitStateQueued();
        logger.info({ ip }, "Tarpit: IP released");
        broadcastTarpit('released', ip);
        res.json({ status: "released", ip });
    } else if (ip && ip !== "unknown") {
        res.status(404).json({ error: "IP not in tarpit" });
    } else {
        // Clear all - broadcast for each
        const ips = Array.from(blockedIps);
        const count = blockedIps.size;
        blockedIps.clear();
        trapTimes.clear();
        persistTarpitStateQueued();
        ips.forEach(ip => broadcastTarpit('released', ip));
        logger.info({ count }, "Tarpit: All IPs released");
        res.json({ status: "cleared", count });
    }
}

export function tarpitTrapHandler(req: Request, res: Response) {
    const ip = normalizeIp(req.body?.ip);
    if (!ip || ip === "unknown" || !isValidIpLiteral(ip)) {
        return res.status(400).json({ error: "Invalid ip" });
    }

    if (!blockedIps.has(ip)) {
        blockedIps.add(ip);
        trapTimes.set(ip, Date.now());
        persistTarpitStateQueued();
        logger.warn({ ip }, "Tarpit: IP trapped via control API");
        broadcastTarpit("trapped", ip);
    }

    return res.json({ status: "trapped", ip, count: blockedIps.size });
}

export function tarpitMiddleware(req: Request, res: Response, next: NextFunction) {
    const ip = normalizeIp(req.ip || req.socket.remoteAddress);

    // If IP is already flagged, Tarpit them
    if (blockedIps.has(ip)) {
        return enterTarpit(res);
    }

    // Check if they hit a Trap Route
    if (TRAP_PATHS.some(path => req.path.startsWith(path))) {
        if (!ip || ip === "unknown") {
            logger.warn({ path: req.path }, "Honeypot Triggered with unknown IP; entering one-shot tarpit.");
            return enterTarpit(res);
        }

        logger.warn({ ip, path: req.path }, "Honeypot Triggered! Activating Tarpit.");
        blockedIps.add(ip);
        trapTimes.set(ip, Date.now());
        persistTarpitStateQueued();
        broadcastTarpit('trapped', ip);
        return enterTarpit(res);
    }

    next();
}

function enterTarpit(res: Response) {
    // Send 200 OK headers to keep them happy
    res.writeHead(200, {
        "Content-Type": "text/html",
        "Transfer-Encoding": "chunked"
    });

    // Send 1 byte every 10 seconds
    const interval = setInterval(() => {
        if (!res.writableEnded) {
            res.write(" "); 
        } else {
            clearInterval(interval);
        }
    }, 10000);

    // Stop on disconnect or finish
    res.on("close", () => clearInterval(interval));
    res.on("finish", () => clearInterval(interval));
}
