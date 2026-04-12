import { randomUUID } from "crypto";
import { Song } from "../../core/data-structures/song.type";
import { songRepository } from "../repositories/repository.instance";
import { songLibraryService } from "./song-library.instance";

interface CreateImportedSongInput {
  title: string;
  artist: string;
  duration: number;
  coverUrl?: string;
  audioUrl: string;
}

const createImportedSong = async (
  input: CreateImportedSongInput
): Promise<Song> => {
  const song: Song = {
    id: randomUUID(),
    title: input.title,
    artist: input.artist,
    duration: input.duration,
    coverUrl: input.coverUrl,
    audioUrl: input.audioUrl,
    isDemo: false,
    isImported: true
  };

  await songRepository.create(song);
  songLibraryService.addSong(song);

  return song;
};

export { createImportedSong };
