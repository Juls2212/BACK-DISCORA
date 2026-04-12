import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { healthRouter } from "./routes/health.route";
import { playlistRouter } from "./routes/playlist.route";
import { playgroundRouter } from "./routes/playground.route";
import { songRouter } from "./routes/song.route";

const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(healthRouter);
app.use(playlistRouter);
app.use(playgroundRouter);
app.use(songRouter);

export { app };
