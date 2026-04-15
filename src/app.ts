import cors from "cors";
import express from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./modules/http/error-middleware";
import { healthRouter } from "./routes/health.route";
import { playlistRouter } from "./routes/playlist.route";
import { playgroundRouter } from "./routes/playground.route";
import { songRouter } from "./routes/song.route";

const app = express();

app.use(cors({
  origin: env.corsOrigin,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(healthRouter);
app.use(playlistRouter);
app.use(playgroundRouter);
app.use(songRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export { app };
