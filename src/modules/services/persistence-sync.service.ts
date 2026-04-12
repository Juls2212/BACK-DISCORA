import { Song } from "../../core/data-structures/song.type";
import { songLibraryService } from "./song-library.instance";
import { playlistService } from "./playlist-service.instance";
import {
  playlistRepository,
  playlistSongRepository,
  songRepository
} from "../repositories/repository.instance";

const syncPlaylistNodes = async (playlistId: string): Promise<void> => {
  const playlist = playlistService.getPlaylistById(playlistId);

  if (!playlist) {
    return;
  }

  const nodes = playlist.toArray().map((node) => ({
    playlistId: playlist.id,
    nodeId: node.nodeId,
    songId: node.song.id,
    prevNodeId: node.prevNodeId,
    nextNodeId: node.nextNodeId,
    isCurrent: playlist.current?.nodeId === node.nodeId
  }));

  await playlistSongRepository.replaceForPlaylist(playlist.id, nodes);
};

const hydrateSongsFromDatabase = async (): Promise<Map<string, Song>> => {
  const storedSongs = await songRepository.findAll();
  const songs = storedSongs.map((song) => songRepository.mapToSong(song));
  songLibraryService.setSongs(songs);

  return new Map<string, Song>(songs.map((song) => [song.id, song]));
};

const hydratePlaylistsFromDatabase = async (songsById: Map<string, Song>): Promise<void> => {
  const storedPlaylists = await playlistRepository.findAll();
  playlistService.clearPlaylists();

  for (const storedPlaylist of storedPlaylists) {
    const storedNodes = await playlistSongRepository.findByPlaylistId(storedPlaylist.id);
    const nodes = storedNodes
      .map((storedNode) => {
        const song = songsById.get(storedNode.song_id);

        if (!song) {
          return null;
        }

        return {
          nodeId: storedNode.node_id,
          song,
          prevNodeId: storedNode.prev_node_id,
          nextNodeId: storedNode.next_node_id,
          isCurrent: storedNode.is_current
        };
      })
      .filter((node): node is NonNullable<typeof node> => node !== null);

    playlistService.rebuildPlaylist(storedPlaylist.id, storedPlaylist.name, nodes);
  }
};

const hydrateApplicationState = async (): Promise<void> => {
  const songsById = await hydrateSongsFromDatabase();
  await hydratePlaylistsFromDatabase(songsById);
};

const persistCreatedPlaylist = async (playlistId: string): Promise<void> => {
  const playlist = playlistService.getPlaylistById(playlistId);

  if (!playlist) {
    return;
  }

  await playlistRepository.create(playlist.id, playlist.name);
  await syncPlaylistNodes(playlist.id);
};

const persistRenamedPlaylist = async (playlistId: string): Promise<void> => {
  const playlist = playlistService.getPlaylistById(playlistId);

  if (!playlist) {
    return;
  }

  await playlistRepository.rename(playlist.id, playlist.name);
};

const persistDeletedPlaylist = async (playlistId: string): Promise<void> => {
  await playlistSongRepository.deleteByPlaylistId(playlistId);
  await playlistRepository.delete(playlistId);
};

const persistPlaylistState = async (playlistId: string): Promise<void> => {
  const playlist = playlistService.getPlaylistById(playlistId);

  if (!playlist) {
    return;
  }

  await playlistRepository.rename(playlist.id, playlist.name);
  await syncPlaylistNodes(playlist.id);
};

export {
  hydrateApplicationState,
  persistCreatedPlaylist,
  persistDeletedPlaylist,
  persistPlaylistState,
  persistRenamedPlaylist
};
