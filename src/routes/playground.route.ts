import { Router } from "express";
import {
  buildPlaylistResponse,
  getNextDemoSong,
  playlist
} from "../modules/playground/playground.store";

const playgroundRouter = Router();

playgroundRouter.get("/playground", (_request, response) => {
  response.json(buildPlaylistResponse());
});

playgroundRouter.post("/playground/add", (_request, response) => {
  const song = getNextDemoSong();
  playlist.addSong(song);

  response.status(201).json(buildPlaylistResponse());
});

playgroundRouter.delete("/playground/:nodeId", (request, response) => {
  const removedNode = playlist.removeSong(request.params.nodeId);

  if (!removedNode) {
    response.status(404).json({ message: "Node not found" });
    return;
  }

  response.json(buildPlaylistResponse());
});

playgroundRouter.patch("/playground/:nodeId/current", (request, response) => {
  const currentNode = playlist.setCurrent(request.params.nodeId);

  if (!currentNode) {
    response.status(404).json({ message: "Node not found" });
    return;
  }

  response.json(buildPlaylistResponse());
});

playgroundRouter.patch("/playground/next", (_request, response) => {
  const nextNode = playlist.playNext();

  if (!nextNode) {
    response.status(400).json({ message: "There is no next node" });
    return;
  }

  response.json(buildPlaylistResponse());
});

playgroundRouter.patch("/playground/prev", (_request, response) => {
  const previousNode = playlist.playPrevious();

  if (!previousNode) {
    response.status(400).json({ message: "There is no previous node" });
    return;
  }

  response.json(buildPlaylistResponse());
});

playgroundRouter.patch("/playground/:nodeId/up", (request, response) => {
  const wasMoved = playlist.moveUp(request.params.nodeId);

  if (!wasMoved) {
    response.status(400).json({ message: "Node cannot be moved up" });
    return;
  }

  response.json(buildPlaylistResponse());
});

playgroundRouter.patch("/playground/:nodeId/down", (request, response) => {
  const wasMoved = playlist.moveDown(request.params.nodeId);

  if (!wasMoved) {
    response.status(400).json({ message: "Node cannot be moved down" });
    return;
  }

  response.json(buildPlaylistResponse());
});

export { playgroundRouter };
