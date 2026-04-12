import { demoSongsCatalog } from "../catalogs/demo-songs.catalog";
import {
  PlaylistService,
  SerializedPlaylist
} from "../services/playlist.service";

const playlistService = new PlaylistService();
const playlist = playlistService.createPlaylist("Demo Playlist");
let nextDemoSongIndex = 0;

for (const song of demoSongsCatalog) {
  playlistService.addSongToPlaylist(playlist.id, song);
}

const getNextDemoSong = () => {
  const song = demoSongsCatalog[nextDemoSongIndex];
  nextDemoSongIndex = (nextDemoSongIndex + 1) % demoSongsCatalog.length;
  return song;
};

const buildPlaylistResponse = (): SerializedPlaylist => {
  return playlistService.serializePlaylist(playlist);
};

export { buildPlaylistResponse, getNextDemoSong, playlist, playlistService };
