import { Router } from "express";
import { sendSuccess } from "../modules/http/api-response";

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
 *                 status:
 *                   type: string
 *                   example: ok
 */
healthRouter.get("/health", (_request, response) => {
  sendSuccess(response, { status: "ok" });
});

export { healthRouter };
