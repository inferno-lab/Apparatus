interface PersistenceStoreStatus {
    key: string;
    path: string;
    enabled: boolean;
    hydrated: boolean;
    lastLoadAt?: string;
    lastWriteAt?: string;
    lastWriteOk?: boolean;
}

const persistenceStores = new Map<string, PersistenceStoreStatus>();

function getOrCreateStore(key: string): PersistenceStoreStatus {
    const existing = persistenceStores.get(key);
    if (existing) {
        return existing;
    }

    const created: PersistenceStoreStatus = {
        key,
        path: "",
        enabled: false,
        hydrated: false,
    };
    persistenceStores.set(key, created);
    return created;
}

export function registerPersistenceStore(key: string, path: string) {
    const store = getOrCreateStore(key);
    store.path = path;
    store.enabled = Boolean(path);
}

export function markPersistenceHydrated(key: string) {
    const store = getOrCreateStore(key);
    store.hydrated = true;
    store.lastLoadAt = new Date().toISOString();
}

export function markPersistenceWrite(key: string, ok: boolean) {
    const store = getOrCreateStore(key);
    store.lastWriteOk = ok;
    store.lastWriteAt = new Date().toISOString();
}

export function getPersistenceHealth() {
    const stores = Array.from(persistenceStores.values())
        .map((store) => ({ ...store }))
        .sort((a, b) => a.key.localeCompare(b.key));

    const enabled = stores.filter((store) => store.enabled).length;
    const disabled = stores.length - enabled;
    const degraded = stores.filter((store) => store.enabled && store.lastWriteOk === false).length;
    const healthy = enabled - degraded;

    return {
        generatedAt: new Date().toISOString(),
        summary: {
            total: stores.length,
            enabled,
            disabled,
            healthy,
            degraded,
        },
        stores,
    };
}
