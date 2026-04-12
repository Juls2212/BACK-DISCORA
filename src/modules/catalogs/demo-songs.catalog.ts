import { songLibraryService } from "../services/song-library.instance";

const demoSongsCatalog = songLibraryService.getAllSongs();

const getDemoSongById = (songId: string) => {
  return songLibraryService.getSongById(songId);
};

export { demoSongsCatalog, getDemoSongById };
