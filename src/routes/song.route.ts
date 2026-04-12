import { Router } from "express";
import { demoSongsCatalog } from "../modules/catalogs/demo-songs.catalog";
import { sendSuccess } from "../modules/http/api-response";

const songRouter = Router();

/**
 * @openapi
 * /songs/demo:
 *   get:
 *     summary: Get the in-memory demo songs catalog
 *     tags:
 *       - Songs
 *     responses:
 *       200:
 *         description: Demo songs returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DemoSongsResponse'
 */
songRouter.get("/songs/demo", (_request, response) => {
  sendSuccess(response, demoSongsCatalog);
});

export { songRouter };
