import { Router } from "express";
import fs from "fs/promises";
import { asyncHandler } from "../modules/http/async-handler";
import { sendError, sendMessage, sendSuccess } from "../modules/http/api-response";
import { AppError } from "../modules/http/app-error";
import {
  sanitizeNonEmptyString,
  sanitizeOptionalString,
  sanitizePositiveNumber,
  sanitizeRouteId
} from "../modules/http/request-validation";
import { uploadSingleAudio } from "../modules/http/upload-audio";
import { deleteSongFromLibrary } from "../modules/services/song-deletion.service";
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
 */
songRouter.get("/songs", (_request, response) => {
  sendSuccess(response, songLibraryService.getAllSongs());
});

/**
 * @openapi
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
 */
songRouter.get("/songs/search", (request, response) => {
  const query = sanitizeNonEmptyString(request.query.q);

  if (!query) {
    sendError(response, 400, "INVALID_QUERY", "Query parameter q is required");
    return;
  }

  sendSuccess(response, songLibraryService.searchSongs(query));
});

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
  sendSuccess(response, songLibraryService.getAllSongs());
});

/**
 * @openapi
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
songRouter.get("/songs/:id", (request, response) => {
  const songId = sanitizeRouteId(request.params.id);

  if (!songId) {
    sendError(response, 400, "INVALID_SONG_ID", "songId must be a non-empty string");
    return;
  }

  const song = songLibraryService.getSongById(songId);

  if (!song) {
    sendError(response, 404, "SONG_NOT_FOUND", "Song not found");
    return;
  }

  sendSuccess(response, song);
});

/**
 * @openapi
 * /songs/{id}:
 *   delete:
 *     summary: Delete a song from the global library
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
 *         description: Song deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: Song not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
songRouter.delete("/songs/:id", asyncHandler(async (request, response) => {
  const songId = sanitizeRouteId(request.params.id);

  if (!songId) {
    sendError(response, 400, "INVALID_SONG_ID", "songId must be a non-empty string");
    return;
  }

  const deletedSong = await deleteSongFromLibrary(songId);

  if (!deletedSong) {
    sendError(response, 404, "SONG_NOT_FOUND", "Song not found");
    return;
  }

  sendMessage(response, "Song deleted successfully");
}));

/**
 * @openapi
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
songRouter.post("/songs/imported", asyncHandler(async (request, response) => {
  const { title, artist, duration, coverUrl, audioUrl } = request.body as {
    title?: unknown;
    artist?: unknown;
    duration?: unknown;
    coverUrl?: unknown;
    audioUrl?: unknown;
  };
  const sanitizedTitle = sanitizeNonEmptyString(title);
  const sanitizedArtist = sanitizeNonEmptyString(artist);
  const sanitizedDuration = sanitizePositiveNumber(duration);
  const sanitizedAudioUrl = sanitizeNonEmptyString(audioUrl);
  const sanitizedCoverUrl = sanitizeOptionalString(coverUrl);

  if (
    typeof title !== "string" ||
    typeof artist !== "string" ||
    typeof audioUrl !== "string" ||
    typeof duration !== "number"
  ) {
    sendError(
      response,
      400,
      "INVALID_BODY",
      "Body must include title, artist, duration, and audioUrl"
    );
    return;
  }

  if (!sanitizedTitle || !sanitizedArtist || !sanitizedAudioUrl || !sanitizedDuration) {
    sendError(
      response,
      400,
      "INVALID_BODY",
      "title, artist, and audioUrl must be non-empty, and duration must be greater than zero"
    );
    return;
  }

  if (
    coverUrl !== undefined &&
    coverUrl !== null &&
    typeof coverUrl !== "string"
  ) {
    sendError(response, 400, "INVALID_BODY", "coverUrl must be a string or null");
    return;
  }

  const song = await createImportedSong({
    title: sanitizedTitle,
    artist: sanitizedArtist,
    duration: sanitizedDuration,
    coverUrl: sanitizedCoverUrl ?? undefined,
    audioUrl: sanitizedAudioUrl
  });

  sendSuccess(response, song, 201);
}));

/**
 * @openapi
 * /songs/upload:
 *   post:
 *     summary: Upload an audio file and create imported song metadata
 *     tags:
 *       - Songs
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UploadSongRequest'
 *     responses:
 *       201:
 *         description: Uploaded song created successfully
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
 *         description: Invalid upload request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
songRouter.post(
  "/songs/upload",
  uploadSingleAudio,
  asyncHandler(async (request, response) => {
    if (!request.file) {
      throw new AppError(400, "FILE_REQUIRED", "An audio file is required");
    }

    const title = sanitizeNonEmptyString(request.body.title);
    const artist = sanitizeNonEmptyString(request.body.artist) ?? "Unknown Artist";

    if (!title) {
      await fs.unlink(request.file.path);
      throw new AppError(400, "INVALID_BODY", "title must be a non-empty string");
    }

    let song;

    try {
      song = await createImportedSong({
        title,
        artist,
        duration: 0,
        coverUrl: undefined,
        audioUrl: `/uploads/audio/${request.file.filename}`
      });
    } catch (error) {
      await fs.unlink(request.file.path).catch(() => undefined);
      throw error;
    }

    sendSuccess(response, song, 201);
  })
);

export { songRouter };
