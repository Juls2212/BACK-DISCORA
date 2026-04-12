import { env } from "./config/env";
import { initializeDatabase } from "./modules/database/database-init";
import { checkDatabaseConnection } from "./modules/database/postgres";
import { hydrateApplicationState } from "./modules/services/persistence-sync.service";
import { runtimeStatus } from "./modules/system/runtime-status";
import { app } from "./app";

const startServer = async (): Promise<void> => {
  try {
    console.log(`[startup] Booting Discora backend on port ${env.port}`);

    await checkDatabaseConnection();
    runtimeStatus.databaseStatus = "connected";
    console.log("[startup] PostgreSQL connection: successful");

    const databaseInitialization = await initializeDatabase();
    runtimeStatus.schemaStatus = "initialized";
    runtimeStatus.seedStatus = databaseInitialization.seedStatus;
    console.log("[startup] Database schema: initialized");
    console.log(
      `[startup] Demo song seed: ${databaseInitialization.seedStatus} (songs before seed: ${databaseInitialization.songsCountBeforeSeed})`
    );

    await hydrateApplicationState();
    runtimeStatus.apiStatus = "ready";
    console.log("[startup] In-memory state: restored from PostgreSQL");

    app.listen(env.port, () => {
      console.log(`[startup] Server listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("[startup] Startup failed", error);
    process.exit(1);
  }
};

void startServer();
