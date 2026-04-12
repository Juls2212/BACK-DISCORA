interface RuntimeStatus {
  apiStatus: "starting" | "ready";
  databaseStatus: "disconnected" | "connected";
  schemaStatus: "pending" | "initialized";
  seedStatus: "pending" | "skipped" | "completed";
  startedAt: string;
}

const runtimeStatus: RuntimeStatus = {
  apiStatus: "starting",
  databaseStatus: "disconnected",
  schemaStatus: "pending",
  seedStatus: "pending",
  startedAt: new Date().toISOString()
};

export { runtimeStatus };
