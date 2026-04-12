import { Router } from "express";
import { sendError, sendSuccess } from "../modules/http/api-response";
import { songLibraryService } from "../modules/services/song-library.instance";

const songRouter = Router();

/**
 * @openapi
 * /songs:
 *   get:
 *     summary: Get all songs from the global library
 *     tags:
 *       - Songs
 *     responses:
 *       200:
 *         description: Songs returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DemoSongsResponse'
 * /songs/search:
 *   get:
 *     summary: Search songs by title or artist
 *     tags:
 *       - Songs
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Filtered songs returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DemoSongsResponse'
 *       400:
 *         description: Missing or invalid search query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * /songs/{id}:
 *   get:
 *     summary: Get a single song by id
 *     tags:
 *       - Songs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Song returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Song'
 *       404:
 *         description: Song not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
songRouter.get("/songs", (_request, response) => {
  sendSuccess(response, songLibraryService.getAllSongs());
});

songRouter.get("/songs/search", (request, response) => {
  const query = request.query.q;

  if (typeof query !== "string" || !query.trim()) {
    sendError(response, 400, "INVALID_QUERY", "Query parameter q is required");
    return;
  }

  sendSuccess(response, songLibraryService.searchSongs(query));
});

songRouter.get("/songs/demo", (_request, response) => {
  sendSuccess(response, songLibraryService.getAllSongs());
});

songRouter.get("/songs/:id", (request, response) => {
  const song = songLibraryService.getSongById(request.params.id);

  if (!song) {
    sendError(response, 404, "SONG_NOT_FOUND", "Song not found");
    return;
  }

  sendSuccess(response, song);
});

export { songRouter };
