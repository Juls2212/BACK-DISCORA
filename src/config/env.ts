import dotenv from "dotenv";

dotenv.config();

const parsePort = (value: string | undefined, fallback: number): number => {
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
};

const env = {
  port: parsePort(process.env.PORT, 3000),
  dbHost: process.env.DB_HOST ?? "localhost",
  dbPort: parsePort(process.env.DB_PORT, 5432),
  dbName: process.env.DB_NAME ?? "",
  dbUser: process.env.DB_USER ?? "",
  dbPassword: process.env.DB_PASSWORD ?? "",
  dbSsl: process.env.DB_SSL === "true"
};

export { env };
