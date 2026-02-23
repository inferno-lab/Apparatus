// Port validation helper - ensures valid port range
function parsePort(value: string | undefined, defaultPort: number): number {
    const port = parseInt(value ?? String(defaultPort), 10);
    if (isNaN(port) || port < 0 || port > 65535) {
        return defaultPort;
    }
    return port;
}

function resolvePersistencePath(value: string | undefined, defaultPath: string): string {
    if (typeof value === "string") {
        return value;
    }
    return process.env.NODE_ENV === "test" ? "" : defaultPath;
}

export const cfg = {
    host: process.env.HOST || "127.0.0.1",
    portHttp1: parsePort(process.env.PORT_HTTP1, 8090),
    portHttp2: parsePort(process.env.PORT_HTTP2, 8443),
    portTcp: parsePort(process.env.PORT_TCP, 9000),
    portUdp: parsePort(process.env.PORT_UDP, 9001),
    portGrpc: parsePort(process.env.PORT_GRPC, 50051),
    portRedis: parsePort(process.env.PORT_REDIS, 6379),
    portSmtp: parsePort(process.env.PORT_SMTP, 2525),
    portIcap: parsePort(process.env.PORT_ICAP, 1344),
    portSyslog: parsePort(process.env.PORT_SYSLOG, 5514),
    portSyslogAlt: parsePort(process.env.PORT_SYSLOG_ALT, 5140),
    portMqtt: parsePort(process.env.PORT_MQTT, 1883),
    portBadSsl: parsePort(process.env.PORT_BAD_SSL, 8444),
    enableCors: process.env.CORS !== "false",
    bodyLimit: process.env.BODY_LIMIT || "20mb",
    tlsKeyPath: process.env.TLS_KEY || "certs/server.key",
    tlsCertPath: process.env.TLS_CRT || "certs/server.crt",
    enableH2C: process.env.H2C === "true",
    enableCompression: process.env.COMPRESSION !== "false",
    demoMode: process.env.DEMO_MODE === "true" || process.env.APPARATUS_DEMO === "true",
    tunnelUrl: process.env.TUNNEL_URL || "",
    tunnelApiKey: process.env.TUNNEL_API_KEY || "",
    // Integration with Chimera scripts
    k6ScenariosPath: process.env.K6_SCENARIOS_PATH || "",
    nucleiTemplatesPath: process.env.NUCLEI_TEMPLATES_PATH || "",
    scenarioCatalogPath: resolvePersistencePath(process.env.SCENARIO_CATALOG_PATH, "data/scenarios.json"),
    webhookStorePath: resolvePersistencePath(process.env.WEBHOOK_STORE_PATH, "data/webhooks.json"),
    deceptionHistoryPath: resolvePersistencePath(process.env.DECEPTION_HISTORY_PATH, "data/deception-history.json"),
    drillRunsPath: resolvePersistencePath(process.env.DRILL_RUNS_PATH, "data/drill-runs.json"),
    requestHistoryPath: resolvePersistencePath(process.env.REQUEST_HISTORY_PATH, "data/request-history.json"),
    tarpitStatePath: resolvePersistencePath(process.env.TARPIT_STATE_PATH, "data/tarpit-state.json"),
    clusterStatePath: resolvePersistencePath(process.env.CLUSTER_STATE_PATH, "data/cluster-state.json"),
};

export const MTD_SKIP_ROUTE_PREFIXES = [
    "/mtd",
    "/health",
    "/healthz",
    "/sse",
    "/dashboard",
    "/assets",
    "/_sensor",
    "/metrics",
    "/docs",
    "/api/docs-index",
] as const;
