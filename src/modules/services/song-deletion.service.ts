import fs from "fs/promises";
import path from "path";
import { Song } from "../../core/data-structures/song.type";
import { songRepository } from "../repositories/repository.instance";
import { playlistService } from "./playlist-service.instance";
import { persistPlaylistState } from "./persistence-sync.service";
import { songLibraryService } from "./song-library.instance";

const isUploadedAudioUrl = (audioUrl: string): boolean => {
  return audioUrl.startsWith("/uploads/audio/");
};

const deleteUploadedFileIfNeeded = async (song: Song): Promise<void> => {
  if (!isUploadedAudioUrl(song.audioUrl)) {
    return;
  }

  const relativeFilePath = song.audioUrl.replace(/^\//, "").split("/").join(path.sep);
  const absoluteFilePath = path.resolve(process.cwd(), relativeFilePath);

  await fs.unlink(absoluteFilePath).catch(() => undefined);
};

const deleteSongFromLibrary = async (songId: string): Promise<Song | null> => {
  const song = songLibraryService.getSongById(songId);

  if (!song) {
    return null;
  }

  const affectedPlaylistIds = playlistService.removeSongEverywhere(songId);

  for (const playlistId of affectedPlaylistIds) {
    await persistPlaylistState(playlistId);
  }

  await songRepository.deleteById(songId);
  songLibraryService.removeSongById(songId);
  await deleteUploadedFileIfNeeded(song);

  return song;
};

export { deleteSongFromLibrary };
