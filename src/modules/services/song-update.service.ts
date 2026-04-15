import { Song } from "../../core/data-structures/song.type";
import { songRepository } from "../repositories/repository.instance";
import { songLibraryService } from "./song-library.instance";

interface UpdateSongInput {
  title?: string;
  artist?: string;
}

const updateSongInLibrary = async (
  songId: string,
  updates: UpdateSongInput
): Promise<Song | null> => {
  const existingSong = songLibraryService.getSongById(songId);

  if (!existingSong) {
    return null;
  }

  const nextTitle = updates.title ?? existingSong.title;
  const nextArtist = updates.artist ?? existingSong.artist;

  await songRepository.updateById(songId, nextTitle, nextArtist);

  return songLibraryService.updateSong(songId, {
    title: updates.title,
    artist: updates.artist
  });
};

export { updateSongInLibrary };
