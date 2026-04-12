import { songLibraryService } from "../services/song-library.instance";
import { SerializedPlaylist } from "../services/playlist.service";
import { playlistService } from "../services/playlist-service.instance";

let nextDemoSongIndex = 0;

const getOrCreatePlaygroundPlaylist = () => {
  const existingPlaylist = playlistService
    .getAllPlaylists()
    .find((playlist) => playlist.name === "Demo Playlist");

  if (existingPlaylist) {
    return existingPlaylist;
  }

  const playlist = playlistService.createPlaylist("Demo Playlist");

  for (const song of songLibraryService.getAllSongs()) {
    playlistService.addSongToPlaylist(playlist.id, song);
  }

  return playlist;
};

const getNextDemoSong = () => {
  const songs = songLibraryService.getAllSongs();
  const song = songs[nextDemoSongIndex];
  nextDemoSongIndex = (nextDemoSongIndex + 1) % songs.length;
  return song;
};

const buildPlaylistResponse = (): SerializedPlaylist => {
  const playlist = getOrCreatePlaygroundPlaylist();
  return playlistService.serializePlaylist(playlist);
};

export { buildPlaylistResponse, getNextDemoSong, getOrCreatePlaygroundPlaylist, playlistService };
