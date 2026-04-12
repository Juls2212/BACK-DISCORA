import { Router } from "express";
import { sendSuccess } from "../modules/http/api-response";
import { runtimeStatus } from "../modules/system/runtime-status";

const healthRouter = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Check API health
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: ok
 *                     database:
 *                       type: string
 *                       example: connected
 *                     timestamp:
 *                       type: string
 *                       example: 2026-04-11T10:00:00.000Z
 */
healthRouter.get("/health", (_request, response) => {
  sendSuccess(response, {
    status: runtimeStatus.apiStatus === "ready" ? "ok" : "starting",
    database: runtimeStatus.databaseStatus,
    timestamp: new Date().toISOString()
  });
});

export { healthRouter };
