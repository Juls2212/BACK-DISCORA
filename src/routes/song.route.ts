import { Router } from "express";
import { asyncHandler } from "../modules/http/async-handler";
import { sendError, sendSuccess } from "../modules/http/api-response";
import { songLibraryService } from "../modules/services/song-library.instance";
import { createImportedSong } from "../modules/services/song-persistence.service";

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
 * /songs/imported:
 *   post:
 *     summary: Create imported song metadata
 *     tags:
 *       - Songs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateImportedSongRequest'
 *     responses:
 *       201:
 *         description: Imported song created successfully
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
 *       400:
 *         description: Invalid request body
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

songRouter.post("/songs/imported", asyncHandler(async (request, response) => {
  const { title, artist, duration, coverUrl, audioUrl } = request.body as {
    title?: unknown;
    artist?: unknown;
    duration?: unknown;
    coverUrl?: unknown;
    audioUrl?: unknown;
  };

  if (
    typeof title !== "string" ||
    typeof artist !== "string" ||
    typeof duration !== "number" ||
    typeof audioUrl !== "string"
  ) {
    sendError(
      response,
      400,
      "INVALID_BODY",
      "Body must include title, artist, duration, and audioUrl"
    );
    return;
  }

  if (!title.trim() || !artist.trim() || !audioUrl.trim() || duration <= 0) {
    sendError(
      response,
      400,
      "INVALID_BODY",
      "title, artist, and audioUrl must be non-empty, and duration must be greater than zero"
    );
    return;
  }

  if (coverUrl !== undefined && coverUrl !== null && typeof coverUrl !== "string") {
    sendError(response, 400, "INVALID_BODY", "coverUrl must be a string or null");
    return;
  }

  const song = await createImportedSong({
    title: title.trim(),
    artist: artist.trim(),
    duration,
    coverUrl: typeof coverUrl === "string" ? coverUrl.trim() || undefined : undefined,
    audioUrl: audioUrl.trim()
  });

  sendSuccess(response, song, 201);
}));

export { songRouter };
