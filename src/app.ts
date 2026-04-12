import express from "express";
import { healthRouter } from "./routes/health.route";
import { playgroundRouter } from "./routes/playground.route";

const app = express();

app.use(express.json());
app.use(healthRouter);
app.use(playgroundRouter);

export { app };
