import { Router } from "express";
import {
  buildPlaylistResponse,
  getNextDemoSong,
  getOrCreatePlaygroundPlaylist,
  playlistService
} from "../modules/playground/playground.store";

const playgroundRouter = Router();

playgroundRouter.get("/playground", (_request, response) => {
  response.json(buildPlaylistResponse());
});

playgroundRouter.post("/playground/add", (_request, response) => {
  const playlist = getOrCreatePlaygroundPlaylist();
  const song = getNextDemoSong();
  playlistService.addSongToPlaylist(playlist.id, song);

  response.status(201).json(buildPlaylistResponse());
});

playgroundRouter.delete("/playground/:nodeId", (request, response) => {
  const playlist = getOrCreatePlaygroundPlaylist();
  const updatedPlaylist = playlistService.removeSongFromPlaylist(
    playlist.id,
    request.params.nodeId
  );

  if (!updatedPlaylist) {
    response.status(404).json({ message: "Node not found" });
    return;
  }

  response.json(buildPlaylistResponse());
});

playgroundRouter.patch("/playground/:nodeId/current", (request, response) => {
  const playlist = getOrCreatePlaygroundPlaylist();
  const updatedPlaylist = playlistService.setCurrentSong(
    playlist.id,
    request.params.nodeId
  );

  if (!updatedPlaylist) {
    response.status(404).json({ message: "Node not found" });
    return;
  }

  response.json(buildPlaylistResponse());
});

playgroundRouter.patch("/playground/next", (_request, response) => {
  const playlist = getOrCreatePlaygroundPlaylist();
  const updatedPlaylist = playlistService.playNext(playlist.id);

  if (!updatedPlaylist) {
    response.status(400).json({ message: "There is no next node" });
    return;
  }

  response.json(buildPlaylistResponse());
});

playgroundRouter.patch("/playground/prev", (_request, response) => {
  const playlist = getOrCreatePlaygroundPlaylist();
  const updatedPlaylist = playlistService.playPrevious(playlist.id);

  if (!updatedPlaylist) {
    response.status(400).json({ message: "There is no previous node" });
    return;
  }

  response.json(buildPlaylistResponse());
});

playgroundRouter.patch("/playground/:nodeId/up", (request, response) => {
  const playlist = getOrCreatePlaygroundPlaylist();
  const updatedPlaylist = playlistService.moveSongUp(
    playlist.id,
    request.params.nodeId
  );

  if (!updatedPlaylist) {
    response.status(400).json({ message: "Node cannot be moved up" });
    return;
  }

  response.json(buildPlaylistResponse());
});

playgroundRouter.patch("/playground/:nodeId/down", (request, response) => {
  const playlist = getOrCreatePlaygroundPlaylist();
  const updatedPlaylist = playlistService.moveSongDown(
    playlist.id,
    request.params.nodeId
  );

  if (!updatedPlaylist) {
    response.status(400).json({ message: "Node cannot be moved down" });
    return;
  }

  response.json(buildPlaylistResponse());
});

export { playgroundRouter };
