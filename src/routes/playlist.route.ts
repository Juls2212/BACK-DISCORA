import { Router } from "express";
import { getDemoSongById } from "../modules/catalogs/demo-songs.catalog";
import { sendError, sendSuccess } from "../modules/http/api-response";
import { playlistService } from "../modules/services/playlist-service.instance";

const playlistRouter = Router();

const getPlaylistOrSendNotFound = (playlistId: string, response: Parameters<typeof sendError>[0]) => {
  const playlist = playlistService.getPlaylistById(playlistId);

  if (!playlist) {
    sendError(response, 404, "PLAYLIST_NOT_FOUND", "Playlist not found");
    return null;
  }

  return playlist;
};

const getNodeOrSendNotFound = (
  playlistId: string,
  nodeId: string,
  response: Parameters<typeof sendError>[0]
) => {
  const playlist = getPlaylistOrSendNotFound(playlistId, response);

  if (!playlist) {
    return null;
  }

  const node = playlist.findNode(nodeId);

  if (!node) {
    sendError(response, 404, "NODE_NOT_FOUND", "Node not found");
    return null;
  }

  return { playlist, node };
};

/**
 * @openapi
 * /playlists:
 *   get:
 *     summary: Get all playlists
 *     tags:
 *       - Playlists
 *     responses:
 *       200:
 *         description: Playlists returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistListResponse'
 *   post:
 *     summary: Create a playlist
 *     tags:
 *       - Playlists
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePlaylistRequest'
 *     responses:
 *       201:
 *         description: Playlist created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistResponse'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playlistRouter.get("/playlists", (_request, response) => {
  sendSuccess(response, playlistService.serializeAllPlaylists());
});

playlistRouter.post("/playlists", (request, response) => {
  const { name } = request.body as { name?: unknown };

  if (typeof name !== "string") {
    sendError(response, 400, "INVALID_BODY", "Body must include a string name");
    return;
  }

  if (!name.trim()) {
    sendError(response, 400, "EMPTY_PLAYLIST_NAME", "Playlist name cannot be empty");
    return;
  }

  const playlist = playlistService.createPlaylist(name.trim());
  sendSuccess(response, playlistService.serializePlaylist(playlist), 201);
});

/**
 * @openapi
 * /playlists/{id}:
 *   get:
 *     summary: Get a playlist by id
 *     tags:
 *       - Playlists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistResponse'
 *       404:
 *         description: Playlist not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   patch:
 *     summary: Rename a playlist
 *     tags:
 *       - Playlists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RenamePlaylistRequest'
 *     responses:
 *       200:
 *         description: Playlist renamed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistResponse'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Playlist not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete a playlist
 *     tags:
 *       - Playlists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteResponse'
 *       404:
 *         description: Playlist not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playlistRouter.get("/playlists/:id", (request, response) => {
  const playlist = getPlaylistOrSendNotFound(request.params.id, response);

  if (!playlist) {
    return;
  }

  sendSuccess(response, playlistService.serializePlaylist(playlist));
});

playlistRouter.patch("/playlists/:id", (request, response) => {
  const { name } = request.body as { name?: unknown };

  if (typeof name !== "string") {
    sendError(response, 400, "INVALID_BODY", "Body must include a string name");
    return;
  }

  if (!name.trim()) {
    sendError(response, 400, "EMPTY_PLAYLIST_NAME", "Playlist name cannot be empty");
    return;
  }

  const playlist = playlistService.renamePlaylist(request.params.id, name.trim());

  if (!playlist) {
    sendError(response, 404, "PLAYLIST_NOT_FOUND", "Playlist not found");
    return;
  }

  sendSuccess(response, playlistService.serializePlaylist(playlist));
});

playlistRouter.delete("/playlists/:id", (request, response) => {
  const playlist = getPlaylistOrSendNotFound(request.params.id, response);

  if (!playlist) {
    return;
  }

  playlistService.deletePlaylist(request.params.id);
  sendSuccess(response, { id: playlist.id, deleted: true });
});

/**
 * @openapi
 * /playlists/{id}/songs:
 *   post:
 *     summary: Add a demo song to a playlist
 *     tags:
 *       - Playlists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddSongRequest'
 *     responses:
 *       201:
 *         description: Song added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistResponse'
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Playlist or song not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playlistRouter.post("/playlists/:id/songs", (request, response) => {
  const playlist = getPlaylistOrSendNotFound(request.params.id, response);

  if (!playlist) {
    return;
  }

  const { songId } = request.body as { songId?: unknown };

  if (typeof songId !== "string" || !songId.trim()) {
    sendError(response, 400, "INVALID_BODY", "Body must include a non-empty string songId");
    return;
  }

  const song = getDemoSongById(songId.trim());

  if (!song) {
    sendError(response, 404, "SONG_NOT_FOUND", "Song not found in demo catalog");
    return;
  }

  playlistService.addSongToPlaylist(playlist.id, song);
  sendSuccess(response, playlistService.serializePlaylist(playlist), 201);
});

/**
 * @openapi
 * /playlists/{id}/songs/{nodeId}:
 *   delete:
 *     summary: Remove a song node from a playlist
 *     tags:
 *       - Playlists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: nodeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Song node removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistResponse'
 *       404:
 *         description: Playlist or node not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playlistRouter.delete("/playlists/:id/songs/:nodeId", (request, response) => {
  const result = getNodeOrSendNotFound(request.params.id, request.params.nodeId, response);

  if (!result) {
    return;
  }

  playlistService.removeSongFromPlaylist(result.playlist.id, request.params.nodeId);
  sendSuccess(response, playlistService.serializePlaylist(result.playlist));
});

/**
 * @openapi
 * /playlists/{id}/songs/{nodeId}/move-up:
 *   patch:
 *     summary: Move a song node up inside a playlist
 *     tags:
 *       - Playlists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: nodeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Song node moved up successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistResponse'
 *       400:
 *         description: Node cannot be moved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Playlist or node not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playlistRouter.patch("/playlists/:id/songs/:nodeId/move-up", (request, response) => {
  const result = getNodeOrSendNotFound(request.params.id, request.params.nodeId, response);

  if (!result) {
    return;
  }

  if (!result.node.prev) {
    sendError(response, 400, "MOVE_NOT_ALLOWED", "Node is already at the top");
    return;
  }

  playlistService.moveSongUp(result.playlist.id, request.params.nodeId);
  sendSuccess(response, playlistService.serializePlaylist(result.playlist));
});

/**
 * @openapi
 * /playlists/{id}/songs/{nodeId}/move-down:
 *   patch:
 *     summary: Move a song node down inside a playlist
 *     tags:
 *       - Playlists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: nodeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Song node moved down successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistResponse'
 *       400:
 *         description: Node cannot be moved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Playlist or node not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playlistRouter.patch("/playlists/:id/songs/:nodeId/move-down", (request, response) => {
  const result = getNodeOrSendNotFound(request.params.id, request.params.nodeId, response);

  if (!result) {
    return;
  }

  if (!result.node.next) {
    sendError(response, 400, "MOVE_NOT_ALLOWED", "Node is already at the bottom");
    return;
  }

  playlistService.moveSongDown(result.playlist.id, request.params.nodeId);
  sendSuccess(response, playlistService.serializePlaylist(result.playlist));
});

/**
 * @openapi
 * /playlists/{id}/current/{nodeId}:
 *   patch:
 *     summary: Set the current song node in a playlist
 *     tags:
 *       - Playlists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: nodeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Current song updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistResponse'
 *       404:
 *         description: Playlist or node not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playlistRouter.patch("/playlists/:id/current/:nodeId", (request, response) => {
  const result = getNodeOrSendNotFound(request.params.id, request.params.nodeId, response);

  if (!result) {
    return;
  }

  playlistService.setCurrentSong(result.playlist.id, request.params.nodeId);
  sendSuccess(response, playlistService.serializePlaylist(result.playlist));
});

/**
 * @openapi
 * /playlists/{id}/player/next:
 *   patch:
 *     summary: Move the player to the next node
 *     tags:
 *       - Playlists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Player moved to the next node successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistResponse'
 *       400:
 *         description: No next node available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Playlist not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playlistRouter.patch("/playlists/:id/player/next", (request, response) => {
  const playlist = getPlaylistOrSendNotFound(request.params.id, response);

  if (!playlist) {
    return;
  }

  if (!playlist.current || !playlist.current.next) {
    sendError(response, 400, "NEXT_NOT_AVAILABLE", "There is no next node");
    return;
  }

  playlistService.playNext(playlist.id);
  sendSuccess(response, playlistService.serializePlaylist(playlist));
});

/**
 * @openapi
 * /playlists/{id}/player/previous:
 *   patch:
 *     summary: Move the player to the previous node
 *     tags:
 *       - Playlists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Player moved to the previous node successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlaylistResponse'
 *       400:
 *         description: No previous node available
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Playlist not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
playlistRouter.patch("/playlists/:id/player/previous", (request, response) => {
  const playlist = getPlaylistOrSendNotFound(request.params.id, response);

  if (!playlist) {
    return;
  }

  if (!playlist.current || !playlist.current.prev) {
    sendError(response, 400, "PREVIOUS_NOT_AVAILABLE", "There is no previous node");
    return;
  }

  playlistService.playPrevious(playlist.id);
  sendSuccess(response, playlistService.serializePlaylist(playlist));
});

export { playlistRouter };
