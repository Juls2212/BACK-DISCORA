import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { healthRouter } from "./routes/health.route";
import { playgroundRouter } from "./routes/playground.route";

const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(healthRouter);
app.use(playgroundRouter);

export { app };
