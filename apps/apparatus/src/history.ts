import { cfg } from "./config.js";
import { logger } from "./logger.js";
import { loadRequestHistorySync, writeRequestHistory } from "./persistence/request-history.js";
import { markPersistenceHydrated, markPersistenceWrite, registerPersistenceStore } from "./persistence/status.js";

const HISTORY_SIZE = 100;
const history: any[] = [];
let historyPersistQueue: Promise<boolean> = Promise.resolve(true);
const HISTORY_STORE_KEY = "requestHistory";

registerPersistenceStore(HISTORY_STORE_KEY, cfg.requestHistoryPath);

for (const entry of loadRequestHistorySync(cfg.requestHistoryPath).slice(0, HISTORY_SIZE)) {
    history.push(entry);
}
markPersistenceHydrated(HISTORY_STORE_KEY);

function snapshotHistory() {
    return history.slice(0, HISTORY_SIZE);
}

function persistHistoryQueued() {
    historyPersistQueue = historyPersistQueue.then(
        () => writeRequestHistory(cfg.requestHistoryPath, snapshotHistory()),
        () => writeRequestHistory(cfg.requestHistoryPath, snapshotHistory())
    );

    void historyPersistQueue.then((persisted) => {
        markPersistenceWrite(HISTORY_STORE_KEY, persisted);
        if (!persisted) {
            logger.warn("Request history persisted in memory only due to write failure");
        }
    });
}

export function addToHistory(record: any) {
    history.unshift(record);
    if (history.length > HISTORY_SIZE) {
        history.pop();
    }
    persistHistoryQueued();
}

export function getHistory() {
    return history;
}

export function clearHistory() {
    history.length = 0;
    persistHistoryQueued();
}
