import { env } from "./config/env";
import { checkDatabaseConnection } from "./modules/database/postgres";
import { app } from "./app";

const startServer = async (): Promise<void> => {
  try {
    await checkDatabaseConnection();
    console.log("Database connection successful");

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
};

void startServer();
