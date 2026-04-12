import { Router } from "express";
import { sendError, sendSuccess } from "../modules/http/api-response";
import {
  buildPlaylistResponse,
  getNextDemoSong,
  getOrCreatePlaygroundPlaylist,
  playlistService
} from "../modules/playground/playground.store";

const playgroundRouter = Router();

playgroundRouter.get("/playground", (_request, response) => {
  sendSuccess(response, buildPlaylistResponse());
});

playgroundRouter.post("/playground/add", (_request, response) => {
  const playlist = getOrCreatePlaygroundPlaylist();
  const song = getNextDemoSong();
  playlistService.addSongToPlaylist(playlist.id, song);

  sendSuccess(response, buildPlaylistResponse(), 201);
});

playgroundRouter.delete("/playground/:nodeId", (request, response) => {
  const playlist = getOrCreatePlaygroundPlaylist();
  const updatedPlaylist = playlistService.removeSongFromPlaylist(
    playlist.id,
    request.params.nodeId
  );

  if (!updatedPlaylist) {
    sendError(response, 404, "NODE_NOT_FOUND", "Node not found");
    return;
  }

  sendSuccess(response, buildPlaylistResponse());
});

playgroundRouter.patch("/playground/:nodeId/current", (request, response) => {
  const playlist = getOrCreatePlaygroundPlaylist();
  const updatedPlaylist = playlistService.setCurrentSong(
    playlist.id,
    request.params.nodeId
  );

  if (!updatedPlaylist) {
    sendError(response, 404, "NODE_NOT_FOUND", "Node not found");
    return;
  }

  sendSuccess(response, buildPlaylistResponse());
});

playgroundRouter.patch("/playground/next", (_request, response) => {
  const playlist = getOrCreatePlaygroundPlaylist();
  const updatedPlaylist = playlistService.playNext(playlist.id);

  if (!updatedPlaylist) {
    sendError(response, 400, "NEXT_NOT_AVAILABLE", "There is no next node");
    return;
  }

  sendSuccess(response, buildPlaylistResponse());
});

playgroundRouter.patch("/playground/prev", (_request, response) => {
  const playlist = getOrCreatePlaygroundPlaylist();
  const updatedPlaylist = playlistService.playPrevious(playlist.id);

  if (!updatedPlaylist) {
    sendError(response, 400, "PREVIOUS_NOT_AVAILABLE", "There is no previous node");
    return;
  }

  sendSuccess(response, buildPlaylistResponse());
});

playgroundRouter.patch("/playground/:nodeId/up", (request, response) => {
  const playlist = getOrCreatePlaygroundPlaylist();
  const updatedPlaylist = playlistService.moveSongUp(
    playlist.id,
    request.params.nodeId
  );

  if (!updatedPlaylist) {
    sendError(response, 400, "MOVE_NOT_ALLOWED", "Node cannot be moved up");
    return;
  }

  sendSuccess(response, buildPlaylistResponse());
});

playgroundRouter.patch("/playground/:nodeId/down", (request, response) => {
  const playlist = getOrCreatePlaygroundPlaylist();
  const updatedPlaylist = playlistService.moveSongDown(
    playlist.id,
    request.params.nodeId
  );

  if (!updatedPlaylist) {
    sendError(response, 400, "MOVE_NOT_ALLOWED", "Node cannot be moved down");
    return;
  }

  sendSuccess(response, buildPlaylistResponse());
});

export { playgroundRouter };
