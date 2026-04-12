import { Pool } from "pg";
import { env } from "../../config/env";

const pool = new Pool({
  host: env.dbHost,
  port: env.dbPort,
  database: env.dbName,
  user: env.dbUser,
  password: env.dbPassword,
  ssl: env.dbSsl ? { rejectUnauthorized: false } : false
});

const checkDatabaseConnection = async (): Promise<void> => {
  await pool.query("SELECT 1");
};

export { checkDatabaseConnection, pool };
