import { Router } from "express";
import { getDemoSongById } from "../modules/catalogs/demo-songs.catalog";
import { playlistService } from "../modules/services/playlist-service.instance";

const playlistRouter = Router();

playlistRouter.get("/playlists", (_request, response) => {
  response.json(playlistService.serializeAllPlaylists());
});

playlistRouter.post("/playlists", (request, response) => {
  const { name } = request.body as { name?: string };

  if (!name || !name.trim()) {
    response.status(400).json({ message: "Playlist name is required" });
    return;
  }

  const playlist = playlistService.createPlaylist(name.trim());
  response.status(201).json(playlistService.serializePlaylist(playlist));
});

playlistRouter.get("/playlists/:id", (request, response) => {
  const playlist = playlistService.getPlaylistById(request.params.id);

  if (!playlist) {
    response.status(404).json({ message: "Playlist not found" });
    return;
  }

  response.json(playlistService.serializePlaylist(playlist));
});

playlistRouter.patch("/playlists/:id", (request, response) => {
  const { name } = request.body as { name?: string };

  if (!name || !name.trim()) {
    response.status(400).json({ message: "Playlist name is required" });
    return;
  }

  const playlist = playlistService.renamePlaylist(request.params.id, name.trim());

  if (!playlist) {
    response.status(404).json({ message: "Playlist not found" });
    return;
  }

  response.json(playlistService.serializePlaylist(playlist));
});

playlistRouter.delete("/playlists/:id", (request, response) => {
  const wasDeleted = playlistService.deletePlaylist(request.params.id);

  if (!wasDeleted) {
    response.status(404).json({ message: "Playlist not found" });
    return;
  }

  response.status(204).send();
});

playlistRouter.post("/playlists/:id/songs", (request, response) => {
  const { songId } = request.body as { songId?: string };

  if (!songId) {
    response.status(400).json({ message: "songId is required" });
    return;
  }

  const song = getDemoSongById(songId);

  if (!song) {
    response.status(404).json({ message: "Song not found in demo catalog" });
    return;
  }

  const playlist = playlistService.addSongToPlaylist(request.params.id, song);

  if (!playlist) {
    response.status(404).json({ message: "Playlist not found" });
    return;
  }

  response.status(201).json(playlistService.serializePlaylist(playlist));
});

playlistRouter.delete("/playlists/:id/songs/:nodeId", (request, response) => {
  const playlist = playlistService.removeSongFromPlaylist(
    request.params.id,
    request.params.nodeId
  );

  if (!playlist) {
    response.status(404).json({ message: "Playlist or node not found" });
    return;
  }

  response.json(playlistService.serializePlaylist(playlist));
});

playlistRouter.patch("/playlists/:id/songs/:nodeId/move-up", (request, response) => {
  const playlist = playlistService.moveSongUp(request.params.id, request.params.nodeId);

  if (!playlist) {
    response.status(404).json({ message: "Playlist or node not found" });
    return;
  }

  response.json(playlistService.serializePlaylist(playlist));
});

playlistRouter.patch("/playlists/:id/songs/:nodeId/move-down", (request, response) => {
  const playlist = playlistService.moveSongDown(request.params.id, request.params.nodeId);

  if (!playlist) {
    response.status(404).json({ message: "Playlist or node not found" });
    return;
  }

  response.json(playlistService.serializePlaylist(playlist));
});

playlistRouter.patch("/playlists/:id/current/:nodeId", (request, response) => {
  const playlist = playlistService.setCurrentSong(request.params.id, request.params.nodeId);

  if (!playlist) {
    response.status(404).json({ message: "Playlist or node not found" });
    return;
  }

  response.json(playlistService.serializePlaylist(playlist));
});

playlistRouter.patch("/playlists/:id/player/next", (request, response) => {
  const playlist = playlistService.playNext(request.params.id);

  if (!playlist) {
    response.status(404).json({ message: "Playlist not found or no next node" });
    return;
  }

  response.json(playlistService.serializePlaylist(playlist));
});

playlistRouter.patch("/playlists/:id/player/previous", (request, response) => {
  const playlist = playlistService.playPrevious(request.params.id);

  if (!playlist) {
    response.status(404).json({ message: "Playlist not found or no previous node" });
    return;
  }

  response.json(playlistService.serializePlaylist(playlist));
});

export { playlistRouter };
